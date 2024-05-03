'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'

const TurnPage = () => {
    const [jQueryLoaded, setJQueryLoaded] = useState(false)
    const [data, setData] = useState(null)

    const URL = `http://k10a402.p.ssafy.io:8081/book/book-detail/4`

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

        fetchData()
    }, [])

    useEffect(() => {
        if (jQueryLoaded && data) {
            const $ = window.jQuery
            const book = $('#book')
            const numberOfPages = 18

            const addPage = (page, content) => {
                if (!book.turn('hasPage', page)) {
                    const element = $('<div />', {
                        class: `page flex items-center justify-center ${page % 2 === 0 ? 'bg-gradient-to-r from-white to-gray-300' : 'bg-gradient-to-l from-white to-gray-300'}`,
                        id: `page-${page}`,
                    }).html(content)

                    book.turn('addPage', element, page)
                }
            }

            book.turn({
                acceleration: true,
                pages: numberOfPages,
                elevation: 50,
                gradients: !$.isTouch,
                when: {
                    turning: (e, page) => {
                        // Ensure `page` is within a valid range
                        const range = book.turn('range', page)
                        const validStart = Math.max(2, range[0])
                        const validEnd = Math.min(numberOfPages, range[1])

                        for (let p = validStart; p <= validEnd; p++) {
                            const pageIndex = Math.floor((p - 2) / 2)

                            const pageContent =
                                pageIndex < data.data.pageList.length
                                    ? p % 2 === 0
                                        ? data.data.pageList[pageIndex]
                                              ?.pageimageUrl
                                        : data.data.pageList[pageIndex]
                                              ?.pageStory
                                    : null

                            const content = pageContent
                                ? p % 2 === 0
                                    ? `<img src="${pageContent}" alt="Page Image" />`
                                    : `<div>${pageContent}</div>`
                                : '<div>No Content Available</div>'

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
            {/* <div>{JSON.stringify(data?.data)}</div> */}
            <div className="flex min-h-screen flex-col items-center justify-center font-ourFont">
                <Script
                    src="http://code.jquery.com/jquery-3.7.1.min.js"
                    onLoad={() => setJQueryLoaded(true)}
                />
                <Script src="/turn.min.js" />

                <div
                    id="book"
                    className="relative flex h-[600px] w-[1200px] items-center justify-center bg-white"
                >
                    <div className="cover flex h-full items-center justify-center bg-customBlueBorder">
                        <img
                            src={data?.data?.bookCoverUrl}
                            alt="Cover"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                            }}
                        />
                        <div
                            style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                zIndex: 1,
                            }}
                        >
                            <h1 className="text-5xl text-white">
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
                    <span className="ml-2">/</span>
                    <span id="number-pages" className="ml-2"></span>
                </div>
            </div>
        </>
    )
}

export default TurnPage
