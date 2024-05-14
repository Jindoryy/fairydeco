'use client'

import Image from 'next/image'
import MainImage from '../../../../public/image/mainpage.jpg'
import CanvasBox from './components/canvasBox'
import { useState } from 'react'
import Loading from '../../components/loading'

export default function PaintFile() {
    const [loading, setLoading] = useState(true)

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
                    <div className="h-dvh w-dvw bg-white">
                        <CanvasBox handleLoading={handleLoading} />
                    </div>
                </>
            )}
        </>
    )
}
