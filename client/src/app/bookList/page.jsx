import AgeList from './components/ageList'
import Image from 'next/image'
import WallImage from '../../../public/image/wall.jpg'

export default function BookList() {
    return (
        <div className="h-dvh w-dvw">
            <Image
                src={WallImage}
                layout="fill"
                objectFit="cover"
                quality={100}
                alt={'메인 페이지 사진'}
            />
            <AgeList />
        </div>
    )
}
