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
                setBookList(response.data.data)
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

    return (
        <div className="flex h-dvh w-dvw flex-col items-center bg-customYellow pt-20">
            <div className="flex h-auto w-[80%] items-center justify-between">
                <div className="flex h-[90%] flex-col justify-between">
                    <div className="mb-4 text-6xl">
                        <BookOpenText size={70} />
                        이제 AI 동화를 꾸며볼까요?
                    </div>
                    <div className="text-3xl">
                        아이의 그림을 분석하여 <br />
                        동화책을 만들어봐요! <br />
                        다른 아이의 동화도 볼 수 있어요!
                    </div>
                </div>
                <button className="relative mt-4 h-52 w-52 rounded-full bg-customOrange text-6xl shadow-customDeepShadow">
                    시작!
                </button>
            </div>
            <div className="mt-10 flex overflow-hidden">
                {bookList &&
                    bookList
                        .filter((el) => el.bookCoverUrl)
                        .map((el, index) => (
                            <div
                                className="animate-autoPlay relative mx-4 flex w-[300px] rounded-md"
                                key={index}
                            >
                                <Image
                                    src={el.bookCoverUrl}
                                    alt="책 표지"
                                    width={300}
                                    height={300}
                                    style={{ borderRadius: '10px' }}
                                />
                            </div>
                        ))}
            </div>
        </div>
    )
}
