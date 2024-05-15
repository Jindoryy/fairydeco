import Image from 'next/image'
import LogoImage from '../../../../public/image/logo.png'
import LandingImage from '../../../../public/image/landing.gif'
import { CaretDown } from  '@phosphor-icons/react/dist/ssr'

export default function FirstPage() {
    return (
        <div className='h-dvh w-dvw'>
            <div className="flex h-5/6 items-center justify-center pt-16">
                <div className="fixed inset-0 z-[-1]">
                    <Image
                        src={LandingImage}
                        layout="fill"
                        objectFit="fill"
                        alt={'랜딩 페이지 사진'}
                        className="brightness-[80%]"
                        priority
                        />
                </div>
                <div className="absolute left-0 top-0">
                    <Image
                        src={LogoImage}
                        alt="동화꾸미기"
                        width={150}
                        height={100}
                        />
                </div>
                <div>
                    <p
                        className="text-center text-8xl font-thin text-white"
                        style={{
                            WebkitTextStroke: '2px black',
                            textShadow: '4px 4px 4px rgba(0, 0, 0, 0.5)',
                        }}
                        >
                        아이의 그림으로 <br />
                        AI 동화책을 <br /> 만들어 보아요!
                    </p>
                </div>
            </div>
            <div className=" animate-bounce text-white justify-center flex opacity-85" >
                <CaretDown  size={150}  weight="fill" />
            </div>
    </div>
    )
}
