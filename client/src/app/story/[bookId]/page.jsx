'use client'
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import axios from 'axios'

import GuideText from './components/guideText'
import TitleBox from './components/titleBox'
import StoryBox from './components/storyBox'
import ImageButton from './components/imageButton'
import Header from '../../components/header'

export default function Story() {
    const router = useRouter()
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
            if (response.data.data.userId != localStorage.getItem("userId")) {
                alert("접근 권한이 없습니다!")
                router.push("/")
            }
            const book = response.data.data
            setTitle(book.bookName)
            setStory(book.pageList)
        } catch (error) {
            console.error(error)
        }
    }

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
