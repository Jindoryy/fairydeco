'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import {
    HouseLine,
    Baby,
    SpeakerHigh,
    SpeakerSimpleX,
    Play,
    Pause,
    CaretCircleLeft,
    CaretCircleRight,
} from '@phosphor-icons/react/dist/ssr'

import Script from 'next/script'
import Link from 'next/link'
import TitleBox from './components/titleBox'

const TurnPage = () => {
    const pathname = usePathname()
    const [jQueryLoaded, setJQueryLoaded] = useState(false)
    const [data, setData] = useState(null)
    const [turnLoaded, setTurnLoaded] = useState(false)

    // 버튼 토글 상태 관리
    const [isAudioPlaying, setIsAudioPlaying] = useState(false) // 음성 재생 상태
    const [isAutoPlay, setIsAutoPlay] = useState(false) // 자동 재생 상태

    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    const bookId = pathname.split('/').pop()
    const URL = `${apiUrl}/book/book-detail/${bookId}`

    useEffect(() => {
        if (jQueryLoaded) {
            // Script를 사용하여 turn.js를 불러옵니다.
            const script = document.createElement('script')
            script.src = '/turn.min.js'
            script.onload = () => setTurnLoaded(true) // 로드 완료 후 상태 변경
            document.body.appendChild(script) // body에 스크립트 추가
        }
    }, [jQueryLoaded])

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

    // 버튼 토글 로직
    const toggleAudioPlayback = () => {
        if (isAudioPlaying) {
            setIsAudioPlaying(false) // 음성 재생 상태를 정지 상태로 변경
        } else {
            setIsAudioPlaying(true) // 음성 재생 상태를 재생 상태로 변경
        }
    }

    const toggleAutoPlay = () => {
        setIsAutoPlay((prev) => !prev) // 자동 재생 상태 토글
    }

    // Event handlers to turn the pages
    const handlePageBackward = () => {
        if (turnLoaded) {
            const book = window.jQuery('#book')
            book.turn('previous') // Turn to the previous page
        }
    }

    const handlePageForward = () => {
        if (turnLoaded) {
            const book = window.jQuery('#book')
            book.turn('next') // Turn to the next page
        }
    }

    useEffect(() => {
        if (jQueryLoaded && data) {
            const $ = window.jQuery
            const book = $('#book') // book 요소 선택
            const numberOfPages = data?.data?.pageList?.length * 2 + 2 // 총 페이지 수

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
                            } else if (p === numberOfPages) {
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
                                const pageVoiceUrl =
                                    data.data.pageList[pageIndex]?.pageVoiceUrl
                                content = `
                                    <div className="flex items-center justify-center">
                                        ${
                                            p % 2 === 0
                                                ? `<img src="${pageContent}" class="object-contain w-full h-full" alt="Page Image" />`
                                                : `<div class="flex flex-col items-center justify-center text-xl text-black break-keep px-16 font-storyFont text-left leading-10">${pageContent}</div>
                                                <div class="flex flex-col items-center justify-center text-center absolute bottom-12 w-full">
                                                    <audio controls className="ml-4">
                                                        <source src="${pageVoiceUrl}" type="audio/mpeg">
                                                        Your browser does not support the audio element.
                                                    </audio>
                                                </div>`
                                        }
                                    </div>
                                `
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
    }, [jQueryLoaded, turnLoaded, data]) // data도 의존성에 추가

    return (
        <>
            <div className="flex min-h-screen flex-col items-center justify-center bg-[#FFFDEA] font-ourFont">
                <Script
                    src="https://code.jquery.com/jquery-3.7.1.min.js"
                    onLoad={() => setJQueryLoaded(true)}
                />

                {/* Header Div */}
                <div
                    id="headerDiv"
                    className="flex w-full items-center justify-between px-4 py-2"
                >
                    {/* Left Section */}
                    <Link
                        href="/"
                        className="ml-8 flex flex-grow justify-start"
                    >
                        <HouseLine
                            size={45}
                            weight="fill"
                            style={{ color: '#A0D468' }}
                        />
                    </Link>

                    {/* Central Section */}
                    <div className="ml-32 flex flex-grow items-center justify-center text-center">
                        <TitleBox
                            title={data?.data?.bookName}
                            bookId={bookId}
                            childId={data?.data?.childId}
                        />
                    </div>

                    {/* Right Section */}
                    <div
                        id="right"
                        className="flex flex-grow justify-end space-x-4 text-center"
                    >
                        <Link href="/">
                            <div className="flex flex-col items-center">
                                <Baby size={32} style={{ color: '#A0D468' }} />
                                <div className="text-sm text-black">지은이</div>
                            </div>
                        </Link>
                        {/* 음성 재생 및 멈춤 토글 */}
                        <div
                            className="flex w-[55px] flex-col items-center"
                            onClick={toggleAudioPlayback} // 클릭 이벤트로 토글
                        >
                            {isAudioPlaying ? (
                                <>
                                    <SpeakerSimpleX
                                        size={32}
                                        weight="fill"
                                        style={{ color: '#A0D468' }}
                                    />

                                    <div className="text-sm text-black">
                                        음성멈춤
                                    </div>
                                </>
                            ) : (
                                <>
                                    <SpeakerHigh
                                        size={32}
                                        weight="fill"
                                        style={{ color: '#A0D468' }}
                                    />
                                    <div className="text-sm text-black">
                                        음성재생
                                    </div>
                                </>
                            )}
                        </div>
                        {/* 자동 재생 및 멈춤 토글 */}
                        <div
                            className="flex w-[55px] flex-col items-center"
                            onClick={toggleAutoPlay} // 클릭 이벤트로 토글
                        >
                            {isAutoPlay ? (
                                <>
                                    <Pause
                                        size={32}
                                        weight="fill"
                                        style={{ color: '#A0D468' }}
                                    />
                                    <div className=" text-sm text-black">
                                        멈춤
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Play
                                        size={32}
                                        weight="fill"
                                        style={{ color: '#A0D468' }}
                                    />
                                    <div className=" text-sm text-black">
                                        자동재생
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                {data ? (
                    <div
                        id="book"
                        className="book-container relative flex  h-[600px] w-[1200px] items-center justify-center bg-white shadow-lg"
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
                ) : null}
                {/* Page Controls */}
                <div
                    id="controls"
                    className="my-5 flex w-[800px] items-center  justify-center text-2xl font-bold"
                >
                    <CaretCircleLeft
                        size={32}
                        weight="fill"
                        style={{
                            color: '#A0D468',
                            marginRight: '10px',
                            cursor: 'pointer',
                        }}
                        onClick={handlePageBackward} // Event handler for backward navigation
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
                        onClick={handlePageForward} // Event handler for forward navigation
                    />
                </div>
            </div>
        </>
    )
}

export default TurnPage
