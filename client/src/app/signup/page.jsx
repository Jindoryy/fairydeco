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
                priority
            />
            <div className='relative top-48 left-40 text-6xl'>현재는 회원가입이 불가능합니다. 다음에 시도해주세요.</div>
            {/* <InputBox /> */}
        </div>
    )
}
