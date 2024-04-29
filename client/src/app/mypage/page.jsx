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
                childBirth: '2000-01-01',
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
                childBirth: '2000-01-01',
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

    return (
        <div>
            <Header></Header>
            <div className="py-5 text-8xl">우리 가족</div>
            <div className="flex justify-between py-5 text-5xl">
                <div className="px-5">
                    <div>부모님</div>
                    {/* 부모님의 아이디와 학습 진행도를 표시 */}
                    <div>
                        <div>아이디: {userInfo.user.userLoginId}</div>
                        <div>이름: {userInfo.user.userName}</div>
                        <div>성별: {userInfo.user.userGender}</div>
                        <div>생년월일: {userInfo.user.userBirth}</div>
                    </div>
                    <div>목소리 학습 중: 75%</div>
                </div>
                <div className="px-5">아이</div>
            </div>
        </div>
    )
}
