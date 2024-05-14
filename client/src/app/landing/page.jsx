'use client'
import React, { useEffect, useRef, useState } from 'react'
import FirstPage from './components/firstPage'
import SecondPage from './components/secondPage'
import ThirdPage from './components/thirdPage'
import FourthPage from './components/fourthPage'
import FifthPage from './components/fifthPage'

export default function Landing() {
    const outerDivRef = useRef()
    const [currentPage, setCurrentPage] = useState(1)
    const DIVIDER_HEIGHT = 5

    useEffect(() => {
        const wheelHandler = (e) => {
            e.preventDefault()
            const { deltaY } = e
            const { scrollTop } = outerDivRef.current
            const pageHeight = window.innerHeight

            let nextPage = currentPage

            if (deltaY > 0) {
                nextPage = Math.min(currentPage + 1, 5)
            } else {
                nextPage = Math.max(currentPage - 1, 1)
            }

            setCurrentPage(nextPage)

            outerDivRef.current.scrollTo({
                top:
                    (nextPage - 1) * pageHeight +
                    (nextPage - 1) * DIVIDER_HEIGHT,
                left: 0,
                behavior: 'smooth',
            })
        }

        const outerDivRefCurrent = outerDivRef.current
        outerDivRefCurrent.addEventListener('wheel', wheelHandler, {
            passive: false,
        })

        return () => {
            outerDivRefCurrent.removeEventListener('wheel', wheelHandler)
        }
    }, [currentPage])

    return (
        <div
            ref={outerDivRef}
            className="h-screen overflow-hidden overflow-y-hidden"
        >
            <FirstPage />
            <div className="bg-gray h-[5px] w-full"></div>
            <SecondPage />
            <div className="bg-gray h-[5px] w-full"></div>
            <ThirdPage />
            <div className="bg-gray h-[5px] w-full"></div>
            <FourthPage />
            <div className="bg-gray h-[5px] w-full"></div>
            <FifthPage />
        </div>
    )
}
