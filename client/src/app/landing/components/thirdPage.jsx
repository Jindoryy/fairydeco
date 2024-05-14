import Image from 'next/image'
import BabyImage from '../../../../public/image/baby.png'
import { NumberCircleTwo } from '@phosphor-icons/react/dist/ssr'

export default function ThirdPage() {
    return (
        <div className=" flex h-dvh w-dvw items-center justify-center bg-customLightGreen">
            <div className="pr-20">
                <Image src={BabyImage} alt="아이들" width={700} />
            </div>
            <div className="pr-20">
                <NumberCircleTwo size={70} />
                <span className="text-6xl">
                    아이의 <span className="text-customPurple">나이</span>에
                    맞게
                    <br />
                    <span className="text-customPurple">동화</span>를 만들어
                    드려요!
                </span>
            </div>
        </div>
    )
}
