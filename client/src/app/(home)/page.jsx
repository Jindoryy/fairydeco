import Header from '../components/header'
import Prompt from './components/prompt'
import BookList from './components/bookList'

export default function Home() {
    return (
        <div className="h-dvh w-dvw">
            <div className="flex h-auto flex-col items-center">
                <Header />
                <Prompt />
                <BookList />
            </div>
        </div>
    )
}
