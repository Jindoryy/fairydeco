'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { ArrowCircleLeft } from '@phosphor-icons/react/dist/ssr'

export default function UploadBox() {
    const router = useRouter()
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    const childId = localStorage.getItem('childId')
    const [kidImage, setKidImage] = useState()
    const [kidImageView, setKidImageView] = useState('')
    const handleFileChange = (event) => {
        const file = event.target.files[0]
        if (!file) {
            return
        }
        const reader = new FileReader()
        setKidImage(file)

        reader.onload = () => {
            const imageDataURL = reader.result
            setKidImageView(imageDataURL)
        }
        reader.readAsDataURL(file)
    }
    const makeBook = () => {
        if (!kidImage) {
            alert('그림을 업로드해주세요!')
            return
        }
        getStory()
    }
    const getStory = async () => {
        const bookFormData = new FormData()

        bookFormData.append('childId', childId)
        bookFormData.append('bookPicture', kidImage)

        try {
            const { data } = await axios.post(`${apiUrl}/book`, bookFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            if (data.status == 'success') {
                alert(
                    '이야기를 만들기 시작했어요! 3분정도 기다려주세요. 다른 아이의 그림을 보러갈까요?'
                )
                router.push('/bookList')
            } else {
                alert('이야기 만들기가 실패했어요 다시 한 번 해주세요!')
            }
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }

    const goBack = () => {
        router.push('/makebook')
    }
    return (
        <>
            <button
                className="btn btn-ghost relative ml-2 h-auto w-1/12 pt-2 align-middle text-lg font-thin text-white hover:bg-transparent focus:bg-transparent"
                onClick={goBack}
            >
                <ArrowCircleLeft
                    size={80}
                    weight="fill"
                    className="text-white"
                />
            </button>
            <div className="relative m-auto mt-8 flex h-3/4 w-2/3 flex-col items-center justify-center rounded-3xl border-none bg-customDarkYellow p-4 text-5xl font-thin shadow-innerShadow hover:bg-customDarkYellow">
                <div className="flex h-4/5 min-h-[190px] w-full items-center justify-center rounded-2xl ">
                    <input
                        type="file"
                        className="file-input file-input-bordered file-input-accent mr-8 w-full max-w-xs font-thin"
                        onChange={handleFileChange}
                    />
                    {kidImageView && (
                        <div className="overflow-hidden">
                            <Image
                                src={kidImageView}
                                alt="Kid Image"
                                width={250}
                                height={300}
                                style={{
                                    objectFit: 'cover',
                                    borderRadius: '30px',
                                }}
                                relative
                            />
                        </div>
                    )}
                </div>
                {kidImageView && (
                    <div>
                        <button
                            className="btn w-full border-none bg-customBlueBorder text-2xl font-thin hover:bg-customBlueBorder"
                            onClick={makeBook}
                        >
                            동화 만들기
                        </button>
                    </div>
                )}
            </div>
        </>
    )
}
