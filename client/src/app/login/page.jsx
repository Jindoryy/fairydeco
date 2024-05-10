import Image from 'next/image'
import backgroundImage from '../../../public/image/login.jpg'
import LoginBox from './components/loginBox'

export default function Login() {
    return (
        <div className="absolute inset-0 overflow-hidden">
            <Image
                src={backgroundImage}
                layout="fill"
                objectFit="cover"
                quality={100}
                alt="Login Background"
            />
            <LoginBox />
        </div>
    )
}
