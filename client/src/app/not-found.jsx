'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import ErrorImage from '../../public/image/error.png'

export default function NotFound() {
    const router = useRouter()
    const goHome = () => {
        router.push('/')
    }
    return (<div className='w-dvw h-dvh bg-customBlueBorder flex justify-center items-center'>
        <div className='w-3/4 h-3/4 bg-white rounded-3xl flex flex-col justify-center items-center'>
            <Image src={ErrorImage} width={450} height={300} alt="404 ERROR!"/>
            <div className='text-4xl mt-4 text-customGray'>앗! 이 페이지를 찾을 수 없어요! </div>
            <button className='btn btn-lg mt-8 bg-customBlueBorder font-thin text-2xl text-white hover:bg-customBlueBorder' onClick={goHome}>홈페이지로 돌아가기</button>

        </div>

    </div>)
}
