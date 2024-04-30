'use client'
import { useState } from 'react'

export default function TitleBox() {
    const [title, setTitle] = useState('나의 이야기')

    const handleTitleChange = (event) => {
        setTitle(event.target.value)
    }

    const handleTitleButton = (event) => {
        console.log(title)
    }
    return (
        <div className=" border-customOrange m-4 flex h-14 w-2/5 items-center rounded-lg border-2 bg-[#FFE7A8] p-4 pl-8">
            <div className="text-2xl">제목 : </div>
            <input
                className="ml-2 w-2/3 border-black bg-[#FFE7A8] text-2xl focus:border-b focus:outline-none"
                value={title}
                onChange={handleTitleChange}
            ></input>
            <button
                className="border-customOrange hover:border-customOrange btn btn-sm ml-8 w-[80px] border-2 bg-white text-sm hover:bg-white"
                onClick={handleTitleButton}
            >
                제목수정
            </button>
        </div>
    )
}
