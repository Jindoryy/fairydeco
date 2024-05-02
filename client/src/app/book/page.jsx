'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'
import Header from '../components/header'

const TurnPage = () => {
    const [jQueryLoaded, setJQueryLoaded] = useState(false)
    const [data, setData] = useState(null) // 데이터를 저장할 상태 생성

    const URL = `http://k10a402.p.ssafy.io:8081/book/book-detail/3`

    // 데이터를 가져와서 상태에 저장
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(URL)
                const jsonData = await response.json()
                setData(jsonData) // 가져온 데이터를 상태에 저장
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }

        fetchData() // useEffect가 마운트될 때 데이터 가져오기
    }, [])

    useEffect(() => {
        if (jQueryLoaded && data) {
            const $ = window.jQuery
            const book = $('#book') // book 요소 선택
            const pageList = (data?.data?.pageList + 1) * 2

            const addPage = (page, book) => {
                if (!book.turn('hasPage', page)) {
                    const isEven = page % 2 === 0
                    const content = isEven
                        ? `<img src="${pageList[page - 1]?.pageimageUrl}" alt="Image for page ${page}" class="h-full w-full object-cover"/>`
                        : `<div class="text-center text-3xl text-gray-500">${pageList[page - 1]?.pageStory}</div>`

                    const element = $('<div />', {
                        class: `page ${isEven ? 'bg-gradient-to-r from-white to-gray-300' : 'bg-gradient-to-l from-white to-gray-300'}`,
                        id: `page-${page}`,
                    }).html(content)

                    book.turn('addPage', element, page)

                    setTimeout(() => {
                        element.html(
                            `<div class="data text-center text-3xl text-gray-500">Data for page ${page}</div>`
                        )
                    }, 1000)
                }
            }

            book.turn({
                acceleration: true,
                pages: pageList.length,
                elevation: 50,
                gradients: !$.isTouch,
                when: {
                    turning: (e, page) => {
                        const range = book.turn('range', page)
                        for (let p = range[0]; p <= range[1]; p++) {
                            addPage(p, book)
                        }
                    },
                    turned: (e, page) => {
                        $('#page-number').val(page)
                    },
                },
            })

            $('#number-pages').html(pageList.length)

            $('#page-number').keydown((e) => {
                if (e.keyCode === 13) {
                    book.turn('page', $('#page-number').val())
                }
            })

            $(window).bind('keydown', (e) => {
                if (e.target.tagName.toLowerCase() !== 'input') {
                    if (e.keyCode === 37) {
                        book.turn('previous')
                    } else if (e.keyCode === 39) {
                        book.turn('next')
                    }
                }
            })
        }
    }, [jQueryLoaded, data])

    if (!data) {
        // 데이터가 로드되지 않았을 때
        return <div>Loading...</div>
    }

    return (
        <>
            <Header />
            <div className="h-[400px] w-11/12 font-ourFont">
                {JSON.stringify(data?.data)}
            </div>
            <div className="flex min-h-screen flex-col items-center justify-center font-ourFont">
                {/* Flex container, center items */}
                <Script
                    src="http://code.jquery.com/jquery-3.7.1.min.js"
                    onLoad={() => setJQueryLoaded(true)}
                />
                <Script src="/turn.min.js" />

                <div
                    id="book"
                    className="relative flex h-[600px] w-[1200px] items-center justify-center bg-white"
                >
                    {/* 표지 */}
                    <div className="cover flex h-full items-center justify-center bg-customBlueBorder">
                        <h1 className="text-5xl text-white">
                            {' '}
                            {data?.data?.bookName}
                        </h1>
                    </div>
                </div>

                <div
                    id="controls"
                    className="mt-5 w-[800px] text-center text-2xl font-bold"
                >
                    <input
                        type="text"
                        size="3"
                        id="page-number"
                        className="border border-gray-400 text-center"
                    />
                    <span className="ml-2">/</span>
                    <span id="number-pages" className="ml-2"></span>
                </div>
            </div>
        </>
    )
}
export default TurnPage
