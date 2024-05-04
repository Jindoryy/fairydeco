'use client'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import axios from 'axios'

import GuideText from './components/guideText'
import TitleBox from './components/titleBox'
import StoryBox from './components/storyBox'
import ImageButton from './components/imageButton'

export default function Story() {
    const pathname = usePathname()
    const apiUrl = "https://fairydeco.site/api"
    let bookId = pathname
        .split('')
        .reverse()
        .join('')
        .split('/')[0]
        .split('')
        .reverse()
        .join('')
    console.log(bookId)
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
            <ImageButton bookId={bookId} />
        </div>
    )
}
