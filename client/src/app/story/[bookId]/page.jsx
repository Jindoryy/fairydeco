'use client'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import axios from 'axios'

import GuideText from './components/guideText'
import TitleBox from './components/titleBox'
import StoryBox from './components/storyBox'
import ImageButton from './components/imageButton'
import Header from '../../components/header'

export default function Story() {
    const pathname = usePathname()
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    let bookId = pathname
        .split('')
        .reverse()
        .join('')
        .split('/')[0]
        .split('')
        .reverse()
        .join('')
    const [title, setTitle] = useState('')
    const [story, setStory] = useState([])

    const [userId, setUserId] = useState("")
    useEffect(() => {
        let value = localStorage.getItem("userId") || ""
        setUserId(value)
        getStory(bookId)
      }, [])

    const getStory = async (bookId) => {
        
        try {
            const response = await axios.get(
                `${apiUrl}/book/story-detail/${bookId}`
            )
            const book = response.data.data
            setTitle(book.bookName)
            setStory(book.pageList)
        } catch (error) {
            console.error(error)
        }
    }


    useEffect(() => {}, [title, story])
    return (
        <div className="flex flex-col items-center justify-center">
            <Header />
            <GuideText />
            <TitleBox title={title} bookId={bookId} />
            <StoryBox story={story} />
            <ImageButton bookId={bookId} />
        </div>
    )
}
