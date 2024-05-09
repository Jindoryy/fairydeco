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
        <div>
            <button
                className="btn btn-ghost relative ml-2 h-10 w-1/12 pt-2 align-middle text-lg font-thin text-white hover:bg-transparent focus:bg-transparent"
                onClick={goBack}
            >
                <ArrowCircleLeft
                    size={80}
                    weight="fill"
                    className="text-white"
                />
            </button>
            <div className="relative flex h-auto w-full items-center justify-center pt-12">
                <button
                    className="shadow-innerShadow btn relative m-4 mr-8 h-[500px] w-1/3 rounded-3xl border-none bg-customBlueBorder p-4 text-5xl font-thin hover:bg-customBlueBorder "
                    onClick={goPainting}
                >
                    <div className="h-10/12 animate-wiggle relative flex w-full items-center justify-center">
                        <Image
                            src={PencilImage}
                            alt="연필그림"
                            width={300}
                            height={300}
                            objectFit="cover"
                            quality={100}
                        />
                    </div>
                    지금 그려볼래요!
                </button>
                <button
                    className="shadow-innerShadow bg-customDarkYellow hover:bg-customDarkYellow btn relative m-4 ml-8 h-[500px] w-1/3 rounded-3xl border-none p-4 text-5xl font-thin"
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
                    이미 그렸어요
                </button>
            </div>
        </div>
    )
}
