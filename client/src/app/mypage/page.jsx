'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { HouseLine, Baby } from '@phosphor-icons/react/dist/ssr'

import KidsPainting from './components/kidsPainting'

export default function Mypage() {
    const [userInfo, setUserInfo] = useState(null)
    const [showKidsPaint, setShowKidsPaint] = useState(false) // KidsPaint 표시 여부를 위한 상태 추가

    const apiUrl = process.env.NEXT_PUBLIC_API_URL

    const childId = localStorage.getItem('childId')
    const URL = `${apiUrl}/user/mypage/${childId}`

    // 데이터를 가져와서 상태에 저장
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(URL)
                const jsonData = await response.json()
                setUserInfo(jsonData)
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }

        fetchData() // useEffect가 마운트될 때 데이터 가져오기
    }, [])

    useEffect(() => {
        // 3초(3000ms) 후에 KidsPaint를 표시하도록 설정
        const timer = setTimeout(() => {
            setShowKidsPaint(true)
        }, 1000) // 3초 동안 지연

        // 메모리 누수 방지를 위해 타이머 정리
        return () => clearTimeout(timer)
    }, []) // 빈 종속성 배열이므로 마운트 시에만 실행

    const childName = userInfo?.data.childName
    const childGender = userInfo?.data.childGender === 'MAN' ? '남' : '여'
    const bookList = userInfo?.data.bookList

    return (
        <div className="bg-[#FFFDEA] font-ourFont tracking-wider">
            <div className="flex justify-between py-5 ">
                <Link href="/">
                    <HouseLine
                        size={50}
                        weight="fill"
                        style={{ color: '#A0D468', marginLeft: '30px' }}
                    />
                </Link>
                <Link href="/profile">
                    <div>
                        <Baby
                            size={50}
                            style={{ color: '#A0D468', marginRight: '30px' }}
                        />
                    </div>
                </Link>
            </div>{' '}
            <div className="flex flex-row items-center justify-center gap-8">
                <div className="w-1/3">
                    <img
                        src={userInfo?.data.childProfileUrl}
                        className="ml-24 h-[280px] w-[280px] rounded-full border-4  border-customOrange object-cover"
                    ></img>
                </div>
                <div className="mr-7 flex h-[350px] w-1/2 justify-around rounded-[30px] bg-white p-10 text-3xl">
                    <div className="mx-5 flex-grow pr-5">
                        {' '}
                        <div className="mb-3 mt-3 text-5xl">나는</div>
                        {/* 부모님의 정보 */}
                        <div>
                            <div>이름 : {childName}</div>
                            <div>성별 : {childGender}</div>
                            <div>생년월일 : {userInfo?.data.childBirth}</div>
                            <div>부모님 성함 : {userInfo?.data.userName}</div>
                            <div>아이디 : {userInfo?.data.userLoginId}</div>
                        </div>
                        <br />
                    </div>
                </div>
            </div>
            {showKidsPaint && (
                <KidsPainting
                    childId={childId}
                    childName={childName}
                    bookList={bookList}
                />
            )}{' '}
            {/* 지연된 KidsPaint 표시 */}
        </div>
    )
}
