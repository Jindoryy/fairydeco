'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { PlusCircle, PencilSimpleLine } from '@phosphor-icons/react'
import Modal from './components/Modal' // Import the modal component

export default function Profile() {
    const [kidsData, setKidsData] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const router = useRouter()

    const userId = 2

    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    const URL = `${apiUrl}/child/name-list/${userId}`

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(URL)
                const jsonData = await response.json()
                setKidsData(jsonData)
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }

        fetchData()
    }, [])

    const handleChildClick = (childId) => {
        localStorage.setItem('childId', childId)
        router.push('/')
    }

    const openModal = () => setIsModalOpen(true) // Open the modal
    const closeModal = () => setIsModalOpen(false)

    return (
        <div className="flex h-dvh w-dvw flex-col items-center justify-center bg-customDarkYellow p-4">
            <div className="mb-8 flex justify-center text-5xl">
                동화를 그릴 사람은 누구인가요?
            </div>

            {kidsData ? (
                <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                    {kidsData.data.map((child) => (
                        <div
                            key={child.childId}
                            className="flex flex-col items-center justify-center p-2"
                        >
                            {' '}
                            <img
                                src={child.childProfileUrl}
                                alt={`${child.childName} profile`}
                                className={`h-[200px] w-[200px] transform cursor-pointer rounded-full object-cover transition-transform hover:scale-110 hover:border-4 hover:border-customOrange`}
                                onClick={() => handleChildClick(child.childId)} // Handle click
                            />
                            <div className="mt-4 flex items-center justify-center gap-2 text-center">
                                {' '}
                                <span className="text-3xl font-semibold">
                                    {child.childName}
                                </span>{' '}
                                <PencilSimpleLine size={32} />{' '}
                            </div>
                        </div>
                    ))}
                    <div className="flex h-[200px] flex-col items-center justify-center">
                        <PlusCircle size={150} />
                    </div>
                </div>
            ) : (
                <div>Loading...</div>
            )}
            <div>
                <Link href="#" onClick={openModal}>
                    모달모달
                </Link>{' '}
                {/* Open modal on click */}
            </div>
            {isModalOpen && <Modal onClose={closeModal} />}
        </div>
    )
}
