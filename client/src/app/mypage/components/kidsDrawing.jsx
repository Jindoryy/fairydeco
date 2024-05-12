'use client'

import Link from 'next/link'

export default function KidsDrawing({
    onClose,
    bookId,
    bookName,
    bookPictureUrl,
}) {
    const handleOutsideClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose() // Close the modal if clicking outside
        }
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            onClick={handleOutsideClick}
        >
            <div
                className="shadow-l w-3/5 items-center justify-center rounded-lg border-4 border-[#FBF68D] bg-white py-8 pl-10 pr-16 pt-8"
                onClick={(e) => e.stopPropagation()}
            >
                {' '}
                <div className="flex justify-center">
                    <div className="my-3 text-3xl">제목 : {bookName}</div>
                </div>
                <div className="flex justify-center">
                    <img src={bookPictureUrl} className="mb-3 w-4/5"></img>
                </div>
                <Link href={`/book/${bookId}`} className="flex justify-center">
                    <div className="rounded-full bg-customBlueBorder px-6 py-3 text-black">
                        동화보러가기
                    </div>
                </Link>
            </div>
        </div>
    )
}
