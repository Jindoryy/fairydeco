'use client'

import { ArrowFatLeft } from '@phosphor-icons/react/dist/ssr'
import { useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'

export default function LoginBox() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    const router = useRouter()
    const [userId, setUserId] = useState('')
    const [password, setPassword] = useState('')
    const Swal = require('sweetalert2')

    useEffect(() => {
        let value
        value = localStorage.getItem('userId') || ''
        if (value) {
            Swal.fire({
                title: '앗!',
                text: '이미 로그인 했어요!',
                icon: 'error',
                confirmButtonText: '돌아가기',
            })
            router.push('/profile')
        }
    }, [])

    const goBack = () => {
        router.push('/')
    }

    const handleUserId = (e) => {
        setUserId(e.target.value)
    }

    const handlePassword = (e) => {
        setPassword(e.target.value)
    }

    const goSignup = () => {
        router.push('/signup')
    }

    const doLogin = async () => {
        try {
            const response = await axios.post(`${apiUrl}/user/login`, {
                loginId: userId,
                password: password,
            })
            if (response.data.status == 'success') {
                localStorage.setItem('userId', response.data.data.userId)
                Swal.fire({
                    title: '안녕하세요!',
                    text: '반가워요!',
                    icon: 'success',
                    confirmButtonText: '네, 반갑습니다!',
                })
                router.push('/profile')
            } else {
                Swal.fire({
                    title: '앗!',
                    text: '아이디가 없거나, 비밀번호가 틀렸습니다! 다시 입력해주세요!',
                    icon: 'error',
                    confirmButtonText: '네',
                })
            }
        } catch (error) {
            Swal.fire({
                title: '앗!',
                text: '아이디가 없거나, 비밀번호가 틀렸습니다! 다시 입력해주세요!',
                icon: 'error',
                confirmButtonText: '네',
            })
            console.error('Login error: ', error)
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            doLogin()
        }
    }
    return (
        <>
            <div
                className="z-100 fixed left-4 top-4 cursor-pointer rounded-2xl border-2 p-2"
                onClick={goBack}
            >
                <ArrowFatLeft
                    size={32}
                    weight="fill"
                    style={{ color: 'white' }}
                />
            </div>
            <div className="z-100 fixed right-[8%] top-[20%] flex h-4/6 w-2/5 flex-col items-center justify-center rounded-3xl bg-customPink opacity-85">
                <div className="w-11/12 p-8 pt-4">
                    <div className="mb-1 text-4xl font-bold text-black">
                        아이디
                    </div>
                    <input
                        className="h-14 w-full rounded-xl bg-white pl-2 text-2xl text-black outline-customGreen"
                        onChange={handleUserId}
                        onKeyPress={handleKeyPress}
                    ></input>
                </div>
                <div className="w-11/12 px-8">
                    <div className="mb-1 text-4xl font-bold text-black">
                        비밀번호
                    </div>
                    <input
                        type="password"
                        className="h-14 w-full rounded-xl bg-white pl-2 text-2xl text-black outline-customGreen"
                        onChange={handlePassword}
                        onKeyPress={handleKeyPress}
                    ></input>
                </div>
                <div className="mt-8 flex w-11/12 justify-between px-8">
                    {/* <div className="flex w-2/3 flex-col"> 임시로 회원가입 막기
                        <div className="text-xl font-bold">
                            아직 회원이 아니세요?
                        </div>
                        <div className="text-4xl font-bold">
                            <button onClick={goSignup}>
                                <span className="text-customPurple">
                                    회원가입
                                </span>
                                하기
                            </button>
                        </div>
                    </div> */}
                    <div className="w-1/3">
                        <button
                            className="btn btn-sm mb-2 mt-4 h-12 w-full border-none bg-customYellow text-lg text-black shadow-customShadow hover:bg-customYellow"
                            onClick={doLogin}
                        >
                            로그인
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
