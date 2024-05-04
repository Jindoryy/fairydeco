'use client'

import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import {
    Heart,
    GlobeHemisphereEast,
    StarAndCrescent,
    Ghost,
    PlusCircle,
    CaretRight,
} from '@phosphor-icons/react/dist/ssr'

export default function Prompt() {
    const router = useRouter()
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    const [writer, setWriter] = useState('')
    const [kids, setKids] = useState([])
    const [uploadImage, setUploadImage] = useState(false)
    const [category, setCategory] = useState('ADVENTURE')
    const categories = ['ADVENTURE', 'FANTASY', 'MYSTERY', 'ROMANCE']
    const [story, setStory] = useState('')
    const [kidImage, setKidImage] = useState('')
    const [kidImageView, setKidImageView] = useState('')
    const [bookId, setBookId] = useState()

    const getKids = async () => {
        //유저 아이디 변경 필요
        try {
            const response = await axios.get(`${apiUrl}/child/name-list/1`)
            setKids(response.data.data)
            setWriter(response.data.data[0].childName)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
       getKids()
    }, [])

    const handleSelectWriter = (writerName) => {
        console.log(kids)
        let selectedWriter = writerName.target.value
        setWriter(selectedWriter)
    }

    const handleSelectCategory = (buttonName) => {
        if (category === buttonName) {
            setCategory('')
        } else {
            setCategory(buttonName)
        }
    }

    const handleStoryChange = (event) => {
        const value = event.target.value
        setStory(value)
    }

    const handleUploadClick = () => {
        if (uploadImage) setUploadImage(false)
        else setUploadImage(true)
        setStory('')
        setKidImage('')
    }

    const handleFileChange = (event) => {
        const file = event.target.files[0]
        const reader = new FileReader()
        setKidImage(file)

        reader.onload = () => {
            const imageDataURL = reader.result
            setKidImageView(imageDataURL)
        }
        reader.readAsDataURL(file)
    }

    const getStory = async () => {
        const selectedKid = kids.find((el) => el.childName === writer)
        const id = selectedKid ? selectedKid.childId : null

        const bookFormData = new FormData()
        bookFormData.append('childId', id)
        bookFormData.append('bookMaker', writer)
        bookFormData.append('bookGenre', category)
        if (story == '') {
            console.log(kidImage)
            bookFormData.append('bookPicture', kidImage)
        } else {
            console.log(story)
            bookFormData.append('bookPrompt', story)
        }
        try {
            const { data } = await axios.post(`${apiUrl}/book`, bookFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            console.log(data)
            if (data.status == 'success') {
                setBookId(data.data.bookId)
                console.log(data.data.bookId)
                pageRoute(data.data.bookId)
            } else {
                alert('이야기 생성에 실패했어요 다시 한 번 해주세요!')
            }
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }
    const makeStory = () => {
        if (!story && !kidImage) {
            alert('이야기나 그림 하나라도 입력해주세요!')
            return
        }
        getStory()
    }

    const pageRoute = (storyId) => {
        router.push(`/story/${storyId}`)
    }
    return (
        <div className="h-[600px] w-11/12">
            <div className="m-1 mt-7 text-3xl font-bold">
                AI동화를 꾸며보아요!
            </div>
            <div className="text-xl">
                <span className="text-customPurple">이야기</span>를 쓰거나{' '}
                <span className="text-customGreen">그림</span>을 그려서
                올려봐요! (둘 중 <span className="text-customRed">한가지</span>
                로만 동화를 만들 수 있어요!)
            </div>
            <div className="mt-2 flex h-auto flex-col items-center justify-start rounded-3xl bg-customPink p-3">
                <div className="flex w-11/12 justify-between pb-1 pt-4">
                    <div className="h-28 w-1/4 rounded-2xl bg-white p-2 shadow-customShadow">
                        <div className="mb-1 pl-4 text-2xl font-bold">
                            지은이
                        </div>
                        <select
                            className="outline:border-customPink select select-sm ml-3 h-12 w-11/12 max-w-xs border-customPink text-xl focus:border-customPink focus:outline-customPink"
                            onChange={handleSelectWriter}
                        >
                            {kids.map((el, index) => (
                                <option key={index} className="text-xl">
                                    {el.childName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="h-28 w-2/3 rounded-2xl bg-white p-2 shadow-customShadow">
                        <div className="mb-1 pl-4 text-2xl font-bold">
                            카테고리
                        </div>
                        <div className="ml-4 mr-4 mt-2 flex flex-row justify-between">
                            <button
                                className={` btn btn-outline btn-sm h-12 w-1/5 border-customPink text-xl hover:border-customPink hover:bg-customPink hover:text-black ${
                                    category === 'ADVENTURE'
                                        ? 'bg-customPink'
                                        : ''
                                }`}
                                onClick={() =>
                                    handleSelectCategory('ADVENTURE')
                                }
                            >
                                <GlobeHemisphereEast
                                    className="text-customPurple"
                                    size={30}
                                    weight="fill"
                                ></GlobeHemisphereEast>
                                모험
                            </button>
                            <button
                                className={`btn btn-outline btn-sm h-12 w-1/5 border-customPink text-xl hover:border-customPink hover:bg-customPink hover:text-black ${
                                    category === 'FANTASY'
                                        ? 'bg-customPink'
                                        : ''
                                }`}
                                onClick={() => handleSelectCategory('FANTASY')}
                            >
                                <StarAndCrescent
                                    className="text-customPurple"
                                    size={30}
                                    weight="fill"
                                ></StarAndCrescent>
                                판타지
                            </button>
                            <button
                                className={`btn btn-outline btn-sm h-12 w-1/5 border-customPink text-xl hover:border-customPink hover:bg-customPink hover:text-black ${
                                    category === 'ROMANCE'
                                        ? 'bg-customPink'
                                        : ''
                                }`}
                                onClick={() => handleSelectCategory('ROMANCE')}
                            >
                                <Heart
                                    className="text-customPurple"
                                    size={30}
                                    weight="fill"
                                ></Heart>{' '}
                                로맨스
                            </button>
                            <button
                                className={`btn btn-outline btn-sm h-12 w-1/5 border-customPink text-xl hover:border-customPink hover:bg-customPink hover:text-black ${
                                    category === 'MYSTERY'
                                        ? 'bg-customPink'
                                        : ''
                                }`}
                                onClick={() => handleSelectCategory('MYSTERY')}
                            >
                                <Ghost
                                    className="text-customPurple"
                                    size={30}
                                    weight="fill"
                                ></Ghost>{' '}
                                미스터리
                            </button>
                        </div>
                    </div>
                </div>
                <div className="mt-3 h-56 w-11/12">
                    {uploadImage ? (
                        <div className="flex items-center justify-between">
                            <div className="w-1/5">
                                <div className="mb-1 pl-4 text-2xl font-bold">
                                    이야기
                                </div>
                                <div className="flex h-full min-h-[190px] w-11/12 items-center justify-center rounded-2xl bg-white">
                                    <button onClick={handleUploadClick}>
                                        <PlusCircle size={40}></PlusCircle>
                                    </button>
                                </div>
                            </div>
                            <div className="flex w-4/5 flex-col items-start">
                                <div className="mb-1 pl-4 text-2xl font-bold">
                                    그림
                                </div>
                                <div className="flex h-full min-h-[190px] w-full items-center justify-center rounded-2xl bg-white">
                                    <input
                                        type="file"
                                        className="file-input file-input-bordered file-input-accent mr-4 w-full max-w-xs"
                                        onChange={handleFileChange}
                                    />
                                    {kidImageView && (
                                        <Image
                                            src={kidImageView}
                                            alt="Kid Image"
                                            width="0"
                                            height="0"
                                            sizes="100vw"
                                            className="w-24 h-24"
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-between">
                            <div className="flex w-9/12 flex-col items-start">
                                <div className="mb-1 pl-4 text-2xl font-bold">
                                    이야기
                                </div>
                                <textarea
                                    onChange={handleStoryChange}
                                    value={story}
                                    className="h-full min-h-[190px] w-full resize-none rounded-2xl p-4 text-xl focus:border-none focus:outline-none"
                                    placeholder="만들고 싶은 이야기를 적어주세요.
                         예시) 6살 여자아이가 숲으로 모험을 떠나는 동화를 만들어주세요! 여자아이는 흑발에 눈이 크답니다!"
                                ></textarea>
                            </div>
                            <div className="w-1/5">
                                <div className="mb-1 pl-4 text-2xl font-bold">
                                    그림
                                </div>
                                <div className="flex h-full min-h-[190px] w-full items-center justify-center rounded-2xl bg-white">
                                    <button onClick={handleUploadClick}>
                                        <PlusCircle size={40}></PlusCircle>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div>
                    <button
                        className="btn btn-sm mb-2 mt-4 h-12 w-44 bg-customYellow text-base shadow-customShadow hover:bg-customYellow"
                        onClick={makeStory}
                    >
                        동화 만들기 <CaretRight size={20} />
                    </button>
                </div>
            </div>
        </div>
    )
}
