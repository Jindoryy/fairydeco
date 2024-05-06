'use client'

import { useState, useEffect } from 'react'
import KidsPaint from './components/kidspaint'
import axios from 'axios'
import { PencilSimpleLine } from '@phosphor-icons/react/dist/ssr'

export default function Mypage() {
    const [userInfo, setUserInfo] = useState(null)
    const [showKidsPaint, setShowKidsPaint] = useState(false) // KidsPaint 표시 여부를 위한 상태 추가

    const apiUrl = process.env.NEXT_PUBLIC_API_URL

    useEffect(() => {
        const postUserData = async () => {
            try {
                const response = await axios.post(`${apiUrl}/user/mypage`, {
                    userId: 1,
                }) // POST 요청을 보내고 데이터로 객체를 전달합니다.
                setUserInfo(response.data.data)
                console.log(response.data.data)
            } catch (error) {
                console.error('Error making POST request:', error)
            }
        }
        postUserData()
    }, [])

    useEffect(() => {
        // 3초(3000ms) 후에 KidsPaint를 표시하도록 설정
        const timer = setTimeout(() => {
            setShowKidsPaint(true)
        }, 1000) // 3초 동안 지연

        // 메모리 누수 방지를 위해 타이머 정리
        return () => clearTimeout(timer)
    }, []) // 빈 종속성 배열이므로 마운트 시에만 실행

    const [selectedTab, setSelectedTab] = useState(0)
    const voiceLearningPercent = 75

    const handleTabClick = (index) => {
        setSelectedTab(index)
    }

    return (
        <div className="font-ourFont tracking-wider">
            <div className="mx-5 py-10 text-6xl">우리 가족</div>
            <div className="mx-7 flex h-[550px] justify-around rounded-lg bg-customLigntGreen p-10 text-3xl">
                <div className="mx-5 flex-grow pr-5">
                    <div className="mt-5 text-5xl">부모님</div>
                    {/* 부모님의 정보 */}
                    <div>
                        <div>아이디: {userInfo?.user.userLoginId}</div>
                        <div>이름: {userInfo?.user.userName}</div>
                        <div>성별: {userInfo?.user.userGender}</div>
                        <div>생년월일: {userInfo?.user.userBirth}</div>
                    </div>
                    <br />
                    <div>
                        <div className="text-4xl">
                            <span className="text-customOrange">목소리</span>{' '}
                            학습 중 :{' '}
                            <span className="text-customOrange">
                                {voiceLearningPercent}%
                            </span>
                        </div>
                        <div className="h-[80px] w-full rounded-lg border-4 border-customOrange bg-white">
                            <div
                                className="h-full rounded-l bg-customOrange"
                                style={{ width: `${voiceLearningPercent}%` }}
                            />
                        </div>
                    </div>
                </div>
                {/* 탭 영역 */}
                <div className="mx-5 my-5 flex-grow px-5">
                    {/* 탭 구현 */}
                    <div
                        role="tablist"
                        className="tabs tabs-lifted mr-4 flex justify-end"
                    >
                        {userInfo?.childList?.map((child, index) => (
                            <input
                                type="radio"
                                className={`tab mx-[3px] h-[50px] !w-[100px] !border-customBlueBorder ${
                                    selectedTab === index
                                        ? 'tab-active !bg-customBlue'
                                        : 'bg-white'
                                }`}
                                checked={selectedTab === index}
                                aria-label={child.childName}
                                onClick={() => handleTabClick(index)}
                                key={child.childId}
                            />
                        ))}
                        {/* 기타 탭 */}
                        <input
                            type="radio"
                            className={`tab h-[50px] !w-[100px] !border-customBlueBorder ${
                                selectedTab === userInfo?.childList?.length
                                    ? 'tab-active !bg-customBlue'
                                    : 'bg-white'
                            }`}
                            checked={
                                selectedTab === userInfo?.childList?.length
                            }
                            onClick={() =>
                                handleTabClick(userInfo?.childList?.length)
                            }
                        />
                    </div>

                    {/* 탭 컨텐츠 */}
                    <div
                        role="tabpanel"
                        className="h-[350px] rounded-box border-4 border-customBlueBorder bg-customBlue p-10"
                    >
                        {selectedTab < userInfo?.childList?.length ? (
                            <div>
                                <div className="text-5xl">아이</div>
                                <br />
                                <div>
                                    이름:{' '}
                                    {userInfo?.childList[selectedTab].childName}
                                </div>
                                <PencilSimpleLine size={32} />
                                <div>
                                    성별:{' '}
                                    {
                                        userInfo?.childList[selectedTab]
                                            .childGender
                                    }
                                </div>
                                <div>
                                    생년월일:{' '}
                                    {
                                        userInfo?.childList[selectedTab]
                                            .childBirth
                                    }
                                </div>
                            </div>
                        ) : (
                            <div>아이를 추가할거예요</div>
                        )}
                    </div>
                </div>
            </div>
            {showKidsPaint && <KidsPaint />} {/* 지연된 KidsPaint 표시 */}
        </div>
    )
}
