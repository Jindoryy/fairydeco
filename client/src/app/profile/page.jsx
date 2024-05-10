'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { PlusCircle, PencilSimpleLine } from '@phosphor-icons/react'
import ChangeInfoModal from './components/changeInfoModal'
import AddChildModal from './components/addChildModal'

export default function Profile() {
    const [kidsData, setKidsData] = useState(null)
    const [isChangeInfoModalOpen, setIsChangeInfoModalOpen] = useState(false)
    const [isAddChildModalOpen, setIsAddChildModalOpen] = useState(false)
    const [selectedChild, setSelectedChild] = useState(null) // Track the selected child

    const router = useRouter()

    useEffect(() => {
        const userId = localStorage.getItem('userId')

        if (!userId) {
            router.push('/login') // Redirect to login if userId doesn't exist
            return // Exit the effect early if no userId
        }
        const apiUrl = process.env.NEXT_PUBLIC_API_URL
        const URL = `${apiUrl}/child/name-list/${userId}`

        const fetchData = async () => {
            try {
                const response = await fetch(URL)
                const jsonData = await response.json()
                setKidsData(jsonData)
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }

        fetchData() // Fetch data when the component is mounted
    }, [])

    const openChangeInfoModal = (child) => {
        setSelectedChild(child) // Store the selected child
        setIsChangeInfoModalOpen(true) // Open ChangeInfoModal
    }

    const closeChangeInfoModal = () => {
        setSelectedChild(null) // Reset the selected child
        setIsChangeInfoModalOpen(false) // Close ChangeInfoModal
    }

    const openAddChildModal = () => setIsAddChildModalOpen(true) // Open AddChildModal
    const closeAddChildModal = () => setIsAddChildModalOpen(false) // Close AddChildModal

    const handleImageClick = (childId) => {
        localStorage.setItem('childId', childId) // Store the childId
        router.push('/') // Navigate to the home page
    }

    return (
        <div className="flex h-dvh w-dvw flex-col items-center justify-center bg-customDarkYellow p-4">
            <div className="mb-8 flex justify-center text-5xl">
                동화를 그릴 사람은 누구인가요?
            </div>

            {kidsData && kidsData.data && kidsData.data.length > 0 ? (
                <div className="mt-8 grid grid-cols-3 justify-items-center gap-4">
                    {kidsData.data.map((child) => (
                        <div
                            key={child.childId}
                            className="flex flex-col items-center justify-center p-2"
                        >
                            <img
                                src={child.childProfileUrl}
                                alt={`${child.childName} profile`}
                                className="h-[200px] w-[200px] transform cursor-pointer rounded-full object-cover transition-transform hover:scale-110 hover:border-4 hover:border-customOrange"
                                onClick={() => handleImageClick(child.childId)} // Open modal
                            />
                            <div className="mt-4 flex items-center justify-center gap-2 text-center">
                                <span className="text-3xl font-semibold">
                                    {child.childName}
                                </span>
                                <PencilSimpleLine
                                    size={32}
                                    className="cursor-pointer"
                                    onClick={() => openChangeInfoModal(child)} // Open modal
                                />
                            </div>
                        </div>
                    ))}
                    <div
                        className="flex h-[200px] cursor-pointer flex-col items-center justify-center"
                        onClick={openAddChildModal} // Open AddChildModal on click
                    >
                        <PlusCircle size={150} />
                    </div>
                </div>
            ) : (
                <div
                    className="flex h-[200px] cursor-pointer flex-col items-center justify-center"
                    onClick={openAddChildModal} // Open AddChildModal on click
                >
                    <PlusCircle size={150} />
                </div>
            )}

            {isChangeInfoModalOpen && selectedChild && (
                <ChangeInfoModal
                    onClose={closeChangeInfoModal}
                    childId={selectedChild.childId}
                    childName={selectedChild.childName}
                    childProfileUrl={selectedChild.childProfileUrl} // Send the profile URL
                />
            )}

            {isAddChildModalOpen && (
                <AddChildModal onClose={closeAddChildModal} />
            )}
        </div>
    )
}
