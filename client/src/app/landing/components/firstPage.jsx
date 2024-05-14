import Image from 'next/image'
import LogoImage from '../../../../public/image/logo.png'
import LandingImage from '../../../../public/image/landing.gif'
import DownImage from '../../../../public/image/down.png'

export default function FirstPage() {
    return (
        <div className="flex h-dvh w-dvw flex-col items-center justify-center">
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
            <div className="h-[50px] w-[150px] pt-20">
                <Image src={DownImage} alt="아래로" layout="intrinsic" />
            </div>
        </div>
    )
}
