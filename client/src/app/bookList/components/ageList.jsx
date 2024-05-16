'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import axios from 'axios'
import React, { useEffect, useState, useRef } from 'react'
import { getRandomInt, randomChoice } from '../utils/helpers'
import { Baby, HouseLine } from '@phosphor-icons/react/dist/ssr'
import Horse from '../../../../public/image/horse.png'
import Swal from 'sweetalert2'

const availableColors = [
    '#FFD5CD',
    '#ABD7D2',
    '#B7D6EB',
    '#CDA0CA',
    '#FDC3A2',
    '#FFE480',
    '#FE7C9C',
]

export default function Bookshelf() {
    const router = useRouter()
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    const [spines, setSpines] = useState([])
    const [bookList, setBookList] = useState([])
    const [sampleList, setSampleList] = useState([])
    const [recentList, setRecentList] = useState([])
    const [clickedBookId, setClickedBookId] = useState()
    const containerRef = useRef(null)
    const Swal = require('sweetalert2')

    const getBook = async () => {
        try {
            const response = await axios.get(
                `${apiUrl}/book/main-list/${localStorage.getItem('childId')}`
            )
            console.log(response.data.data)
            setSampleList(response.data.data.sampleBookList)
            setRecentList(response.data.data.recentBookList)
        } catch (error) {
            console.error('Failed to get BookList: ', error)
        }
    }
    useEffect(() => {
        if (!localStorage.getItem('childId')) {
            Swal.fire({
                title: '앗!',
                text: '로그인을 먼저 해주세요!',
                icon: 'error',
                confirmButtonText: '네',
            })

            router.push('/login')
            return
        }
        getBook()

        const s = []
        for (let i = 0; i < 15; i++) {
            const randomHeight = getRandomInt(200, 300)
            const randomColor = randomChoice(availableColors)
            s.push({
                title: `Book Title ${i + 1}`,
                author: `Author ${i + 1}`,
                height: `${randomHeight}px`,
                top: `${280 - randomHeight}px`,
                backgroundColor: randomColor,
            })
        }
        setSpines(s)
        console.log(s)
    }, [])

    const goBook = (bookId) => {
        router.push(`/book/${bookId}`)
    }

    const goProfile = () => {
        router.push(`/profile`)
    }
    const goHome = () => {
        router.push('/')
    }

    const clickBook = (id) => {
        if (clickedBookId == id) {
            router.push(`/book/${id}`)
            return
        }
        setClickedBookId(id)
    }

    const handleBookClick = (bookId) => {
        setClickedBookId(bookId)
    }
    const handleOutsideClick = (e) => {
        setClickedBookId(null)
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleOutsideClick)

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick)
        }
    }, [])

    return (
        <div className="flex h-dvh w-dvw flex-col" ref={containerRef}>
            <div className="relative flex h-auto w-dvw justify-between pl-20 pt-10">
                <div className="flex w-full flex-col">
                    <div className=" flex h-16 w-1/4 items-center justify-center border-4 border-dotted border-customOrange bg-customPink p-2 text-2xl text-black">
                        또래 추천 동화
                    </div>
                    <span className="pb-2 pt-2 text-xs text-customGreen">
                        * 한 번 누르면 책을 고를 수 있고, 두 번 누르면 책을 볼
                        수 있어요!
                    </span>
                </div>
                <div className="relative flex w-auto justify-between pr-12">
                    <div
                        onClick={goProfile}
                        className="mr-4 flex h-20 w-20 cursor-pointer flex-col items-center justify-center rounded-full bg-customGreen shadow-customDeepShadow"
                    >
                        <button>
                            <Baby
                                size={45}
                                weight="fill"
                                style={{ color: 'white' }}
                            />
                        </button>
                        <div className="text-xs text-white">아이 선택</div>
                    </div>
                    <div
                        onClick={goHome}
                        className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center rounded-full bg-customOrange shadow-customDeepShadow"
                    >
                        <button>
                            <HouseLine
                                size={45}
                                weight="fill"
                                style={{ color: 'white' }}
                            />
                        </button>
                        <div className="text-xs text-white">홈으로</div>
                    </div>
                </div>
            </div>
            <div className="relative ml-20">
                <div className="relative ml-8 flex h-auto">
                    {spines &&
                        sampleList &&
                        sampleList
                            .filter((book) => book.bookCoverUrl)
                            .map((book, index) => (
                                <div
                                    onMouseDown={(e) => clickBook(book.bookId)}
                                    onClick={() => handleBookClick(book.bookId)}
                                    className={`relative top-0 ml-0.5 h-[200px] w-[50px] rounded-sm border-[0.5px] border-gray-400 ${
                                        clickedBookId == book.bookId
                                            ? '-translate-x-24 -translate-y-24 -rotate-12 transform'
                                            : ''
                                    }`}
                                    key={index}
                                    style={{
                                        backgroundColor:
                                            spines[index].backgroundColor,
                                        transformStyle: 'preserve-3d',
                                        transition: 'transform 0.3s',
                                    }}
                                >
                                    <div className="absolute h-[100%] rounded-md  text-center font-bold ">
                                        <div
                                            className="absolute top-0 m-1 h-[130px] pt-1 text-sm font-thin text-gray-700"
                                            style={{
                                                writingMode: 'vertical-lr',
                                                wordBreak: 'keep-all',
                                            }}
                                        >
                                            {book.bookName}
                                        </div>
                                        <div className="absolute bottom-0 m-1 pl-1 text-xs font-thin text-gray-700">
                                            {book.bookMaker}
                                        </div>
                                    </div>
                                    <div
                                        className={`absolute h-[200px] w-[50px] rounded-sm border-[1px] border-gray-500 pb-12 text-center font-bold `}
                                    ></div>
                                    <div
                                        className={`absolute left-[50px] top-0 h-[200px] w-[120px] rounded-sm border-[2px] border-gray-400 text-center font-bold bg-[${spines[index].backgroundColor}]`}
                                    >
                                        <Image
                                            src={book.bookCoverUrl}
                                            alt={'책 표지'}
                                            fill
                                            priority
                                        />
                                    </div>
                                </div>
                            ))}
                </div>
                <div className="top-0 h-[20px] w-[700px] border-2 border-[#FFB801] bg-[#FFB801] shadow-customShadow"></div>
            </div>
            <div className="absolute bottom-64 right-12 flex h-16 w-1/5 items-center justify-center border-4 border-dotted border-customBlueBorder bg-customPink p-2 text-2xl text-black">
                새로나온 동화
            </div>
            <div className="absolute bottom-4 right-12 pt-2">
                <div className="flex h-auto w-full pl-16">
                    {spines &&
                        recentList &&
                        recentList
                            .filter((book) => book.bookCoverUrl)
                            .map((book, index) => (
                                <div
                                    onMouseDown={(e) => clickBook(book.bookId)}
                                    onClick={() => handleBookClick(book.bookId)}
                                    className={`relative top-0 ml-0.5 h-[200px] w-[50px] rounded-sm border-[0.5px] border-gray-400 ${
                                        clickedBookId == book.bookId
                                            ? '-translate-x-24 -translate-y-24 -rotate-12 transform'
                                            : ''
                                    }`}
                                    key={index}
                                    style={{
                                        backgroundColor:
                                            spines[index].backgroundColor,
                                        transformStyle: 'preserve-3d',
                                        transition: 'transform 0.3s',
                                    }}
                                >
                                    <div className="absolute h-[100%] rounded-md  text-center font-bold ">
                                        <div
                                            className="absolute top-0 m-1 h-[130px] pt-1 text-sm font-thin text-gray-700"
                                            style={{
                                                writingMode: 'vertical-lr',
                                                wordBreak: 'keep-all',
                                            }}
                                        >
                                            {book.bookName}
                                        </div>
                                        <div className="absolute bottom-0 m-1 pl-1 text-xs font-thin text-gray-700 ">
                                            {book.bookMaker}
                                        </div>
                                    </div>
                                    <div
                                        className={`absolute h-[200px] w-[50px] rounded-sm border-[1px] border-gray-500 text-center font-bold `}
                                    ></div>
                                    <div
                                        className={` absolute left-[50px] top-0 h-[200px] w-[120px] rounded-sm border-[2px] border-gray-400 text-center font-bold bg-[${spines[index].backgroundColor}]`}
                                    >
                                        <Image
                                            src={book.bookCoverUrl}
                                            alt={'책 표지'}
                                            fill
                                            priority
                                        />
                                    </div>
                                </div>
                            ))}
                </div>
                <div className="top-0 h-[20px] w-[1000px] border-2 border-[#FFB801] bg-[#FFB801] shadow-customShadow"></div>
            </div>
        </div>
    )
}
