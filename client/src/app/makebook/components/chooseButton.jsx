'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import PencilImage from '../../../../public/image/pencil.png'
import FileImage from '../../../../public/image/file.png'
import { ArrowCircleLeft } from '@phosphor-icons/react/dist/ssr'

export default function ChooseButton() {
    const router = useRouter()
    const goPainting = () => {
        router.push('/makebook/paintfile')
    }
    const goUpload = () => {
        router.push('/makebook/uploadfile')
    }
    const goBack = () => {
        router.push('/')
    }

    return (
        <div className="h-dvh w-dvw">
            <button
                className="btn btn-ghost relative ml-2 h-auto w-1/12 pt-2 align-middle text-lg font-thin text-white hover:bg-transparent focus:bg-transparent"
                onClick={goBack}
            >
                <ArrowCircleLeft
                    size={80}
                    weight="fill"
                    className="text-white"
                />
            </button>
            <div className="flex h-5/6 flex-col items-center justify-start">
                <div className="relative top-0 h-auto text-2xl text-white">
                    그림 한 장으로 동화를 만들어봐요!
                </div>
                <div className="relative top-0 h-auto text-4xl text-white">
                    함께 그림을 그려볼까요?
                </div>
                <div className="relative flex h-full w-full items-start justify-center">
                    <button
                        className="btn relative m-4 mr-8 h-5/6 w-1/3 rounded-3xl border-none bg-customBlueBorder p-4 text-5xl font-thin shadow-innerShadow hover:bg-customBlueBorder "
                        onClick={goPainting}
                    >
                        <div className="h-10/12 relative flex w-full animate-wiggle items-center justify-center">
                            <Image
                                src={PencilImage}
                                alt="연필그림"
                                width={300}
                                height={300}
                                objectFit="cover"
                                quality={100}
                            />
                        </div>
                        지금 그려볼래요
                    </button>
                    <button
                        className="btn relative m-4 ml-8 h-5/6 w-1/3 rounded-3xl border-none bg-customDarkYellow p-4 text-5xl font-thin shadow-innerShadow hover:bg-customDarkYellow"
                        onClick={goUpload}
                    >
                        <div className="h-10/12 relative flex w-full animate-bounce items-center justify-center">
                            <Image
                                src={FileImage}
                                alt="파일 그림"
                                width={300}
                                height={300}
                                objectFit="cover"
                                quality={100}
                            />
                        </div>
                        그림이 있어요
                    </button>
                </div>
            </div>
        </div>
    )
}
