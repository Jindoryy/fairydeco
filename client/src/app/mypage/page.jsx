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
        <div>
            <Header></Header>
            <div className="py-5 text-5xl">우리 가족</div>
            <div className="mx-3 flex justify-around rounded-lg bg-green-100 py-5 text-3xl">
                <div className="flex-grow px-5">
                    <div>부모님</div>
                    {/* 부모님의 아이디와 학습 진행도를 표시 */}
                    <div>
                        <div>아이디 : {userInfo.user.userLoginId}</div>
                        <div>이름 : {userInfo.user.userName}</div>
                        <div>성별 : {userInfo.user.userGender}</div>
                        <div>생년월일 : {userInfo.user.userBirth}</div>
                    </div>
                    <div>목소리 학습 중 : {voiceLearningPercent}%</div>
                    {/* 게이지바 구현 */}
                    <div className="h-10 w-full rounded-lg border-4 border-solid border-orange-300 bg-white">
                        <div
                            className="h-full rounded-l bg-orange-300"
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
                                className={`tab ${selectedTab === index ? 'tab-active' : ''}`}
                                onClick={() => handleTabClick(index)}
                                key={child.childId}
                            >
                                {child.childName}
                            </a>
                        ))}
                        {/* 항상 추가되는 "기타" 탭 */}
                        <a
                            role="tab"
                            className={`tab ${selectedTab === userInfo.childResponseList.length ? 'tab-active' : ''}`}
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
                    <div className="rounded-lg bg-blue-100 py-5 text-3xl">
                        <div>아이 정보</div>
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
