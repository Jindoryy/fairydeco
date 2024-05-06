'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'
import { motion } from 'framer-motion'

const SseContext = createContext()

export function SseProvider({ children }) {
    const [eventSources, setEventSources] = useState({})
    const router = useRouter()

    const connect = (bookId) => {
        if (eventSources[bookId]) {
            eventSources[bookId].close()
        }

        const sse = new EventSource(
            `https://fairydeco.site/api/book/sse/${bookId}`
        )

        // 이벤트 소스 상태 업데이트
        setEventSources((prev) => ({
            ...prev,
            [bookId]: sse,
        }))

        sse.addEventListener('book-complete', (event) => {
            toast.success(
                (t) => (
                    <div>
                        <div className="flex items-center">
                            <div
                                className="flex-grow cursor-pointer"
                                onClick={() => {
                                    toast.dismiss(t.id)
                                    router.push(`/book/${bookId}`)
                                }}
                            >
                                동화 {bookId}이(가) 완성되었습니다.
                            </div>
                            <button
                                className="ml-4 text-red-500"
                                onClick={() => toast.dismiss(t.id)}
                            >
                                ✖
                            </button>
                        </div>
                        <div className="mt-3">
                            <motion.div
                                className="h-1 bg-green-500"
                                initial={{ width: '100%' }}
                                animate={{ width: 0 }}
                                transition={{ duration: 20 }}
                            />
                        </div>
                    </div>
                ),
                {
                    duration: 20000, // 20초 동안 유지
                    position: 'top-right',
                }
            )

            // 이벤트 소스 목록에서 제거
            setEventSources((prev) => {
                const newSources = { ...prev }
                delete newSources[bookId]
                return newSources
            })
            sse.close()
        })

        sse.onerror = () => {
            // 오류 발생 시 즉시 이벤트 소스 닫기
            sse.close()

            // 이벤트 소스 목록에서 제거
            setEventSources((prev) => {
                const newSources = { ...prev }
                delete newSources[bookId]
                return newSources
            })
        }
    }

    const disconnect = (bookId) => {
        if (eventSources[bookId]) {
            eventSources[bookId].close()
            setEventSources((prev) => {
                const newSources = { ...prev }
                delete newSources[bookId]
                return newSources
            })
        }
    }

    const disconnectAll = () => {
        for (const bookId in eventSources) {
            eventSources[bookId].close()
        }
        setEventSources({})
    }

    useEffect(() => {
        // 컴포넌트 언마운트 시 모든 연결 종료
        return () => disconnectAll()
    }, [])

    return (
        <SseContext.Provider value={{ connect, disconnect, disconnectAll }}>
            <Toaster
                containerStyle={{
                    position: 'absolute',
                    top: '5rem',
                }}
            />
            {children}
        </SseContext.Provider>
    )
}

export function useSse() {
    return useContext(SseContext)
}
