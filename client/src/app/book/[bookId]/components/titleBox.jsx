'use client'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'

export default function TitleBox({ title, bookId, childId }) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    const [newTitle, setNewTitle] = useState(title || '')
    const [localStorageChildId, setLocalStorageChildId] = useState(null)
    const Swal = require('sweetalert2')
    useEffect(() => {
        console.log(childId)
        setNewTitle(title)
        const storedChildId = localStorage.getItem('childId')
        if (storedChildId) {
            setLocalStorageChildId(storedChildId)
        }
    }, [title])

    useEffect(() => {
        setNewTitle(title)
    }, [title])

    const handleTitleChange = (event) => {
        setNewTitle(event.target.value)
    }

    const handleTitleButton = (event) => {
        // 입력된 childId와 로컬 스토리지에서 가져온 childId를 비교하여 일치할 때에만 제목 수정 함수를 호출합니다.
        if (childId == localStorageChildId) {
            changeTitle()
        } else {
            Swal.fire({
                title: '앗!',
                text: '지은이만 제목을 수정할 수 있어요.',
                icon: 'error',
                confirmButtonText: '네',
            })
        }
    }

    const changeTitle = async () => {
        try {
            const response = await axios.put(`${apiUrl}/book/title`, {
                bookId: bookId,
                bookName: newTitle,
            })
            if (response.data.status == 'success') {
                Swal.fire({
                    title: '우와!',
                    text: '수정 되었습니다.',
                    icon: 'success',
                    confirmButtonText: '네',
                })
            } else {
                Swal.fire({
                    title: '앗!',
                    text: '수정이 실패했습니다. 다시 한 번 시도해주세요',
                    icon: 'error',
                    confirmButtonText: '네',
                })
            }
        } catch (error) {
            console.error('title error', error)
        }
    }
    return (
        <div className=" m-4 flex h-14 w-4/5 items-center rounded-lg  p-4 pl-4">
            <input
                className="ml-2 w-5/6 bg-[#FFFDEA] text-center text-4xl focus:border-b focus:outline-none"
                value={newTitle}
                onChange={handleTitleChange}
            ></input>
            <button
                className="btn btn-sm ml-4 w-[80px] border-2 bg-white text-sm hover:bg-white"
                onClick={handleTitleButton}
            >
                제목수정
            </button>
        </div>
    )
}
