'use client'

import Image from 'next/image'
import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'

export default function BookList() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    const [bookList, setBookList] = useState([])
    const [bookNumber, setBookNumber] = useState(0);

    useEffect(() => {
        getBookList()
    }, [])

    useEffect(() => {
        console.log(bookNumber)
    }, [bookList]);

    const getBookList = async () => {
        try {
            const response = await axios.get(`${apiUrl}/book/main-list/${bookNumber}`);
            const newData = response.data.data;
            const uniqueData = Array.from(new Set([...bookList, ...newData]));
            console.log(newData)
            setBookList(uniqueData);
            if (newData.length > 0) {
                const latestBookId = uniqueData[uniqueData.length - 1].bookId;
                console.log(latestBookId)
                setBookNumber(latestBookId);
            }
        } catch (error) {
            console.error("Get bookList failed: ", error);
        }
    };
    

	const onScroll = useCallback(() => {
        const scrollTop = document.documentElement.scrollTop; // 현재 스크롤 위치
        const scrollHeight = document.documentElement.scrollHeight; // 창의 높이
        const clientHeight = document.documentElement.clientHeight; // 전체 문서의 높이
    
        if (scrollTop + clientHeight >= scrollHeight) {
            console.log("스크롤이 맨 아래에 도달했습니다!");
            getBookList()
        }
	}, [bookNumber])

    useEffect(() => {
		window.addEventListener('scroll', onScroll, { passive: true })
		return () => {
			window.removeEventListener('scroll', onScroll)
		}
	}, [])


    return (
        <div className="h-96 w-11/12">
            <div className="m-1 mt-7 text-3xl font-bold">
                AI동화를 읽어보아요!
            </div>
            <div className="text-xl">친구들이 만든 동화를 골라 읽어봐요!</div>
            <div className="m-1 mt-2 w-full h-96 flex flex-wrap">
                {bookList.map((el) => (  
                    <div key={el.bookId} className='w-1/4 px-10 mb-8 relative'>
                        <div className="relative">
                            <Image src={el.bookCoverUrl} alt="FariyTale" width="0" height="0" sizes="100vw" className="w-full h-[400px] rounded-lg" priority/>
                            <div className="absolute left-0 right-0 bottom-0 flex flex-col justify-center items-center text-center text-white">
                                <div className="text-sm md:text-2xl lg:text-5xl" style={{ WebkitTextStroke: '1px black'}}>{el.bookName}</div>
                                <div className="text-sm md:text-xl lg:text-4xl mb-4" style={{ WebkitTextStroke: '1px black'}}>{el.bookMaker}</div>
                            </div>
                        </div>
                    </div>
                ))}

            </div>
        </div>
    )
}