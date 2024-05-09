'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function UploadBox() {
    const [kidImage, setKidImage] = useState()
    const [kidImageView, setKidImageView] = useState('')
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
    const makeBook = () => {
        //동화만들기
    }
    return (
        <div className="shadow-innerShadow bg-customDarkYellow hover:bg-customDarkYellow relative top-16 m-auto flex h-[500px] w-2/3 flex-col items-center justify-center rounded-3xl border-none p-4 text-5xl font-thin">
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
                            width={400}
                            height={400}
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
    )
}
