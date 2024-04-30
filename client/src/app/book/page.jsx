'use client'

import { useRef, useEffect } from 'react'
import $ from 'jquery'
import 'turn.js'
import styles from './components/Flipbook.module.css' // CSS 모듈 임포트

const Flipbook = ({ options = {} }) => {
    const bookRef = useRef(null)

    useEffect(() => {
        const book = bookRef.current
        if (book) {
            $(book).turn(options)

            const handleResize = () => {
                book.style.width = ''
                book.style.height = ''
                $(book).turn('size', book.clientWidth, book.clientHeight)
            }

            window.addEventListener('resize', handleResize)

            return () => {
                $(book).turn('destroy')
                window.removeEventListener('resize', handleResize)
            }
        }
    }, [options])

    return (
        <div className={styles.flipbook} ref={bookRef}>
            {pages.map((page, index) => (
                <div key={index} className={styles.page}>
                    <img src={page} draggable="false" alt="" />
                </div>
            ))}
        </div>
    )
}

export default Flipbook
