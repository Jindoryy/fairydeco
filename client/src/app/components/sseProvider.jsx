'use client'

import { useCallback, createContext, useContext, useEffect } from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useRouter } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'

const useStore = create(
    persist(
        (set) => ({
            userId: null,
            setEventSource: (uid) => set({ userId: uid }),
            clearEventSource: () => set({ userId: null }),
        }),
        {
            name: 'sse-storage',
            onRehydrateStorage: () => (state) => {
                console.log('상태 복원 완료:', state)
            },
        }
    )
)

const SseContext = createContext()

export function SseProvider({ children }) {
    const { setEventSource, clearEventSource, userId } = useStore()
    const router = useRouter()

    const connect = useCallback(
        (userId) => {
            console.log('Connecting with userID:', userId)

            console.log('check1')
            const sse = new EventSource(
                `https://fairydeco.site/api/book/sse/${userId}`
            )
            setEventSource(userId)

            console.log('check2')

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

                if (Notification.permission === 'granted') {
                    new Notification('동화책 제작 완료!', {
                        body: `${bookName}의 제작이 완료되었습니다.`,
                        icon: bookCoverUrl,
                    })
                }

                sse.close()
                clearEventSource()
            })

            sse.onerror = (error) => {
                console.error('Failed to connect SSE', error)
                // clearEventSource()
            }
        },
        [setEventSource, clearEventSource, router]
    )

    useEffect(() => {
        if (userId) {
            connect(userId)
        }
    }, [userId])

    useEffect(() => {
        if ('Notification' in window) {
            Notification.requestPermission().then((permission) => {
                if (permission === 'granted') {
                    console.log('Notification permission granted.')
                } else {
                    console.log('Notification permission denied.')
                }
            })
        } else {
            console.log('This browser does not support notifications.')
            return
        }
    }, [])

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
