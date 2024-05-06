'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Script from 'next/script'
import Header from '../../components/header'

const TurnPage = () => {
    const pathname = usePathname()
    const [jQueryLoaded, setJQueryLoaded] = useState(false)
    const [data, setData] = useState(null)

    const apiUrl = process.env.NEXT_PUBLIC_API_URL

    let bookId = pathname
        .split('')
        .reverse()
        .join('')
        .split('/')[0]
        .split('')
        .reverse()
        .join('')

    const URL = `${apiUrl}/book/book-detail/${bookId}`

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

        fetchData() // 데이터 로드
    }, [])

    useEffect(() => {
        if (jQueryLoaded && data) {
            const $ = window.jQuery
            const book = $('#book')

            if (!book || typeof book.turn !== 'function') {
                console.error('Turn.js is not properly initialized.')
                return
            }

            const numberOfPages = 18

            const addPage = (page, content) => {
                const element = $('<div />', {
                    class: `page flex items-center justify-center ${
                        page % 2 === 0
                            ? 'bg-gradient-to-r from-white to-gray-300'
                            : 'bg-gradient-to-l from-white to-gray-300'
                    }`,
                    id: `page-${page}`,
                }).html(content)

                book.turn('addPage', element, page) // 페이지 추가
            }

            book.turn({
                acceleration: true,
                pages: numberOfPages,
                elevation: 50,
                gradients: !$.isTouch,
                when: {
                    turning: (e, page) => {
                        const range = book.turn('range', page)
                        for (let p = 2; p <= range[1]; p++) {
                            let content
                            if (p === 18) {
                                const bookCoverUrl = data.data.bookCoverUrl
                                const bookMaker = data.data.bookMaker
                                const bookName = data.data.bookName
                                content = `<div class="flex flex-col items-center justify-center w-[100%] h-[100%] bg-white">
                                    <img src="${bookCoverUrl}" alt="Book Cover" class="w-1/3 h-1/3 object-contain" />
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
                                        ? `<img src="${pageContent}" alt="Page Image" class="object-contain w-full h-full" />`
                                        : `<div class="flex flex-col items-center justify-center text-center text-3xl text-black break-keep px-4">${pageContent}</div>`
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
    }, [jQueryLoaded, data])

    return (
        <>
            <Header />
            <div className="flex min-h-screen flex-col items-center justify-center font-ourFont">
                <Script
                    src="https://code.jquery.com/jquery-3.7.1.min.js"
                    onLoad={() => setJQueryLoaded(true)}
                />
                <Script src="/turn.min.js" />

                <div
                    id="book"
                    className="relative flex h-[700px] w-[1400px] items-center justify-center bg-white shadow-lg"
                    style={{ boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)' }}
                >
                    <div className="cover flex h-full flex-col justify-end bg-customBlueBorder">
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