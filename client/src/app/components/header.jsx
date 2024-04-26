import Image from 'next/image'

export default function Header() {
    return (
        <div className="bg-customYellow h-20% flex items-center justify-between px-4">
            <Image src="/image/logo.png" alt="Logo" width={100} height={100} />
            <div>버튼</div>
        </div>
    )
}
