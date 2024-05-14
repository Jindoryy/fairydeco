import Image from 'next/image'
import BooksImage from '../../../../public/image/books.png'
import { NumberCircleOne } from '@phosphor-icons/react/dist/ssr'

export default function SecondPage() {
    return (
        <div className=" flex h-dvh w-dvw items-center justify-center bg-customPink">
            <div>
                <NumberCircleOne size={70} />
                <span className="text-6xl">
                    <span className="text-customGreen">아이</span>가 직접{' '}
                    <span className="text-customGreen">그림</span>을 그리거나{' '}
                    <br /> 그렸던 그림을 올려봐요!
                </span>
            </div>
            <div>
                <Image src={BooksImage} alt="책" width={600} />
            </div>
        </div>
    )
}
