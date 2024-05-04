import Link from 'next/link'
import Header from '../components/header'
import Prompt from './components/prompt'
import BookList from './components/bookList'

export default function Home() {
    return (
        <div className="h-dvh w-dvw">
            <div className="flex h-full flex-col items-center justify-center">
                <Prompt />
                <BookList />
            </div>
        </div>
    )
}
