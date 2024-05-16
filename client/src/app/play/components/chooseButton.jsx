'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import PencilImage from '../../../../public/image/pencil.png'
import PlayImage from '../../../../public/image/play.png'
import { ArrowCircleLeft } from '@phosphor-icons/react/dist/ssr'

export default function ChooseButton() {
    const router = useRouter()
    const goPainting = () => {
        router.push('/play/painting')
    }
    const goPuzzle = () => {
        router.push('/play/puzzle')
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
                    신나는 놀이터!
                </div>
                <div className="relative top-0 h-auto text-4xl text-white">
                    어떤 놀이를 해볼까요?
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
                                width={250}
                                height={250}
                                objectFit="cover"
                                quality={100}
                            />
                        </div>
                        그림 그리기
                    </button>
                    <button
                        className="btn relative m-4 ml-8 h-5/6 w-1/3 rounded-3xl border-none bg-customDarkYellow p-4 text-5xl font-thin shadow-innerShadow hover:bg-customDarkYellow"
                        onClick={goPuzzle}
                    >
                        <div className="h-10/12 relative flex w-full animate-bounce items-center justify-center">
                            <Image
                                src={PlayImage}
                                alt="퍼즐 그림"
                                width={250}
                                height={250}
                                objectFit="cover"
                                quality={100}
                            />
                        </div>
                        퍼즐 맞추기
                    </button>
                </div>
            </div>
        </div>
    )
}
