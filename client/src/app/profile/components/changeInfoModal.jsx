import React, { useEffect, useState } from 'react'

export default function ChangeInfoModal({
    onClose,
    childId,
    childName,
    childProfileUrl,
}) {
    const [selectedImageIndex, setSelectedImageIndex] = useState(null) // Track the index of the selected image
    const [currentChildName, setCurrentChildName] = useState(childName) // Track the updated name

    const handleOutsideClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose()
        }
    }

    const extractProfileName = (url) => {
        const fileName = url.split('/').pop() // Get the last part of the URL
        const profileName = fileName.split('.')[0] // Get the name before the extension
        return profileName
    }

    const profileName = extractProfileName(childProfileUrl) // Extract profile name from URL

    const imageUrls = [
        'rabbit',
        'cheetah',
        'sloth',
        'chicken',
        'shark',
        'turtle',
    ]

    useEffect(() => {
        // Pre-select the image if profileName matches an entry in imageUrls
        const initialIndex = imageUrls.indexOf(profileName)
        if (initialIndex !== -1) {
            setSelectedImageIndex(initialIndex)
        }
    }, [profileName]) // Runs once when the component is mounted

    const handleSelect = async () => {
        const selectedProfileName =
            selectedImageIndex !== null
                ? imageUrls[selectedImageIndex]
                : profileName // Default to extracted profile name if no selection

        const updatedData = {
            childId,
            childName: currentChildName,
            profileName: selectedProfileName,
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL
        const URL = `${apiUrl}/child`

        try {
            const response = await fetch(URL, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData),
            })

            if (response.ok) {
            } else {
                console.error('Error updating child info')
            }
        } catch (error) {
            console.error('An error occurred:', error)
        }

        onClose() // Close the modal
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            onClick={handleOutsideClick}
        >
            <div
                className="rounded-lg border-4 border-[#FBF68D] bg-white p-6 shadow-lg"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center gap-2">
                    <label
                        htmlFor="childName"
                        className="text-lg font-semibold"
                    >
                        이름 :
                    </label>
                    <input
                        id="childName"
                        type="text"
                        value={currentChildName} // Controlled input
                        onChange={(e) => setCurrentChildName(e.target.value)} // Track updates
                        className="w-28 rounded-lg bg-[#F8E6F9] p-2"
                    />
                </div>

                <div className="mt-4 grid grid-cols-3 justify-items-center gap-4">
                    {imageUrls.map((name, index) => (
                        <img
                            key={index}
                            src={`https://fairydeco.s3.ap-northeast-2.amazonaws.com/${name}.jpeg`}
                            alt={`Option ${index}`}
                            className={`h-24 w-24 cursor-pointer rounded-full object-cover ${
                                selectedImageIndex === index
                                    ? 'border-4 border-customOrange'
                                    : '' // Apply border if selected
                            }`}
                            onClick={() => setSelectedImageIndex(index)} // Update selected index
                        />
                    ))}
                </div>

                <div className="mt-4 flex justify-center">
                    <button
                        onClick={handleSelect} // Handle PUT request on button click
                        className="rounded-full bg-customBlueBorder px-6 py-3 text-black"
                    >
                        선택
                    </button>
                </div>
            </div>
        </div>
    )
}
