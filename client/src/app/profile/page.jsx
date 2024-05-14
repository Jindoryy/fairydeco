'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { PlusCircle, PencilSimpleLine } from '@phosphor-icons/react'
import ChangeInfoModal from './components/changeInfoModal'
import AddChildModal from './components/addChildModal'
import Swal from 'sweetalert2'

export default function Profile() {
    const [kidsData, setKidsData] = useState(null)
    const [isChangeInfoModalOpen, setIsChangeInfoModalOpen] = useState(false)
    const [isAddChildModalOpen, setIsAddChildModalOpen] = useState(false)
    const [selectedChild, setSelectedChild] = useState(null) // Track the selected child
    const Swal = require('sweetalert2')

    const router = useRouter()

    useEffect(() => {
        const userId = localStorage.getItem('userId')

        if (!userId) {
            Swal.fire({
                title: '앗!',
                text: '먼저 로그인을 해주세요!',
                icon: 'error',
                confirmButtonText: '네',
            })
            router.push('/login')
            return
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
    const handleAddChild = (newChild) => {
        // 새로운 아이 정보를 기존 데이터에 추가하거나 업데이트하는 로직
        const updatedKidsData = [...kidsData.data, newChild]
        setKidsData({ ...kidsData, data: updatedKidsData })
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
                    {kidsData &&
                    kidsData.data &&
                    kidsData.data.length >= 6 ? null : ( // 만약 kidsData가 존재하고 데이터가 6개인 경우 // PlusCircle을 렌더링하지 않음
                        // 그 외의 경우
                        <div
                            className="flex h-[200px] cursor-pointer flex-col items-center justify-center"
                            onClick={openAddChildModal} // AddChildModal 열기
                        >
                            <PlusCircle size={150} />
                        </div>
                    )}
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
                <AddChildModal
                    onClose={closeAddChildModal}
                    onSubmit={handleAddChild}
                />
            )}
        </div>
    )
}
