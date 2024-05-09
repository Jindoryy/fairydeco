'use client'

import Image from 'next/image'
import MakeBookImage from '../../../../public/image/makebook.png'
import PaintingImage from '../../../../public/image/painting.png'
import Shelf from '../../../../public/image/shelf.png'
import House from '../../../../public/image/house.png'
import { useRouter } from 'next/navigation'
import { Baby } from '@phosphor-icons/react/dist/ssr'

export default function ButtonBox() {
    const router = useRouter()

    const goProfile = () => {
        setTimeout(() => {
            router.push('/profile')
        }, 300)
    }

    const goMakeBook = () => {
        setTimeout(() => {
            router.push('/makebook')
        }, 300)
    }

    const goBookList = () => {
        setTimeout(() => {
            router.push('/bookList')
        }, 300)
    }
    const goMypage = () => {
        setTimeout(() => {
            router.push('/mypage')
        }, 300)
    }
    const goPainting = () => {
        setTimeout(() => {
            router.push('/painting')
        }, 300)
    }
    return (
        <div>
            <button
                className="btn btn-ghost relative  ml-2 mt-2 h-10 w-1/12 pt-2 align-middle text-lg font-thin text-white hover:bg-transparent focus:bg-transparent"
                onClick={goProfile}
            >
                <Baby size={50} weight="fill" style={{ color: 'white' }} />
                아이 선택
            </button>
            <div className="flex h-auto w-full items-center justify-between pl-20 pr-80">
                <div className="relative flex flex-col items-center justify-center">
                    <button
                        className="btn btn-ghost flex h-auto w-6/12 -rotate-12 transform flex-col items-center justify-center text-5xl font-thin text-white  hover:rotate-0 hover:bg-transparent focus:bg-transparent"
                        onClick={goMakeBook}
                    >
                        <Image
                            src={MakeBookImage}
                            alt={'make book logo'}
                            style={{
                                position: 'relative',
                                top: 0,
                                left: 0,
                            }}
                        />{' '}
                        동화 만들기
                    </button>
                </div>
                <div className="relative flex flex-col items-center justify-center">
                    <button
                        className="btn btn-ghost flex h-auto w-8/12 rotate-12 transform flex-col items-center justify-center text-5xl font-thin text-white hover:rotate-0 hover:bg-transparent  focus:bg-transparent"
                        onClick={goBookList}
                    >
                        <Image
                            src={Shelf}
                            alt={'make book logo'}
                            style={{
                                zIndex: 100,
                                position: 'relative',
                                top: 0,
                                left: 0,
                            }}
                        />
                        동화 보기
                    </button>
                </div>
            </div>
            <div className="flex h-auto w-full items-center justify-between pl-80 pr-40 pt-4">
                <div className="relative flex flex-col items-center justify-center">
                    <button
                        className="btn btn-ghost flex h-auto w-6/12 rotate-12 transform flex-col items-center justify-center text-5xl font-thin text-white hover:rotate-0  hover:bg-transparent focus:bg-transparent"
                        onClick={goMypage}
                    >
                        <Image
                            src={House}
                            alt={'make book logo'}
                            style={{
                                zIndex: 100,
                                position: 'relative',
                                top: 0,
                                left: 0,
                            }}
                        />{' '}
                        나의 그림
                    </button>
                </div>
                <div className="relative flex flex-col items-center justify-center">
                    <button
                        className="btn btn-ghost flex h-auto w-10/12 -rotate-12 transform flex-col items-center justify-center text-5xl font-thin text-white hover:rotate-0 hover:bg-transparent focus:bg-transparent"
                        onClick={goPainting}
                    >
                        <Image
                            src={PaintingImage}
                            alt={'make book logo'}
                            style={{
                                zIndex: 100,
                                position: 'relative',
                                top: 0,
                                left: 0,
                            }}
                        />{' '}
                        그림 그리기
                    </button>
                </div>
            </div>
        </div>
    )
}
