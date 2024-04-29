import Link from 'next/link'
import Header from '../components/header'
import Prompt from './components/prompt'

export default function Home() {
    return (
        <div>
            <Header></Header>
            <div className="flex flex-col items-center justify-center ">
                <Prompt />
            </div>
        </div>
    )
}
