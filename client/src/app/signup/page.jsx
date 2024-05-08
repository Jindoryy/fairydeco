import InputBox from './components/inputBox'
import Image from 'next/image'
import backgroundImage from '../../../public/image/login.jpg'

export default function Signup() {
    return (
        <div>
            <Image
                src={backgroundImage}
                layout="fill"
                objectFit="cover"
                quality={100}
                alt="Login Background"
            />
            <InputBox />
        </div>
    )
}
