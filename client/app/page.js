import Link from 'next/link'

export default function Home() {
    return (
        <>
            <h1>홈페이지 입니다</h1>
            <Link href="/landing">랜딩페이지가기</Link>
        </>
    )
}
