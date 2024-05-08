'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Script from 'next/script'

const TurnPage = () => {
    const pathname = usePathname()
    const [jQueryLoaded, setJQueryLoaded] = useState(false)
    const [data, setData] = useState(null)

    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    const bookId = pathname.split('/').pop()
    const URL = `${apiUrl}/book/book-detail/${bookId}`

    // 데이터를 가져와서 상태에 저장
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(URL)
                const jsonData = await response.json()
                setData(jsonData)
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
            const numberOfPages = 18 // 총 페이지 수

            const addPage = (page, content) => {
                const element = $('<div />', {
                    class: `page flex items-center justify-center ${
                        page % 2 === 0
                            ? 'bg-gradient-to-r from-white to-gray-300'
                            : 'bg-gradient-to-l from-white to-gray-200'
                    }`,
                    id: `page-${page}`,
                }).html(content)

                book.turn('addPage', element, page)
            }

            book.turn({
                acceleration: true,
                pages: numberOfPages,
                elevation: 150, // 그림자 높이 증가
                gradients: true, // 그라디언트 활성화
                when: {
                    turning: (e, page) => {
                        const range = book.turn('range', page)
                        for (let p = range[0]; p <= range[1]; p++) {
                            let content
                            if (p === 1) {
                                const bookCoverUrl = data.data.bookCoverUrl
                                const bookName = data.data.bookName
                                content = `<div class="flex flex-col items-center justify-center w-[100%] h-[100%] bg-white">
                                        <img src="${bookCoverUrl}" class="w-[100%] h-[85%] object-cover" alt="Book Cover" />
                                        <div class="h-[15%] w-[100%] flex justify-center items-center text-5xl text-black mt-2">${bookName}</div>
                                    </div>`
                            } else if (p === 18) {
                                const bookCoverUrl = data.data.bookCoverUrl
                                const bookMaker = data.data.bookMaker
                                const bookName = data.data.bookName
                                content = `<div class="flex flex-col items-center justify-center w-[100%] h-[100%] bg-white">
                                        <img src="${bookCoverUrl}" class="w-1/3 h-1/3 object-contain" alt="Book Cover" />
                                        <div class="text-base text-gray-600 mt-2">${bookName}</div>
                                        <div class="text-sm text-gray-600 mt-2">지은이: ${bookMaker}</div>
                                    </div>`
                            } else {
                                const pageIndex = Math.floor((p - 2) / 2)
                                const pageContent =
                                    p % 2 === 0
                                        ? data.data.pageList[pageIndex]
                                              ?.pageimageUrl
                                        : data.data.pageList[pageIndex]
                                              ?.pageStory

                                content = pageContent
                                    ? p % 2 === 0
                                        ? `<img src="${pageContent}" class="object-contain w-full h-full" alt="Page Image" />`
                                        : `<div class="flex flex-col items-center justify-center text-center text-3xl text-black break-keep px-8">${pageContent}</div>`
                                    : '<div class="flex items-center justify-center text-center text-3xl text-red-500">No Content Available</div>'
                            }

                            addPage(p, content)
                        }
                    },
                    turned: (e, page) => {
                        $('#page-number').val(page)
                    },
                },
            })

            $('#number-pages').html(numberOfPages)

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
    }, [jQueryLoaded, data]) // data도 의존성에 추가

    return (
        <>
            <div className="flex min-h-screen flex-col items-center justify-center font-ourFont">
                <Script
                    src="https://code.jquery.com/jquery-3.7.1.min.js"
                    onLoad={() => setJQueryLoaded(true)}
                />
                <Script src="/turn.min.js" />

                <div
                    id="book"
                    className="relative flex h-[600px] w-[1200px] items-center justify-center bg-white shadow-lg"
                    style={{ boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)' }}
                >
                    <div className="cover flex h-full flex-col justify-end bg-white">
                        <img
                            src={data?.data?.bookCoverUrl}
                            alt="Cover"
                            style={{
                                width: '100%',
                                height: '85%',
                                objectFit: 'cover',
                            }}
                        />
                        <div
                            style={{
                                height: '15%',
                                width: '100%',
                                backgroundColor: 'white',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <h1 className="text-5xl text-black">
                                {data ? data.data.bookName : 'Loading...'}
                            </h1>
                        </div>
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
                    <span class="ml-2">/</span>
                    <span id="number-pages" className="ml-2"></span>
                </div>
            </div>
        </>
    )
}

export default TurnPage
