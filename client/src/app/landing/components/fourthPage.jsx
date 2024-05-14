import Image from 'next/image'
import { NumberCircleThree } from '@phosphor-icons/react/dist/ssr'
import AIBookImage from '../../../../public/image/aibook.png'

export default function FourthPage() {
    return (
        <div className=" flex h-dvh w-dvw items-center justify-center bg-[#F8E6F9]">
            <div className="pl-20">
                <NumberCircleThree size={70} />
                <span className="text-6xl">
                    만들어진 <span className="text-customOrange">AI 동화</span>
                    를 <br />
                    즐겨보세요. <br />
                    <span className="text-customOrange">소리</span>도 나와요!
                </span>
            </div>
            <div className="pl-20">
                <Image src={AIBookImage} alt="책" width={600} />
            </div>
        </div>
    )
}
