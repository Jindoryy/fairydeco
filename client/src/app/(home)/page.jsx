import Image from 'next/image'
import MainImage from '../../../public/image/mainpage.jpg'
import ButtonBox from './components/buttonBox'

export default function Home() {
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
            <ButtonBox />
        </div>
    )
}
