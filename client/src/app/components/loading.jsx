import Image from 'next/image'
import BookGif from '../../../public/image/books.gif'

export default function Loading() {
    return (
        <div className="flex h-dvh w-dvw flex-col items-center justify-center bg-customYellow  text-4xl">
            <Image src={BookGif} alt="Loading..." />
            그림을 분석하고 있어요! 잠시만 기다려 주세요 ...
        </div>
    )
}
