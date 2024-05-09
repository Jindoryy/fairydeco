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
    return (
        <div className="shadow-innerShadow bg-customDarkYellow hover:bg-customDarkYellow relative top-24 m-auto h-[500px] w-2/3 rounded-3xl border-none p-4 text-5xl font-thin">
            <div className="flex h-full min-h-[190px] w-full items-center justify-center rounded-2xl ">
                <input
                    type="file"
                    className="file-input file-input-bordered file-input-accent mr-4 w-full max-w-xs"
                    onChange={handleFileChange}
                />
                {kidImageView && (
                    <Image
                        src={kidImageView}
                        alt="Kid Image"
                        width={300}
                        height={300}
                    />
                )}
            </div>
        </div>
    )
}
