'use client'

import { useEffect, useState } from 'react'

export default function KidsPaint() {
    const [paint, setPaint] = useState(null)
    const [isLoading, setIsLoading] = useState(true) // 로딩 상태 추가
    const apiUrl = process.env.NEXT_PUBLIC_API_URL

    useEffect(() => {
        const fetchPaint = async () => {
            try {
                const response = await fetch(
                    `${apiUrl}/book/child-picture-list/1`
                )
                const jsonData = await response.json()
                setPaint(jsonData)
                // console.log(paint)
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }

        fetchPaint()
    }, [apiUrl])

    // if (isLoading) {
    //     return <div>Loading...</div> // 로딩 중 표시
    // }

    return (
        <div>
            <div className="text-3xl">ㅇㅇ이의 동화</div>
            <div>
                {paint?.data?.length > 0 ? (
                    <div>
                        {paint.data.map((item, index) => (
                            <div key={index}>
                                <img
                                    src={item.bookPictureUrl}
                                    alt={`Book Image ${item.bookId}`}
                                    style={{ width: '200px', height: '200px' }} // Adjust size as needed
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
