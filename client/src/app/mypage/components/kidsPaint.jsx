'use client'

import { useEffect, useState } from 'react'

export default function KidsPaint({ childId, childName, bookList }) {
    return (
        <div className="pb-4">
            <div className="mx-6 my-6 text-3xl">나의 동화</div>
            <div className="h-[300px] rounded-[30px] bg-white pb-10 pt-6">
                <div className="mx-6 mb-3 overflow-x-auto whitespace-nowrap">
                    {bookList ? (
                        <div className="flex flex-row gap-4">
                            {bookList
                                .filter((item) => item.bookCoverUrl !== null) // bookCoverUrl이 null이 아닌 경우만 필터링
                                .map((item, index) => (
                                    <div
                                        key={index}
                                        className="relative flex flex-shrink-0 flex-col items-center"
                                    >
                                        <img
                                            src={item.bookCoverUrl}
                                            alt={`Book Cover ${item.bookId}`}
                                            style={{
                                                width: '180px',
                                                height: '240px',
                                                borderRadius: '10px',
                                            }}
                                        />
                                        <div
                                            className="absolute bottom-1 w-full p-1 text-center  text-2xl text-white"
                                            style={{
                                                '-webkit-text-stroke':
                                                    '1px black', // 검정색 1px 스트로크 추가
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
            <div className="mx-6 my-6 text-3xl">나의 그림</div>
            <div className="h-[300px] rounded-[30px] bg-white pb-10 pt-6">
                <div className="mx-6 mb-3 overflow-x-auto whitespace-nowrap ">
                    {bookList ? (
                        <div className="flex flex-row gap-4">
                            {bookList
                                .filter((item) => item.bookPictureUrl !== null) // bookPictureUrl이 null이 아닌 경우만 필터링
                                .map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex flex-shrink-0 flex-col items-center"
                                    >
                                        <img
                                            src={item.bookPictureUrl}
                                            alt={`Book Picture ${item.bookId}`}
                                            style={{
                                                width: '180px',
                                                height: '240px',
                                                borderRadius: '10px',
                                            }}
                                        />
                                    </div>
                                ))}
                        </div>
                    ) : (
                        <div>No images found</div> // No images available
                    )}
                </div>
            </div>
        </div>
    )
}
