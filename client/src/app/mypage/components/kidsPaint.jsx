'use client'

import { useEffect, useState } from 'react'

export default function KidsPaint() {
    const [paint, setPaint] = useState(null)

    const URL = `http://k10a402.p.ssafy.io:8081/book/child-picture-list/1`

    useEffect(() => {
        const fetchPaint = async () => {
            try {
                const response = await fetch(URL)
                const jsonData = await response.json()
                setPaint(jsonData)
                console.log(paint)
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }

        fetchPaint()
    }, [])

    return (
        <div className="font-ourFont">
            <div className="text-9xl">ㅇㅇ이의 동화</div>
            <div>{JSON.stringify(paint)}</div>
        </div>
    )
}
