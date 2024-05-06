import './globals.css'
import Header from './components/header'
import { SseProvider } from './components/sseProvider'

export const metadata = {
    title: '동화꾸미기',
    description: '아이와 함께 AI로 동화를 꾸며보세요!',
    icons: {
        icon: '/image/babylogo.png',
    },
}

export default function RootLayout({ children }) {
    return (
        <html lang="ko">
            <body className="font-ourFont">
                <SseProvider>
                    <Header />
                    {children}
                </SseProvider>
            </body>
        </html>
    )
}
