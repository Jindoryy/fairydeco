import Image from 'next/image'
import Link from 'next/link'
import { SignIn } from '@phosphor-icons/react/dist/ssr'
import headerPic from '../../../public/image/logo.png'

export default function Header() {
    return (
        <div className="flex h-20 w-full items-center justify-between bg-customYellow px-4">
            <div className="relative h-5/6 w-40">
                <Image src={headerPic} alt="Logo" width={130} height={10} />
            </div>
            <Link href="/login">
                <SignIn size={40}></SignIn>
            </Link>
        </div>
    )
}
