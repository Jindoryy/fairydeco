import React, { useState } from 'react'

export default function AddChildModal({ onClose, onSubmit }) {
    const [childName, setChildName] = useState('') // Track the child's name
    const [birthday, setBirthday] = useState('') // Track the child's birthday
    const [gender, setGender] = useState('male') // Default gender is male

    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    const URL = `${apiUrl}/child`

    const handleSubmit = async () => {
        // Retrieve userId from local storage
        const userId = localStorage.getItem('userId')

        // Construct the data to submit
        const newChild = {
            userId: parseInt(userId), // Convert to an integer
            childName,
            childBirth: birthday, // Change key name to "childBirth"
            childGender: gender === 'male' ? 'MAN' : 'WOMAN', // Convert gender to expected format
        }

        try {
            const response = await fetch(URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newChild), // Convert to JSON
            })

            if (response.ok) {
                console.log('Child added successfully')
                onSubmit(newChild) // Call onSubmit callback
            } else {
                console.error('Error adding child')
            }
        } catch (error) {
            console.error('An error occurred:', error)
        }

        onClose() // Close the modal after submission
    }

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
                className="rounded-lg border-4 border-[#FBF68D] bg-white py-8 pl-10 pr-16 pt-8 shadow-lg"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="mb-1 text-2xl">아이의 정보를 입력해주세요!</h2>
                <div className="mb-4 text-lg text-gray-300">
                    나이에 맞게 동화를 만들어 드릴게요
                </div>

                <div className="mb-4">
                    <label
                        htmlFor="childName"
                        className="block text-lg font-semibold"
                    >
                        아이 이름
                    </label>
                    <input
                        id="childName"
                        type="text"
                        value={childName}
                        onChange={(e) => setChildName(e.target.value)}
                        placeholder="아이의 이름을 입력해주세요" // Placeholder
                        className="w-full rounded-lg bg-customBlue p-2"
                    />
                </div>

                <div className="mb-4">
                    <label
                        htmlFor="birthday"
                        className="block text-lg font-semibold"
                    >
                        아이 생년월일
                    </label>
                    <input
                        id="birthday"
                        type="date"
                        value={birthday}
                        onChange={(e) => setBirthday(e.target.value)}
                        placeholder="YYYY-MM-DD" // Placeholder
                        className="w-full rounded-lg bg-customBlue p-2"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-lg font-semibold">
                        아이 성별
                    </label>
                    <div className="flex items-center gap-4">
                        <label>
                            <input
                                type="radio"
                                name="gender"
                                value="male"
                                checked={gender === 'male'}
                                onChange={() => setGender('male')}
                                className="mr-2"
                            />
                            남
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="gender"
                                value="female"
                                checked={gender === 'female'}
                                onChange={() => setGender('female')}
                                className="mr-2"
                            />
                            여
                        </label>
                    </div>
                </div>

                <div className="flex justify-center">
                    <button
                        onClick={handleSubmit} // Submit button
                        className="rounded-full bg-customBlueBorder px-6 py-3 text-black"
                    >
                        완료
                    </button>
                </div>
            </div>
        </div>
    )
}
