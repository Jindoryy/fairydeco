'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import {
    HouseLine,
    Books,
    SpeakerHigh,
    SpeakerSimpleX,
    Play,
    Pause,
    CaretCircleLeft,
    CaretCircleRight,
} from '@phosphor-icons/react/dist/ssr'

import Link from 'next/link'
import Image from 'next/image'
import TitleBox from './components/titleBox'
import Loading from '../../components/loadingTest'
import BookFrame from '../../../../public/image/bookFrame.png'

const TurnPage = () => {
    const pathname = usePathname()
    const [jQueryLoaded, setJQueryLoaded] = useState(false)
    const [data, setData] = useState(null)
    const [turnLoaded, setTurnLoaded] = useState(false)
    const [allLoaded, setAllLoaded] = useState(false)

    const [isAudioPlaying, setIsAudioPlaying] = useState(false)
    const [isMuted, setIsMuted] = useState(false)

    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    const bookId = pathname.split('/').pop()
    const URL = `${apiUrl}/book/book-detail/${bookId}`

    useEffect(() => {
        // Load jQuery
        const scriptJQuery = document.createElement('script')
        scriptJQuery.src = 'https://code.jquery.com/jquery-3.6.0.min.js'
        scriptJQuery.onload = () => {
            setJQueryLoaded(true)
            // Load turn.js after jQuery is loaded
            const scriptTurn = document.createElement('script')
            scriptTurn.src = '/turn.min.js'
            scriptTurn.onload = () => {
                setTurnLoaded(true)
                fetch(URL)
                    .then((response) => response.json())
                    .then((jsonData) => {
                        setData(jsonData)
                        setAllLoaded(true)
                    })
                    .catch((error) => {
                        console.error('Error fetching data:', error)
                    })
            }
            document.body.appendChild(scriptTurn)
        }
        document.body.appendChild(scriptJQuery)
    }, [URL])

    // 음소거 토글
    const toggleAudioPlayback = () => {
        const audioElement = document.getElementById('audio')
        if (audioElement) {
            audioElement.muted = !audioElement.muted
            setIsMuted((prev) => !prev)
        }
    }
    // 자동재생 & 일시정지 토글
    const toggleAutoPlay = () => {
        const audioElement = document.getElementById('audio')
        if (audioElement) {
            if (isAudioPlaying) {
                audioElement.pause() // 일시정지
            } else {
                audioElement.play() // 재생
            }
        }
        setIsAudioPlaying((prev) => !prev) // 오디오 상태 토글
    }

    // 앞장으로
    const handlePageBackward = () => {
        if (turnLoaded) {
            const book = window.jQuery('#book')
            book.turn('previous')
            playAudioForCurrentPage()
        }
    }
    // 뒷장으로
    const handlePageForward = () => {
        if (turnLoaded) {
            const book = window.jQuery('#book')
            book.turn('next')
            playAudioForCurrentPage()
        }
    }

    const playAudioForCurrentPage = () => {
        setTimeout(() => {
            const audioElement = document.querySelector('audio')
            if (audioElement) {
                audioElement.play()
                setIsMuted(false)
                setIsAudioPlaying(true)
            }
        }, 500) // Delay to ensure the page has fully turned
    }

    useEffect(() => {
        if (jQueryLoaded && data) {
            const $ = window.jQuery
            const book = $('#book')
            const numberOfPages = data?.data?.pageList?.length * 2 + 2

            const addPage = (page, content) => {
                const element = $('<div />', {
                    class: `page flex items-center justify-center ${
                        page % 2 === 0
                            ? 'bg-gradient-to-r from-white to-gray-300'
                            : 'bg-gradient-to-l from-white to-gray-300'
                    }`,
                    id: `page-${page}`,
                }).html(content)

                book.turn('addPage', element, page)
            }

            book.turn({
                acceleration: true,
                pages: numberOfPages,
                elevation: 150,
                gradients: true,
                when: {
                    turning: (e, page) => {
                        console.log('Turning to page ' + page) // 현재 페이지 번호를 콘솔에 출력
                        const range = book.turn('range', page)
                        console.log('Turning to page ' + page)
                        for (let p = range[0]; p <= range[1]; p++) {
                            let content

                            if (page === 1) {
                                // Cover Page
                                // Cover 페이지에는 음성이 없을 수 있으므로 체크
                                content = `<div class="flex flex-col items-center justify-center w-[100%] h-[100%] bg-white">
                                                <img src="${data.data.bookCoverUrl}" class="w-[100%] h-[85%] object-cover" alt="Book Cover" />
                                                <div class="h-[15%] w-[100%] flex justify-center items-center text-5xl text-black mt-2">${data.data.bookName}</div>
                                            </div>`
                            } else if (page === numberOfPages) {
                                // Back Cover Page
                                // Back Cover 페이지에는 음성이 없을 수 있으므로 체크
                                content = `<div class="flex flex-col items-center justify-center w-[100%] h-[100%] bg-white">
                                                <img src="${data.data.bookCoverUrl}" class="w-1/3 h-1/3 object-contain" alt="Book Cover" />
                                                <div class="text-base text-gray-600 mt-2">${data.data.bookName}</div>
                                                <div class="text-sm text-gray-600 mt-2">지은이: ${data.data.bookMaker}</div>
                                            </div>`
                            } else {
                                // 내용 페이지
                                const pageIndex = Math.floor((page - 2) / 2)
                                console.log(
                                    data.data.pageList[pageIndex]?.pageVoiceUrl
                                )
                                content = `
                                    <div className="flex items-center justify-center">
                                        ${
                                            p % 2 === 0
                                                ? `<img src="${data.data.pageList[pageIndex]?.pageimageUrl}" class="object-contain w-full h-full" alt="Page Image" />
                                               
                                                <audio id="audio" className="ml-4"
                                                     src="${data.data.pageList[pageIndex]?.pageVoiceUrl}" type="audio/mpeg">
                                                    Your browser does not support the audio element.
                                                </audio>
                                        `
                                                : `<div class="flex flex-col items-center justify-center text-2xl text-black break-keep px-16 font-storyFont font-bold text-left leading-10">${data.data.pageList[pageIndex]?.pageStory}</div>
                                              
                                                   <audio id="audio" className="ml-4"
                                                        src="${data.data.pageList[pageIndex]?.pageVoiceUrl}" type="audio/mpeg">
                                                       Your browser does not support the audio element.
                                                   </audio>
                                               `
                                        }
                                    </div>`
                            }

                            addPage(p, content)
                        }
                    },
                    turned: (e, page) => {
                        console.log('Turned to page ' + page) // 페이지 넘김 완료 후 페이지 번호 출력
                        $('#page-number').val(page)
                        // playAudioForCurrentPage()
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
    }, [jQueryLoaded, turnLoaded, data])

    if (!allLoaded) {
        return <Loading /> // 로딩 중에는 로딩 컴포넌트 표시
    }

    return (
        <>
            <div className="flex min-h-screen flex-col items-center justify-center bg-[#FFFDEA] font-ourFont">
                {/* Header Div */}
                <div
                    id="headerDiv"
                    className=" flex w-full items-center justify-between px-4 pt-2"
                >
                    <Link
                        href="/"
                        className="ml-8 flex flex-grow justify-start"
                    >
                        <HouseLine
                            size={45}
                            weight="fill"
                            style={{ color: '#A0D468', cursor: 'pointer' }}
                        />
                    </Link>

                    <div className="ml-32 flex flex-grow items-center justify-center text-center">
                        <TitleBox
                            title={data?.data?.bookName}
                            bookId={bookId}
                            childId={data?.data?.childId}
                        />
                    </div>

                    <div
                        id="right"
                        className="flex flex-grow justify-end space-x-4 text-center"
                    >
                        <Link href="/bookList">
                            <div className="flex flex-col items-center">
                                <Books
                                    size={32}
                                    style={{
                                        color: '#A0D468',
                                        cursor: 'pointer',
                                    }}
                                />
                                <div className="text-sm text-black">더보기</div>
                            </div>
                        </Link>
                        <div
                            className="flex w-[55px] flex-col items-center"
                            onClick={toggleAudioPlayback}
                        >
                            {isMuted ? (
                                <>
                                    <SpeakerHigh
                                        size={32}
                                        weight="fill"
                                        style={{
                                            color: '#A0D468',
                                            cursor: 'pointer',
                                        }}
                                    />
                                    <div className="text-sm text-black">
                                        소리켜기
                                    </div>
                                </>
                            ) : (
                                <>
                                    <SpeakerSimpleX
                                        size={32}
                                        weight="fill"
                                        style={{
                                            color: '#A0D468',
                                            cursor: 'pointer',
                                        }}
                                    />

                                    <div className="text-sm text-black">
                                        소리끄기
                                    </div>
                                </>
                            )}
                        </div>
                        <div
                            className="flex w-[55px] flex-col items-center"
                            onClick={toggleAutoPlay}
                        >
                            {isAudioPlaying ? (
                                <>
                                    <Play
                                        size={32}
                                        weight="fill"
                                        style={{
                                            color: '#A0D468',
                                            cursor: 'pointer',
                                        }}
                                    />
                                    <div className=" text-sm text-black">
                                        재생
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Pause
                                        size={32}
                                        weight="fill"
                                        style={{
                                            color: '#A0D468',
                                            cursor: 'pointer',
                                        }}
                                    />
                                    <div className=" text-sm text-black">
                                        일시정지
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {data ? (
                    <div
                        id="book"
                        className="book-container relative  flex h-[550px] w-[1100px] items-center justify-center bg-white shadow-lg"
                        style={{
                            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                        }}
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
                ) : null}
                <div
                    id="controls"
                    className="z-10 my-5 flex w-[800px] items-center  justify-center text-2xl font-bold"
                >
                    <CaretCircleLeft
                        size={32}
                        weight="fill"
                        style={{
                            color: '#A0D468',
                            marginRight: '10px',
                            cursor: 'pointer',
                        }}
                        onClick={handlePageBackward}
                    />
                    <input
                        type="text"
                        size="3"
                        id="page-number"
                        className="border border-gray-400 text-center"
                    />
                    <span className="ml-2">/</span>
                    <span id="number-pages" className="ml-2"></span>
                    <CaretCircleRight
                        size={32}
                        weight="fill"
                        style={{
                            color: '#A0D468',
                            marginLeft: '10px',
                            cursor: 'pointer',
                        }}
                        onClick={handlePageForward}
                    />
                </div>
            </div>
        </>
    )
}

export default TurnPage
