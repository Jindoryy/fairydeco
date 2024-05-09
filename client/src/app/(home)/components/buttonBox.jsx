'use client'

import Image from 'next/image'
import MakeBookImage from '../../../../public/image/makebook.png'
import PaintingImage from '../../../../public/image/painting.png'
import Shelf from '../../../../public/image/shelf.png'
import House from '../../../../public/image/house.png'
import { useRouter } from 'next/navigation'

export default function ButtonBox() {
    const router = useRouter()
    const goMakeBook = () => {
        // alert('동화책 만들기')
        // router.push('/makebook')
    }
    const goBookList = () => {
        // alert('동화책 보기')
        // router.push('/bookList')
    }
    const goMypage = () => {
        // alert('내정보 보기')
        // router.push("/mypage")
    }
    const goPainting = () => {
        // alert('그림 그리기')
        // router.push("/painting")
    }
    return (
        <div>
            <div className="flex h-auto w-full items-center justify-between pl-20 pr-80 pt-16">
                <div className="relative flex flex-col items-center justify-center">
                    <button
                        className="btn btn-ghost flex h-auto w-6/12 -rotate-12 transform flex-col items-center justify-center hover:bg-transparent focus:bg-transparent"
                        onClick={goMakeBook}
                    >
                        <Image
                            src={MakeBookImage}
                            alt={'make book logo'}
                            style={{
                                zIndex: 100,
                                position: 'relative',
                                top: 0,
                                left: 0,
                            }}
                        />
                    </button>
                    <button className="btn btn-ghost h-auto w-full -rotate-12 transform pl-20 text-5xl  text-white hover:bg-transparent focus:bg-transparent">
                        동화 만들기
                    </button>
                </div>
                <div className="relative flex flex-col items-center justify-center">
                    <button
                        className="btn btn-ghost flex h-auto w-8/12 rotate-12 transform flex-col items-center justify-center hover:bg-transparent focus:bg-transparent"
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
                    </button>
                    <button className="btn btn-ghost h-auto w-full rotate-12 transform pr-20 text-5xl  text-white hover:bg-transparent focus:bg-transparent">
                        동화 보기
                    </button>
                </div>
            </div>
            <div className="flex h-auto w-full items-center justify-between pl-80 pr-40 pt-4">
                <div className="relative flex flex-col items-center justify-center">
                    <button
                        className="btn btn-ghost flex h-auto w-7/12 rotate-12 transform flex-col items-center justify-center hover:bg-transparent focus:bg-transparent"
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
                        />
                    </button>
                    <button className="btn btn-ghost h-auto w-full rotate-6 transform pr-14 text-5xl  text-white hover:bg-transparent focus:bg-transparent">
                        나의 그림
                    </button>
                </div>
                <div className="relative flex flex-col items-center justify-center">
                    <button
                        className="btn btn-ghost flex h-auto w-10/12 -rotate-12 transform flex-col items-center justify-center hover:bg-transparent focus:bg-transparent"
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
                        />
                    </button>
                    <button className="btn btn-ghost h-auto w-full -rotate-6 transform text-5xl  text-white hover:bg-transparent focus:bg-transparent">
                        그림 그리기
                    </button>
                </div>
            </div>
        </div>
    )
}
