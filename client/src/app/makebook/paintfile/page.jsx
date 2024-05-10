import Image from 'next/image'
import MainImage from '../../../../public/image/mainpage.jpg'
import CanvasBox from './components/canvasBox'

export default function PaintFile() {
    return (
        <div className="h-dvh w-dvw bg-white">
            <CanvasBox />
        </div>
    )
}
