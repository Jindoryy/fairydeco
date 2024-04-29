'use client'

import { useState } from 'react'
import Link from 'next/link'
import Header from '../components/header'

export default function Mypage() {
    // 부모님의 정보를 담을 상태를 생성합니다.
    const [userInfo, setUserInfo] = useState({
        user: {
            userLoginId: 'kimmommy',
            userName: '김엄마',
            userGender: 'WOMAN',
            userBirth: '1988-09-18',
        },
        childResponseList: [
            {
                childId: 1,
                childName: '김아들',
                childBirth: '2008-08-08',
                childGender: 'MAN',
                bookList: [
                    {
                        bookId: 1,
                        bookName: '건희의 모험',
                        bookMaker: '김아들',
                        bookPictureUrl: '',
                        bookCoverUrl: '',
                        bookCreatedAt: '',
                        bookComplete: 'STORY',
                    },
                    {
                        bookId: 2,
                        bookName: '건희의 모험2',
                        bookMaker: '김아들',
                        bookPictureUrl: null,
                        bookCoverUrl: '',
                        bookCreatedAt: '',
                        bookComplete: 'STORY',
                    },
                ],
            },
            {
                childId: 2,
                childName: '김딸',
                childBirth: '2010-10-10',
                childGender: 'WOMAN',
                bookList: [
                    {
                        bookId: 1,
                        bookName: '건희의 모험',
                        bookMaker: '김딸',
                        bookPictureUrl: '',
                        bookCoverUrl: '',
                        bookCreatedAt: '',
                        bookComplete: 'STORY',
                    },
                    {
                        bookId: 2,
                        bookName: '건희의 모험2',
                        bookMaker: '김딸',
                        bookPictureUrl: null,
                        bookCoverUrl: '',
                        bookCreatedAt: '',
                        bookComplete: 'STORY',
                    },
                ],
            },
        ],
    })

    // 탭 상태
    const [selectedTab, setSelectedTab] = useState(0) // 탭 0은 첫 번째 아이를 가리킴

    // 목소리 학습 중 퍼센트
    const voiceLearningPercent = 75
    const handleTabClick = (index) => {
        setSelectedTab(index)
    }

    return (
        <div className="font-ourFont">
            <Header></Header>
            <div className="mx-5 py-5 text-5xl">우리 가족</div>
            <div className="bg-customLigntGreen mx-7 flex h-1/3 justify-around rounded-lg px-5 py-5 text-3xl">
                <div className="flex-grow px-5">
                    <div className="text-4xl">부모님</div>
                    {/* 부모님의 아이디와 학습 진행도를 표시 */}
                    <div>
                        <div>아이디 : {userInfo.user.userLoginId}</div>
                        <div>이름 : {userInfo.user.userName}</div>
                        <div>성별 : {userInfo.user.userGender}</div>
                        <div>생년월일 : {userInfo.user.userBirth}</div>
                    </div>
                    <div>
                        <span className="text-customOrange">목소리</span> 학습
                        중 :{' '}
                        <span className="text-customOrange">
                            {voiceLearningPercent}%
                        </span>
                    </div>
                    {/* 게이지바 구현 */}
                    <div className="border-customOrange h-10 w-full rounded-lg border-4 border-solid bg-white">
                        <div
                            className="bg-customOrange h-full rounded-l"
                            style={{ width: `${voiceLearningPercent}%` }} // 퍼센트에 따라 너비 조정
                        ></div>
                    </div>
                </div>
                {/* 탭 영역을 오른쪽 정렬 */}
                <div className="flex-grow px-5">
                    {/* 탭 목록 */}
                    <div
                        role="tablist"
                        className="tabs tabs-lifted flex justify-end"
                    >
                        {userInfo.childResponseList.map((child, index) => (
                            <a
                                role="tab"
                                className={`tab ${
                                    selectedTab === index
                                        ? 'bg-customBlue border-customBlueBorder border-4 border-solid'
                                        : 'border-customBlueBorder border-4 border-solid bg-white'
                                }`}
                                onClick={() => handleTabClick(index)}
                                key={child.childId}
                            >
                                {child.childName}
                            </a>
                        ))}
                        {/* 항상 추가되는 "기타" 탭 */}
                        <a
                            role="tab"
                            className={`tab ${
                                selectedTab ===
                                userInfo.childResponseList.length
                                    ? 'bg-customBlue border-customBlueBorder border-4 border-solid'
                                    : 'border-customBlueBorder border-4 border-solid bg-white'
                            }`}
                            onClick={() =>
                                handleTabClick(
                                    userInfo.childResponseList.length
                                )
                            }
                        >
                            +
                        </a>
                    </div>

                    {/* 선택된 탭의 아이 정보 */}
                    <div className="bg-customBlue border-customBlueBorder rounded-lg border-2 border-solid px-3 py-5 text-3xl">
                        <div className="text-4xl">아이</div>
                        <div>
                            이름 :{' '}
                            {userInfo.childResponseList[selectedTab].childName}
                        </div>
                        <div>
                            성별 :{' '}
                            {
                                userInfo.childResponseList[selectedTab]
                                    .childGender
                            }
                        </div>
                        <div>
                            생년월일 :{' '}
                            {userInfo.childResponseList[selectedTab].childBirth}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
