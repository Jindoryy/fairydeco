'use client'

import Image from 'next/image'
import MainImage from '../../../../public/image/mainpage.jpg'
import UploadBox from './components/uploadBox'
import { useState } from 'react'
import Loading from '../../components/loading'

export default function UploadFile() {
    const [loading, setLoading] = useState(false)

    const handleLoading = (status) => {
        setLoading(status)
    }
    return (
        <>
            {loading ? (
                <>
                    <Loading />
                </>
            ) : (
                <>
                    <div className="h-dvh w-dvw">
                        <Image
                            src={MainImage}
                            layout="fill"
                            objectFit="cover"
                            quality={100}
                            alt={'메인 페이지 사진'}
                            className="brightness-[60%]"
                        />
                        <UploadBox handleLoading={handleLoading} />
                    </div>
                </>
            )}
        </>
    )
}
