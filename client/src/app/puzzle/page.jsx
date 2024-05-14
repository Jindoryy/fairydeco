'use client'

import React, { useState, useEffect, useRef } from 'react'
import * as headbreaker from 'headbreaker'

function DemoJigsaw(props) {
    const puzzleRef = useRef(null)
    const [canvas, setCanvas] = useState(null)
    const [resetTrigger, setResetTrigger] = useState(0)

    useEffect(() => {
        const img = new Image()
        img.onload = () => {
            const newCanvas = new headbreaker.Canvas(puzzleRef.current.id, {
                width: props.width,
                height: props.height,
                pieceSize: props.pieceSize,
                proximity: props.pieceSize / 5,
                borderFill: props.pieceSize / 10,
                strokeWidth: 2,
                lineSoftness: 0.18,
                outline: new headbreaker.outline.Rounded(),
                image: img,
                painter: new headbreaker.painters.Konva(),
                fixed: true,
            })

            newCanvas.autogenerate({
                horizontalPiecesCount: 4,
                verticalPiecesCount: 4,
                insertsGenerator: headbreaker.generators.flipflop,
            })
            
            if (resetTrigger === 0) {
                newCanvas.shuffle(0.7)
            }
            
            newCanvas.draw()
            setCanvas(newCanvas)

            newCanvas.attachSolvedValidator()
            newCanvas.onValid(() => {
                setTimeout(() => {
                    alert('정답입니다.')
                }, 500)
            })


        }
        img.src = props.imageSrc

        return () => {
            if (canvas && typeof canvas.destroy === 'function') {
                canvas.destroy()
            }
        }
    }, [
        props.imageSrc,
        props.width,
        props.height,
        props.pieceSize,
        resetTrigger,
    ])

    const resetPuzzle = () => {
        setResetTrigger((prev) => prev + 1)
    }

    return (
        <>
            <button
                onClick={resetPuzzle}
                style={{ fontSize: '16px', padding: '10px 20px' }}
            >
                Reset Puzzle
            </button>
            <div style={{ textAlign: 'center', marginTop: '20px' }} className="bg-customPink">
                <div
                    ref={puzzleRef}
                    id={props.id}
                    style={{ marginBottom: '20px' }}
                ></div>
            </div>
        </>
    )
}

export default function Puzzle() {
    const [pieceSize, setPieceSize] = useState(100)
    const [width, setWidth] = useState(600)
    const [height, setHeight] = useState(600)

    return (
        <main>
            <DemoJigsaw
                id="puzzle"
                pieceSize={pieceSize}
                width={width}
                height={height}
                imageSrc="https://fairydecos3.s3.ap-northeast-2.amazonaws.com/storybook-images/198-title.png"
            />
        </main>
    )
}