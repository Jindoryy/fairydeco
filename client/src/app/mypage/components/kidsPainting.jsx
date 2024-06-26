'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import KidsDrawing from './kidsDrawing'

export default function KidsPainting({ bookList }) {
    const [showModal, setShowModal] = useState(false) // 모달 보여주기 여부를 관리하는 상태
    const [selectedBook, setSelectedBook] = useState(null)
    const scrollContainerRef = useRef(null)

    // 모달을 열고 선택된 이미지의 URL을 설정합니다.
    const handleImageClick = (bookId, bookName, bookPictureUrl) => {
        setSelectedBook({ bookId, bookName, bookPictureUrl })
        setShowModal(true)
    }

    // 모달을 닫습니다.
    const closeModal = () => {
        setSelectedBook(null)
        setShowModal(false)
    }

    // 드래그 스크롤 이벤트 핸들러 추가
    const handleMouseDown = (e) => {
        const container = scrollContainerRef.current
        container.isDown = true
        container.startX = e.pageX - container.offsetLeft
        container.scrollLeft = container.scrollLeft
    }

    const handleMouseLeave = () => {
        const container = scrollContainerRef.current
        container.isDown = false
    }

    const handleMouseUp = () => {
        const container = scrollContainerRef.current
        container.isDown = false
    }

    const handleMouseMove = (e) => {
        const container = scrollContainerRef.current
        if (!container.isDown) return
        e.preventDefault()
        const x = e.pageX - container.offsetLeft
        const walk = (x - container.startX) * 2 // 스크롤 속도 조절
        container.scrollLeft = container.scrollLeft - walk
    }

    return (
        <div className="pb-4">
            <div className="mx-6 my-6 text-3xl">나의 동화</div>
            <div className="h-[300px] rounded-[30px] bg-white pb-10 pt-6">
                <div
                    className="mx-6 mb-3 overflow-x-auto whitespace-nowrap"
                    ref={scrollContainerRef}
                    onMouseDown={handleMouseDown}
                    onMouseLeave={handleMouseLeave}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                    style={{ cursor: 'grab' }} // 손 모양 커서 추가
                >
                    {bookList ? (
                        <div className="flex flex-row gap-4">
                            {bookList
                                .filter((item) => item.bookCoverUrl !== null) // bookCoverUrl이 null이 아닌 경우만 필터링
                                .reverse()
                                .map((item, index) => (
                                    <div
                                        key={index}
                                        className="relative flex flex-shrink-0 flex-col items-center"
                                    >
                                        <Link href={`/book/${item.bookId}`}>
                                            <img
                                                src={item.bookCoverUrl}
                                                alt={`Book Cover ${item.bookId}`}
                                                style={{
                                                    width: '180px',
                                                    height: '240px',
                                                    borderRadius: '10px',
                                                    cursor: 'pointer', // 클릭 가능하게 커서 변경
                                                }}
                                            />
                                        </Link>
                                        <div
                                            className="absolute bottom-1 w-full p-1 text-center  text-2xl text-white"
                                            style={{
                                                WebkitTextStroke: '1px black', // 검정색 1px 스트로크 추가
                                            }}
                                        >
                                            {item.bookName}
                                        </div>
                                    </div>
                                ))}
                        </div>
                    ) : (
                        <div>No books found</div>
                    )}
                </div>
            </div>
            {/* 나의 그림 */}
            <div className="mx-6 my-6 text-3xl">나의 그림</div>
            <div className="h-[300px] rounded-[30px] bg-white pb-10 pt-6">
                <div
                    className="mx-6 mb-3 overflow-x-auto whitespace-nowrap"
                    ref={scrollContainerRef}
                    onMouseDown={handleMouseDown}
                    onMouseLeave={handleMouseLeave}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                    style={{ cursor: 'grab' }} // 손 모양 커서 추가
                >
                    {bookList ? (
                        <div className="flex flex-row gap-4">
                            {bookList
                                .filter((item) => item.bookPictureUrl !== null)
                                .reverse()
                                .map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex flex-shrink-0 flex-col items-center"
                                        onClick={() =>
                                            handleImageClick(
                                                item.bookId,
                                                item.bookName,
                                                item.bookPictureUrl
                                            )
                                        } // 이미지 클릭 시 모달 열기
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <img
                                            src={item.bookPictureUrl}
                                            alt={`Book Picture ${item.bookId}`}
                                            style={{
                                                width: '180px',
                                                height: '240px',
                                                borderRadius: '10px',
                                                objectFit: 'scale-down',
                                                border: '4px solid #FCF4DB',
                                            }}
                                        />
                                    </div>
                                ))}
                        </div>
                    ) : (
                        <div>No images found</div>
                    )}
                </div>
            </div>

            {/* 모달 */}
            {showModal && (
                <KidsDrawing
                    bookId={selectedBook.bookId}
                    bookName={selectedBook.bookName}
                    bookPictureUrl={selectedBook.bookPictureUrl}
                    onClose={closeModal}
                />
            )}
        </div>
    )
}
