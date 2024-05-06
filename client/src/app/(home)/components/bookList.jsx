'use client'

import Image from 'next/image'
import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

export default function BookList() {
    const router = useRouter()
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    const [bookList, setBookList] = useState([])
    const [bookNumber, setBookNumber] = useState(0)

    useEffect(() => {
        getBookList(bookNumber)
    }, [])

    const getBookList = async (bookNumber) => {
        try {
            const response = await axios.get(
                `${apiUrl}/book/main-list/${bookNumber}`
            )
            const newData = response.data.data
            const uniqueData = Array.from(new Set([...bookList, ...newData]))
            setBookList(uniqueData)
            const latestBookId = uniqueData[uniqueData.length - 1].bookId
            setBookNumber(latestBookId)
        } catch (error) {
            console.error('Get bookList failed: ', error)
        }
    }

    const onScroll = useCallback(() => {
        const scrollTop = document.documentElement.scrollTop
        const scrollHeight = document.documentElement.scrollHeight
        const clientHeight = document.documentElement.clientHeight

        if (scrollTop + clientHeight >= scrollHeight) {
            getBookList(bookNumber)
        }
    }, [bookNumber])

    useEffect(() => {
        const handleScroll = () => {
            onScroll()
        }
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [onScroll])

    const handleBook = async (e) => {
        try {
            const response = await axios.get(
                `${apiUrl}/book/book-detail/${e.bookId}`
            )
            if (response.data.status == 'success') {
                pageRoute(e.bookId)
            } else {
                alert('동화 불러오기 실패!! 다시 한 번 시도해주세요!')
            }
        } catch (error) {
            console.error('Failed to get book: ', error)
        }
    }

    const pageRoute = (bookId) => {
        router.push(`/book/${bookId}`)
    }
    return (
        <div className="h-96 w-11/12">
            <div className="m-1 mt-7 text-3xl font-bold">
                AI동화를 읽어보아요!
            </div>
            <div className="text-xl">친구들이 만든 동화를 골라 읽어봐요!</div>
            <div className="m-1 mt-2 flex h-96 w-full flex-wrap">
                {bookList
                    .filter((el) => el.bookCoverUrl)
                    .map((el) => (
                        <div
                            key={el.bookId}
                            className="relative mb-8 w-1/4 px-10"
                        >
                            <div
                                className="relative cursor-pointer"
                                onClick={() => handleBook(el)}
                            >
                                <Image
                                    src={el.bookCoverUrl}
                                    alt="FariyTale"
                                    width="0"
                                    height="0"
                                    sizes="100vw"
                                    className="h-[400px] w-full rounded-lg"
                                    priority
                                />
                                <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center justify-center text-center text-white">
                                    <div
                                        className="text-sm md:text-2xl lg:text-5xl"
                                        style={{
                                            WebkitTextStroke: '1px black',
                                        }}
                                    >
                                        {el.bookName}
                                    </div>
                                    <div
                                        className="mb-4 text-sm md:text-xl lg:text-4xl"
                                        style={{
                                            WebkitTextStroke: '1px black',
                                        }}
                                    >
                                        {el.bookMaker}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    )
}
