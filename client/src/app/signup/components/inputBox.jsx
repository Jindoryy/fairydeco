'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { LockKeyOpen } from '@phosphor-icons/react/dist/ssr'

export default function InputBox() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    const router = useRouter()
    const [userId, setUserId] = useState('')
    const [password, setPassword] = useState('')
    const [passwordCheck, setPasswordCheck] = useState('')
    const [userName, setUserName] = useState('')
    const [idCheck, setIdCheck] = useState('')
    const [pwCheck, setPwCheck] = useState('')

    let checkId = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z0-9]{4,15}$/
    let checkPw = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z0-9]{8,20}$/
    let checkName = /^[A-Za-z가-힣]{1,20}$/

    const goLogin = () => {
        router.push('/login')
    }

    const handleUserId = (e) => {
        setUserId(e.target.value)
    }

    const handleId = async () => {
        if (userId.length == 0) {
            alert('아이디를 입력해주세요')
            return
        } else if (!checkId.test(userId)) {
            alert('아이디는 숫자+영어 4~15글자입니다.')
            return
        }
        try {
            const response = await axios.post(`${apiUrl}/user/checkId`, {
                loginId: userId,
            })
            if (response.data.status == 'success') {
                if (response.data.data == 'unique') {
                    setIdCheck(true)
                } else {
                    setIdCheck(false)
                }
            }
        } catch (error) {
            console.error('Failed to check Id: ', error)
        }
    }

    const handlePassword = (e) => {
        setPassword(e.target.value)
    }

    const handlePasswordCheck = (e) => {
        setPasswordCheck(e.target.value)
    }

    useEffect(() => {
        if (password.length > 0 && password == passwordCheck) {
            setPwCheck(true)
        } else setPwCheck(false)
    }, [password, passwordCheck])

    const handleName = (e) => {
        setUserName(e.target.value)
    }

    const handleSignup = async () => {
        if (!checkId.test(userId)) {
            alert('아이디를 확인해주세요.')
            return
        }
        if (!checkPw.test(password)) {
            alert('비밀번호를 확인해주세요.')
            return
        }
        if (!checkName.test(userName)) {
            alert('이름을 확인해주세요.')
            return
        }
        try {
            const response = await axios.post(`${apiUrl}/user/signup`, {
                loginId: userId,
                password: password,
                name: userName,
            })
            console.log(response.data)
            if (response.data.status == 'success') {
                alert('회원가입이 되었습니다. 로그인을 해주세요!')
                router.push('/login')
            } else {
                alert('다시 한 번 시도해주세요.')
            }
        } catch (error) {
            console.error('Failed to signup: ', error)
        }
    }
    return (
        <>
            <div
                className="z-100 fixed left-4 top-4 cursor-pointer rounded-2xl border-2 border-white p-2"
                onClick={goLogin}
            >
                <LockKeyOpen
                    size={32}
                    weight="fill"
                    style={{ color: 'white' }}
                />
            </div>
            <div className="z-100 fixed right-[8%] top-[7%] flex h-5/6 w-2/5 flex-col items-center justify-center rounded-3xl bg-customPink opacity-85">
                <div className="mb-1 mt-1 h-auto w-11/12 px-8">
                    <div className="text-2xl font-bold">아이디</div>
                    <div className="flex h-auto w-full justify-between">
                        <input
                            placeholder="영문 + 숫자 (4~15자리)"
                            className="h-12 w-9/12 rounded-3xl bg-white pl-2 outline-customGreen"
                            onChange={handleUserId}
                        />
                        <button
                            className="btn btn-sm h-auto w-1/5 bg-customYellow text-base shadow-customShadow hover:bg-customYellow"
                            onClick={handleId}
                        >
                            중복확인
                        </button>
                    </div>
                    {idCheck ? (
                        <>
                            <div className="text-[#B5B8FF]">
                                사용 가능한 아이디입니다!
                            </div>
                        </>
                    ) : (
                        <>
                            {userId.length > 0 ? (
                                <>
                                    <div className="text-customRed">
                                        중복된 아이디입니다.
                                    </div>
                                </>
                            ) : (
                                <></>
                            )}
                        </>
                    )}
                </div>
                <div className="mb-1 mt-1 h-auto w-11/12 px-8">
                    <div className="mb-1 text-2xl font-bold text-black">
                        비밀번호
                    </div>
                    <input
                        type="password"
                        className="h-12 w-full rounded-3xl bg-white pl-2 text-black outline-customGreen"
                        placeholder="영문 + 숫자 (8글자 이상입력해주세요)"
                        onChange={handlePassword}
                    ></input>
                    <div className="mb-1 mt-1 text-2xl font-bold text-black">
                        비밀번호 확인
                    </div>
                    <input
                        type="password"
                        className="h-12 w-full rounded-3xl bg-white pl-2 text-black outline-customGreen"
                        placeholder="영문 + 숫자 (8글자 이상입력해주세요)"
                        onChange={handlePasswordCheck}
                    ></input>
                    {password.length > 0 && pwCheck ? (
                        <>
                            <div className="text-[#B5B8FF]">
                                비밀번호가 일치합니다!
                            </div>
                        </>
                    ) : (
                        <>
                            {password.length > 0 ? (
                                <>
                                    <div className="text-customRed">
                                        비밀번호가 다릅니다! 다시 입력해주세요!
                                    </div>
                                </>
                            ) : (
                                <></>
                            )}
                        </>
                    )}
                </div>
                <div className="mb-1 mt-1 h-auto w-11/12 px-8">
                    <div className="mb-1 text-2xl font-bold text-black">
                        이름
                    </div>
                    <input
                        className="h-12 w-full rounded-3xl bg-white pl-2 text-black outline-customGreen"
                        placeholder="한글 혹은 영문 (1~20 글자)"
                        onChange={handleName}
                    ></input>
                </div>
                <div>
                    <button
                        className="btn btn-sm mb-1 mt-2 h-12 w-full border-none bg-customYellow text-lg text-black shadow-customShadow hover:bg-customYellow"
                        onClick={handleSignup}
                    >
                        가입완료!
                    </button>
                </div>
            </div>
        </>
    )
}
