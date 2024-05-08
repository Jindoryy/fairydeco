'use client'

import Header from '../components/header'
import Prompt from './components/prompt'
import BookList from './components/bookList'
import { useState } from 'react'
import Loading from '../components/loading'

export default function Home() {
    const [loading, setLoading] = useState(false)
    const handleLoading = (status) => {
        setLoading(status)
    }
    return (
        <div className="h-dvh w-dvw">
            <div className="flex h-auto flex-col items-center">
                {loading ? (
                    <>
                        <Loading />
                    </>
                ) : (
                    <>
                        <Header />
                        <Prompt handleLoading={handleLoading} />
                        <BookList />
                    </>
                )}
            </div>
        </div>
    )
}
