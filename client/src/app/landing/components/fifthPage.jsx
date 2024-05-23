'use client'

import Image from 'next/image'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { BookOpenText, Triangle } from '@phosphor-icons/react/dist/ssr'
import Swal from 'sweetalert2'

export default function FifthPage() {
    const router = useRouter()
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    const [bookList, setBookList] = useState([])
    const Swal = require('sweetalert2')

    useEffect(() => {
        getBook()
    }, [])

    const getBook = async () => {
        try {
            const response = await axios.get(`${apiUrl}/book/landing-list`)

            if (response.data.status == 'success') {
                const arr = response.data.data
                setBookList(arr)
            } else {
                Swal.fire({
                    title: '앗!',
                    text: '문제가 발생했어요. 다시 한 번 로딩할게요!',
                    icon: 'error',
                    confirmButtonText: '네',
                })
                router.push('/')
                return
            }
        } catch (error) {
            console.error('Failed to get Booklist: ', error)
        }
    }

    const goLogin = () => {
        router.push('/login')
    }
    return (
        <div className="flex h-dvh w-dvw flex-col items-center bg-customYellow pt-16">
            <div className="flex h-auto w-[80%] items-center justify-between">
                <div className="flex h-auto flex-col justify-between">
                    <div className="mb-2 text-5xl font-semibold">
                        <BookOpenText size={50} />
                        이제 AI 동화를 꾸며볼까요?
                    </div>
                    <div className="text-2xl font-thin">
                        아이의 그림을 분석하여 <br />
                        동화책을 만들어봐요! <br />
                        다른 아이의 동화도 볼 수 있어요!
                    </div>
                </div>
                <button
                    onClick={goLogin}
                    className="relative mt-4 h-44 w-44 rounded-full bg-customOrange text-6xl shadow-customDeepShadow"
                >
                    시작!
                </button>
            </div>
            <div className="mt-4 h-auto bg-customBlue">
                <div className="mt-4 flex overflow-hidden">
                    {bookList &&
                        bookList.length > 0 &&
                        bookList
                            .filter((el) => el.bookCoverUrl)
                            .map((el, index) => (
                                <div
                                    className="relative ml-2 flex w-[200px] animate-autoPlay rounded-md"
                                    key={index}
                                >
                                    <Image
                                        src={el.bookCoverUrl}
                                        alt="책 표지"
                                        width={180}
                                        height={180}
                                        style={{ borderRadius: '10px' }}
                                    />
                                </div>
                            ))}
                </div>
                <div className="mb-4 mt-2 flex overflow-hidden">
                    {bookList &&
                        bookList.length > 0 &&
                        bookList
                            .filter((el) => el.bookCoverUrl)
                            .map((el, index) => (
                                <div
                                    className="relative ml-2 flex w-[200px] animate-autoReversePlay rounded-md"
                                    key={index}
                                >
                                    <Image
                                        src={el.bookCoverUrl}
                                        alt="책 표지"
                                        width={180}
                                        height={180}
                                        style={{ borderRadius: '10px' }}
                                    />
                                </div>
                            ))}
                </div>
            </div>
        </div>
    )
}
