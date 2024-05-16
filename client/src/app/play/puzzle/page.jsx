'use client'

import { useState } from 'react'
import PuzzleBox from './components/puzzleBox'
import Loading from '../../components/loading'

export default function PuzzlePage() {
    const [loading, setLoading] = useState(false)

    const handleLoading = (status) => {
        setLoading(status)
    }

    return(
        <div>
            {/* {loading ? 
                <Loading/> : 
                <PuzzleBox handleLoading={handleLoading} />
            } */}
            <PuzzleBox />
        </div>
    )
}