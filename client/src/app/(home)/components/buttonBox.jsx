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
        alert('동화책 만들기')
        // router.push('/makebook')
    }
    const goBookList = () => {
        alert('동화책 보기')
        // router.push('/bookList')
    }
    const goMypage = () => {
        alert('내정보 보기')
        // router.push("/mypage")
    }
    const goPainting = () => {
        alert('그림 그리기')
        // router.push("/painting")
    }
    return (
        <div>
            <div className="flex h-auto w-full items-center justify-between pl-20 pr-20 pt-16">
                <div
                    className="flex w-1/3 -rotate-12 transform flex-col items-center justify-center"
                    onClick={goMakeBook}
                >
                    <Image
                        src={MakeBookImage}
                        alt={'make book logo'}
                        style={{
                            zIndex: 100,
                            position: 'relative',
                            top: 0,
                        }}
                    />
                    <div className="text-5xl text-white">동화 만들기</div>
                </div>
                <div
                    className="mr-48 flex w-1/4  transform flex-col items-center justify-center"
                    onClick={goBookList}
                >
                    <Image
                        src={Shelf}
                        alt={'make book logo'}
                        style={{
                            zIndex: 100,
                            position: 'relative',
                            top: 0,
                        }}
                    />
                    <div className="text-5xl text-white">동화 보기</div>
                </div>
            </div>
            <div className="flex w-full items-center justify-between pb-20 pl-60">
                <div
                    className="flex w-1/3 rotate-12 transform flex-col items-center justify-center "
                    onClick={goMypage}
                >
                    <Image
                        src={House}
                        alt={'make book logo'}
                        style={{
                            zIndex: 100,
                            position: 'relative',
                            top: 0,
                        }}
                    />
                    <div className="-rotate-6 transform text-5xl text-white">
                        나의 그림
                    </div>
                </div>
                <div
                    className="mr-24 flex w-2/5 transform flex-col items-center justify-center"
                    onClick={goPainting}
                >
                    <Image
                        src={PaintingImage}
                        alt={'make book logo'}
                        style={{
                            zIndex: 100,
                            position: 'relative',
                            top: 0,
                        }}
                    />
                    <div className="text-5xl text-white">그림 그리기</div>
                </div>
            </div>
        </div>
    )
}
