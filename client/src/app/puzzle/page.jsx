'use client'

import React, { useState, useEffect, useRef } from 'react'
import * as headbreaker from 'headbreaker'

function DemoJigsaw(props) {
    const puzzleRef = useRef(null)
    const [canvas, setCanvas] = useState(null)
    const [resetTrigger, setResetTrigger] = useState(0)
    const [shuffleTrigger, setShuffleTrigger] = useState(0)

    useEffect(() => {
        const img = new Image()
        img.onload = () => {
            const newCanvas = new headbreaker.Canvas(puzzleRef.current.id, {
                width: props.width,
                height: props.height,
                pieceSize: props.pieceSize,
                // proximity: props.pieceSize / 5,
                // borderFill: props.pieceSize / 10,
                strokeWidth: 2,
                // strokeColor: 'white',
                lineSoftness: 0.18,
                outline: new headbreaker.outline.Rounded(),
                image: img,
                painter: new headbreaker.painters.Konva(),
                fixed: true,
            })

            newCanvas.adjustImagesToPuzzleWidth();
            newCanvas.autogenerate({
                horizontalPiecesCount: 3,
                verticalPiecesCount: 3,
                insertsGenerator: headbreaker.generators.flipflop,
                // insertsGenerator: headbreaker.generators.random,
            })
            
            if (resetTrigger === 0) {
                newCanvas.shuffle(0.5)
                // newCanvas.puzzle.pieces[1].translate(50, -50);
            }
            
            newCanvas.draw()
            setCanvas(newCanvas)

            newCanvas.attachSolvedValidator()
            newCanvas.onValid(() => {
                setTimeout(() => {
                    if (confirm('정답입니다! 다음 퍼즐도 풀어볼까요?')) {
                        alert('다음으로')
                    } else {
                        alert('안할래')
                    }
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

    useEffect(() => {
        if (shuffleTrigger > 0 && canvas) {
            canvas.shuffle(0.5)
            canvas.redraw()
        }
    }, [shuffleTrigger, canvas])

    const resetPuzzle = () => {
        setShuffleTrigger(0)
        setResetTrigger((prev) => prev + 1)
    }

    const shufflePuzzle = () => {
        setShuffleTrigger((prev) => prev + 1)
    }

    return (
        <>
            <button
                onClick={resetPuzzle}
                style={{ fontSize: '16px', padding: '10px 20px' }}
            >
                정답
            </button>
            <button
                onClick={shufflePuzzle}
                style={{ fontSize: '16px', padding: '10px 20px' }}
            >
                섞기
            </button>
            <div style={{ textAlign: 'center', margin: '20px 60px 0px' }}>
                <div
                    ref={puzzleRef}
                    id={props.id}
                    style={{ marginBottom: '20px', position: 'absolute', border: '2px solid black' }}
                >
                </div>
                <img 
                    src="https://fairydecos3.s3.ap-northeast-2.amazonaws.com/storybook-images/198-title.png"
                    style={{ float: 'right', opacity: '0.5', position: 'relative', zIndex: '-1', margin: '45px' }}
                /> 
            </div>
        </>
    )
}

export default function Puzzle() {
    const [pieceSize, setPieceSize] = useState(170)
    const [width, setWidth] = useState(1300)
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