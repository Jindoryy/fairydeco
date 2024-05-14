'use client'
'use client'
import React, { useEffect, useRef, useState } from 'react'
import FirstPage from './components/firstPage'
import SecondPage from './components/secondPage'
import ThirdPage from './components/thirdPage'
import FourthPage from './components/fourthPage'
import FifthPage from './components/fifthPage'

export default function Landing() {
    const outerDivRef = useRef()
    const touchStartY = useRef(0)
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

    useEffect(() => {
        const touchMoveHandler = (e) => {
            e.preventDefault() // 터치 스크롤 동작 막기
            const deltaY = e.touches[0].clientY - touchStartY.current
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

        const touchStartHandler = (e) => {
            touchStartY.current = e.touches[0].clientY
        }

        const touchEndHandler = () => {
            touchStartY.current = 0
        }

        const outerDivRefTouchCurrent = outerDivRef.current
        outerDivRefTouchCurrent.addEventListener(
            'touchstart',
            touchStartHandler
        )
        outerDivRefTouchCurrent.addEventListener(
            'touchmove',
            touchMoveHandler,
            { passive: false }
        )
        outerDivRefTouchCurrent.addEventListener('touchend', touchEndHandler)

        return () => {
            outerDivRefTouchCurrent.removeEventListener(
                'touchstart',
                touchStartHandler
            )
            outerDivRefTouchCurrent.removeEventListener(
                'touchmove',
                touchMoveHandler
            )
            outerDivRefTouchCurrent.removeEventListener(
                'touchend',
                touchEndHandler
            )
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
