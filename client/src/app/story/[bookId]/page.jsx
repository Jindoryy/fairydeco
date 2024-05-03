'use client'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import axios from 'axios'

import GuideText from './components/guideText'
import TitleBox from './components/titleBox'
import StoryBox from './components/storyBox'

export default function Story() {
    const pathname = usePathname()
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    let bookId = parseInt(
        pathname.charAt(pathname.length - 2) +
            pathname.charAt(pathname.length - 1)
    )
    const [title, setTitle] = useState('')
    const [story, setStory] = useState([])

    const getStory = async (bookId) => {
        console.log(bookId)
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

    useEffect(() => {
        getStory(bookId)
    }, [])

    useEffect(() => {}, [title, story])
    return (
        <div className="flex flex-col items-center justify-center">
            <GuideText />
            <TitleBox title={title} bookId={bookId} />
            <StoryBox story={story} />
        </div>
    )
}
