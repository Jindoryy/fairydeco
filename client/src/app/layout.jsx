import './globals.css'
import Header from './components/header'
import Image from 'next/image'
import babyIcon from '../../public/image/babylogo.png'

export const metadata = {
    title: '동화꾸미기',
    description: '아이와 함께 AI로 동화를 꾸며보세요!',
    icons: {
        icon: babyIcon,
    },
}

export default function RootLayout({ children }) {
    return (
        <html lang="ko">
            <body className="font-ourFont">
                <Header />
                {children}
            </body>
        </html>
    )
}
