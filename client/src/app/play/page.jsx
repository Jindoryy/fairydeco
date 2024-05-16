import Image from 'next/image'
import MainImage from '../../../public/image/mainpage.jpg'
import ChooseButton from './components/chooseButton'

export default function PlayPage() {
    return (
        <div className="h-dvh w-dvw">
            <Image
                src={MainImage}
                layout="fill"
                objectFit="cover"
                quality={100}
                alt={'메인 페이지 사진'}
                className="brightness-[60%]"
            />
            <ChooseButton />
        </div>
    )
}
