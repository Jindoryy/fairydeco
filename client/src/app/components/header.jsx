'use client'

import Image from 'next/image'
import Link from 'next/link'
import { SignIn, AddressBook } from '@phosphor-icons/react/dist/ssr'
import headerPic from '../../../public/image/logo.png'
import { useEffect, useState } from "react"

export default function Header() {
    const [userId, setUserId] = useState("")
    useEffect(() => {
        let value
        value = localStorage.getItem("userId") || ""
        setUserId(value)
      }, [])
    return (
        <div className="flex h-20 w-full items-center justify-between bg-customYellow px-4">
            <div className="relative h-5/6 w-40 flex items-start justify-center">
                <Link href="/">
                <Image src={headerPic} alt="Logo" fill={true} sizes='(min-width: 60em) 24vw, (min-width: 28em) 45vw, 100vw'/>
                </Link>
            </div>
            {userId ? <Link href="/mypage">
                <AddressBook size={40} />
            </Link> :
            <Link href="/login">
                <SignIn size={40}></SignIn>
            </Link>
            }
        </div>
    )
}
