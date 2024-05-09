import React from 'react'

export default function Modal({ onClose }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="rounded-lg bg-white p-6 shadow-lg">
                <h2 className="mb-4 text-2xl">This is a modal!</h2>
                <button onClick={onClose} className="text-red-500">
                    Close
                </button>
            </div>
        </div>
    )
}
