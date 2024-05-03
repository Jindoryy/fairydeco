'use client'

import { useState, useEffect } from 'react'
import KidsPaint from './components/kidspaint'
import axios from 'axios'
import { PencilSimpleLine } from '@phosphor-icons/react/dist/ssr'

export default function Mypage() {
    const [userInfo, setUserInfo] = useState(null)

    const URL = `http://k10a402.p.ssafy.io:8081/user/mypage`

    useEffect(() => {
        const postUserData = async () => {
            try {
                const response = await axios.post(URL, { userId: 1 }) // POST 요청을 보내고 데이터로 객체를 전달합니다.

                setUserInfo(response.data.data) // 응답 데이터를 상태에 저장합니다.
                console.log(response.data.data)
            } catch (error) {
                console.error('Error making POST request:', error) // 오류 처리
            }
        }
        postUserData() // 컴포넌트가 마운트될 때 POST 요청을 수행합니다.
    }, [])
    // 탭 상태
    const [selectedTab, setSelectedTab] = useState(0) // 탭 0은 첫 번째 아이를 가리킴

    // 목소리 학습 중 퍼센트
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
                    <br />
                    {/* 부모님의 아이디와 학습 진행도를 표시 */}
                    <div>
                        <div>아이디 : {userInfo?.user.userLoginId}</div>
                        <div>이름 : {userInfo?.user.userName}</div>
                        <div>성별 : {userInfo?.user.userGender}</div>
                        <div>생년월일 : {userInfo?.user.userBirth}</div>
                    </div>
                    <br />
                    <div className="mr-12">
                        <div className=" text-4xl">
                            <span className="text-customOrange">목소리</span>{' '}
                            학습 중 :{' '}
                            <span className="text-customOrange">
                                {voiceLearningPercent}%
                            </span>
                        </div>
                        {/* 게이지바 구현 */}
                        <div className="h-[80px] w-full rounded-lg border-4 border-solid border-customOrange bg-white">
                            <div
                                className="h-full rounded-l bg-customOrange"
                                style={{ width: `${voiceLearningPercent}%` }} // 퍼센트에 따라 너비 조정
                            ></div>
                        </div>
                    </div>
                </div>
                {/* 탭 영역 */}
                <div className="mx-5 my-5 flex-grow px-5">
                    <div
                        role="tablist"
                        className="tabs tabs-lifted mr-4 flex justify-end "
                    >
                        {userInfo?.childList?.map((child, index) => (
                            <input
                                type="radio"
                                className={`tab mx-[3px] h-[50px] !w-[100px] !border-x-[3px] !border-t-[3px] !border-customBlueBorder text-lg ${
                                    selectedTab === index
                                        ? 'tab-active  !bg-customBlue'
                                        : 'bg-white'
                                }`}
                                checked={selectedTab === index}
                                aria-label={child.childName}
                                onClick={() => handleTabClick(index)}
                                key={child.childId}
                            />
                        ))}
                        {/* 항상 추가되는 "기타" 탭 */}
                        <input
                            type="radio"
                            className={`tab h-[50px] !w-[100px] !border-x-[3px] !border-t-[3px] !border-customBlueBorder ${
                                selectedTab === userInfo?.childList?.length
                                    ? 'tab-active !bg-customBlue'
                                    : 'bg-white'
                            }`}
                            checked={
                                selectedTab === userInfo?.childList?.length
                            }
                            aria-label="+"
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
            <KidsPaint />
        </div>
    )
}
