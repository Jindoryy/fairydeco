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
    const DIVIDER_HEIGHT = 5
    let currentPage = 0;
    let isScrolling = false;
    let isTouching = false;
    let scrollTimeout;

    useEffect(() => {

        window.addEventListener('wheel', function(event) {
            if (!isScrolling) {
                isScrolling = true;
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(function() {
                    // 타임아웃 후 페이지 이동
                    if (event.deltaY > 0) {
                        // 아래로 스크롤할 때
                        currentPage++;
                    } else if (event.deltaY < 0) {
                        // 위로 스크롤할 때
                        currentPage--;
                    }
                    changePage(currentPage);
                    isScrolling = false;
                }, 200)
            }
        });
        let startY;

        window.addEventListener('touchstart', function(event) {
            startY = event.touches[0].clientY;
        });
        
        window.addEventListener('touchend', function(event) {
            const endY = event.changedTouches[0].clientY; 
            const deltaY = startY - endY;
            console.log("touching")
            if (!isTouching) {
                console.log("here")
                isTouching  = true;
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(function() {
                    // 타임아웃 후 페이지 이동
                    if (deltaY > 0) {
                        // 아래로 스크롤할 때
                        currentPage++;
                    } else if (deltaY < 0) {
                        // 위로 스크롤할 때
                        currentPage--;
                    }
                    changePage(currentPage);
                    isTouching = false;
                }, 200)
            }
        })
    })
    const changePage = (page) => {
        let pageHeight = window.innerHeight
        let heightSum = pageHeight + DIVIDER_HEIGHT

        outerDivRef.current.scrollTo({
            top: heightSum * (page),
            left: 0,
            behavior: 'smooth',
        })
    }
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
