'use client'

import { createContext, useContext, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'
import { motion } from 'framer-motion'

const SseContext = createContext()

export function SseProvider({ children }) {
    const [eventSource, setEventSource] = useState(null)
    const [message, setMessage] = useState('')
    const router = useRouter()

    const connect = (bookId) => {
        if (eventSource) {
            eventSource.close()
        }

        const sse = new EventSource(
            `https://fairydeco.site/api/book/sse/${bookId}`
        )
        setEventSource(sse)

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
                                동화 {bookId}이(가) 완성 되었습니다.
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
                    position: 'top-right', // 헤더 아래쪽에 표시
                }
            )
            sse.close()
            setEventSource(null)
        })

        sse.onerror = () => {
            sse.close()
            setEventSource(null)
        }
    }

    const disconnect = () => {
        if (eventSource) {
            eventSource.close()
            setEventSource(null)
        }
    }

    return (
        <SseContext.Provider value={{ connect, disconnect, message }}>
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
