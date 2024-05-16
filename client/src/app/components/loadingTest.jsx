import Image from 'next/image'
import BookGif from '../../../public/image/books.gif'

export default function Loading() {
    console.log('loading...')
    return (
        <div className="flex h-dvh w-dvw flex-col items-center justify-center bg-customYellow  text-4xl">
            <Image src={BookGif} alt="Loading..." />
            책장에서 책을 꺼내고 있어요! 잠시만 기다려주세요 ...
        </div>
    )
}
