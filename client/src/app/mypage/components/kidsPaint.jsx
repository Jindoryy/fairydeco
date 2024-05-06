'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

export default function KidsPaint() {
    const [paint, setPaint] = useState(null)
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    const childId = 1

    useEffect(() => {
        const fetchPaint = async () => {
            try {
                const response = await fetch(
                    `${apiUrl}/book/child-picture-list/${childId}`
                )
                const jsonData = await response.json()
                setPaint(jsonData)
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }

        fetchPaint()
    }, [apiUrl])

    return (
        <div>
            <div className="mx-6 my-6 text-3xl">김아들의 동화</div>
            <div className="mx-6 mb-3">
                {paint?.data?.length > 0 ? (
                    <div className="flex flex-row gap-4">
                        {' '}
                        {/* 가로 정렬 및 간격 추가 */}
                        {paint.data.map((item, index) => (
                            <div
                                key={index}
                                className="flex flex-col items-center"
                            >
                                {' '}
                                {/* 이미지 정렬 */}
                                <Image
                                    src={item.bookPictureUrl}
                                    alt={`Book Image ${item.bookId}`}
                                    style={{ width: '200px', height: '200px' }} // 크기 조절
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div>No images found</div>
                )}
            </div>
        </div>
    )
}
