'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'

import GuideText from './components/guideText'
import TitleBox from './components/titleBox'
import StoryBox from './components/storyBox'

export default function Story() {
    const [title, setTitle] = useState('')
    const [story, setStory] = useState([])

    const bookId = 4
    const getStory = async () => {
        try {
            const response = await axios.get(
                `http://k10a402.p.ssafy.io:8081/book/story-detail/${bookId}`
            )
            const book = response.data.data
            setTitle(book.bookName)
            setStory(book.pageList)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        getStory()
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
