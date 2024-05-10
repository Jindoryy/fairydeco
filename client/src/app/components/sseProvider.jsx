'use client'

import { useCallback, createContext, useContext, useEffect } from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useRouter } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

const useStore = create(
    persist(
        (set) => ({
            eventSource: null,
            userId: null,
            setEventSource: (es, uid) => set({ eventSource: es, userId: uid }),
            clearEventSource: () => set({ eventSource: null, userId: null }),
        }),
        {
            name: 'sse-storage',
            storage: {
                // 변경된 부분: 'storage' 옵션 사용
                getItem: (name) => localStorage.getItem(name),
                setItem: (name, value) => localStorage.setItem(name, value),
                removeItem: (name) => localStorage.removeItem(name),
            },
        }
    )
)

const SseContext = createContext()

export function SseProvider({ children }) {
    const { eventSource, setEventSource, clearEventSource } = useStore()
    const router = useRouter()

    const connect = useCallback(
        (userId) => {
            if (eventSource) {
                eventSource.close()
            }

            const sse = new EventSource(
                `https://fairydeco.site/api/book/sse/${userId}`
            )
            setEventSource(sse, userId)

            sse.addEventListener('book-complete', (event) => {
                console.log(event.data)
                const { bookName, bookCoverUrl, bookId } = JSON.parse(
                    event.data
                )
                toast((t) => (
                    <div
                        className={`${
                            t.visible ? 'animate-enter' : 'animate-leave'
                        } pointer-events-auto flex w-full max-w-xl rounded-lg bg-white bg-opacity-80 shadow-lg ring-1 ring-black ring-opacity-5`}
                    >
                        <div
                            className="flex-1 cursor-pointer p-4"
                            onClick={() => {
                                toast.dismiss(t.id)
                                router.push(`/book/${bookId}`)
                            }}
                        >
                            <div className="flex items-start">
                                <div className="flex-shrink-0 pt-0.5">
                                    <img
                                        className="h-10 w-10 rounded-full"
                                        src={bookCoverUrl}
                                        alt=""
                                    />
                                </div>
                                <div className="ml-3 flex-1">
                                    <p className="text-sm font-medium text-gray-900">
                                        동화책 제작 완료!!
                                    </p>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {bookName}의 제작이 완료되었습니다.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => toast.dismiss(t.id)}
                            className="w-auto flex-none border-l border-gray-200 pl-4 pr-4 text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            Close
                        </button>
                    </div>
                ))

                sse.close()
                clearEventSource()
            })

            sse.onerror = () => {
                sse.close()
                clearEventSource()
            }
        },
        [eventSource, setEventSource, clearEventSource]
    )

    useEffect(() => {
        const storedUserId = localStorage.getItem('sse-storage')?.userId
        if (storedUserId) {
            connect(storedUserId)
        }

        return () => {
            if (eventSource) {
                eventSource.close()
            }
            clearEventSource()
        }
    }, [connect])

    return (
        <SseContext.Provider value={{ connect, disconnect: clearEventSource }}>
            <Toaster position="top-left" reverseOrder={false} />
            {children}
        </SseContext.Provider>
    )
}

export function useSse() {
    return useContext(SseContext)
}
