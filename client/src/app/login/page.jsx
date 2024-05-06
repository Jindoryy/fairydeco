'use client'

import Image from 'next/image'
import backgroundImage from '../../../public/image/login.jpg'
import LoginBox from './components/loginBox'
import { useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'


export default function Login() {
    const router = useRouter()
    const [userId, setUserId] = useState("")
    useEffect(() => {
        let value
        value = localStorage.getItem("userId") || ""
        if (value) {
            alert("이미 로그인 하셨습니다!")
            router.push("/")
        }
      }, [])
      
    return (
        <div className="absolute inset-0 overflow-hidden">
            <Image src={backgroundImage} layout="fill" 
                objectFit="cover" 
                quality={100} 
                alt="Login Background"
                 />
            <LoginBox />
        </div>
    )
}
