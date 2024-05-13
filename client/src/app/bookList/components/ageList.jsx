'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { getRandomInt, randomChoice } from '../utils/helpers'
import { Baby, HouseLine } from '@phosphor-icons/react/dist/ssr'
import Horse from '../../../../public/image/horse.png'

const availableColors = [
    '#FFD5CD',
    '#ABD7D2',
    '#B7D6EB',
    '#CDA0CA',
    '#FDC3A2',
    '#FFE480',
    '#87EF6D',
]

export default function Bookshelf() {
    const router = useRouter()
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    const [spines, setSpines] = useState([])
    const [bookList, setBookList] = useState([])
    const [sampleList, setSampleList] = useState([])
    const [recentList, setRecentList] = useState([])
    const [clickedBookId, setClickedBookId] = useState()

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
            alert('로그인을 먼저 해주세요!')
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

    return (
        <div className="flex h-dvh w-dvw flex-col">
            <div className="relative flex h-auto justify-between pl-20 pt-10">
                <div className=" flex h-16 w-1/5 items-center justify-center border-4 border-dotted border-customOrange bg-customPink p-2 text-2xl text-black">
                    또래 추천 동화
                </div>
                <div className="relative flex w-auto  justify-between pr-20">
                    <div
                        onClick={goProfile}
                        className="shadow-customDeepShadow mr-4 flex h-20 w-20 cursor-pointer flex-col items-center justify-center rounded-full bg-customGreen"
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
                        className="shadow-customDeepShadow flex h-20 w-20 cursor-pointer flex-col items-center justify-center rounded-full bg-customOrange"
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
            <div className="relative m-0 flex h-auto w-full flex-col pt-2 font-thin">
                <div className="relative ml-12">
                    <div className="relative ml-8 flex h-auto">
                        {spines &&
                            sampleList &&
                            sampleList
                                .filter((book) => book.bookCoverUrl)
                                .map((book, index) => (
                                    <div
                                        onMouseDown={(e) =>
                                            clickBook(book.bookId)
                                        }
                                        className={`relative top-0 ml-0.5 h-[230px] w-[50px] rounded-sm border-[0.5px] border-gray-400 ${
                                            clickedBookId == book.bookId
                                                ? '-translate-x-10 -translate-y-20 -rotate-12 transform'
                                                : ''
                                        }`}
                                        key={index}
                                        style={{
                                            backgroundColor:
                                                spines[index].backgroundColor,
                                        }}
                                    >
                                        <div className="absolute h-[100%] rounded-md  text-center font-bold ">
                                            <div
                                                className="absolute top-0 m-1 h-[150px] pt-1 text-sm font-thin text-gray-700"
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
                                            className={`absolute h-[230px] w-[50px] rounded-sm border-[1px] border-gray-500 pb-12 text-center font-bold `}
                                        ></div>
                                        <div
                                            className={`hover:z-100 absolute left-[50px] top-0 h-[230px] w-[150px] rounded-sm border-[2px] border-gray-400 text-center font-bold bg-[${spines[index].backgroundColor}]`}
                                        >
                                            <Image
                                                src={book.bookCoverUrl}
                                                alt={'책 표지'}
                                                fill
                                                className="hover:z-10"
                                            />
                                        </div>
                                    </div>
                                ))}
                    </div>
                    <div className="top-0 h-[20px] w-[700px] border-2 border-[#FFB801] bg-[#FFB801] shadow-customShadow"></div>
                </div>
                <div className="absolute bottom-64 right-20 flex h-16 w-1/5 items-center justify-center border-4 border-dotted border-customBlueBorder bg-customPink p-2 text-2xl text-black">
                    최신 동화
                </div>
                <div className="pl-[30%] pt-8">
                    <div className="flex h-auto w-full pl-16">
                        {spines &&
                            recentList &&
                            recentList
                                .filter((book) => book.bookCoverUrl)
                                .map((book, index) => (
                                    <div
                                        onMouseDown={(e) =>
                                            clickBook(book.bookId)
                                        }
                                        className={`relative top-0 ml-0.5 h-[230px] w-[50px] rounded-sm border-[0.5px] border-gray-400 ${
                                            clickedBookId == book.bookId
                                                ? '-translate-x-10 -translate-y-20 -rotate-12 transform'
                                                : ''
                                        }`}
                                        key={index}
                                        style={{
                                            backgroundColor:
                                                spines[index].backgroundColor,
                                        }}
                                    >
                                        <div className="absolute h-[100%] rounded-md  text-center font-bold ">
                                            <div
                                                className="absolute top-0 m-1 pt-1 text-sm font-thin text-gray-700 "
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
                                            className={`absolute h-[230px] w-[50px] rounded-sm border-[1px] border-gray-500 text-center font-bold `}
                                        ></div>
                                        <div
                                            className={`hover:z-100 absolute left-[50px] top-0 h-[230px] w-[150px] rounded-sm border-[2px] border-gray-400 text-center font-bold bg-[${spines[index].backgroundColor}]`}
                                        >
                                            <Image
                                                src={book.bookCoverUrl}
                                                alt={'책 표지'}
                                                fill
                                                className="hover:z-10"
                                            />
                                        </div>
                                    </div>
                                ))}
                    </div>
                    <div className="top-0 h-[20px] w-[1000px] border-2 border-[#FFB801] bg-[#FFB801] shadow-customShadow"></div>
                </div>
            </div>
        </div>
    )
}
