import Image from 'next/image'
import Link from 'next/link'
import { SignIn } from '@phosphor-icons/react/dist/ssr'

export default function Header() {
    return (
        <div className="flex h-20 items-center justify-between bg-customYellow px-4">
            <div className="relative h-5/6 w-40">
                <Image
                    src="/image/logo.png"
                    alt="Logo"
                    layout="fill"
                    objectFit="cover"
                />
            </div>
            <Link href="/login">
                <SignIn size={40}></SignIn>
            </Link>
        </div>
    )
}
