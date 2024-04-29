import Image from 'next/image'
import { SignIn } from '@phosphor-icons/react/dist/ssr'

export default function Header() {
    return (
        <div className="bg-customYellow flex h-20 items-center justify-between px-4">
            <div className="relative h-5/6 w-40">
                <Image
                    src="/image/logo.png"
                    alt="Logo"
                    layout="fill"
                    objectFit="cover"
                />
            </div>
            <SignIn size={40}></SignIn>
        </div>
    )
}
