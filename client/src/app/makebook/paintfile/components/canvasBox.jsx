'use client'
import { fabric } from 'fabric'
import { useEffect, useRef, useState } from 'react'
import { Circle } from '@phosphor-icons/react/dist/ssr'

export default function CanvasBox() {
    const canvasContainerRef = useRef(null)
    const canvasRef = useRef(null)
    const [canvas, setCanvas] = useState(null)
    const [activeColor, setActiveColor] = useState('black')

    useEffect(() => {
        const canvasContainer = canvasContainerRef.current
        // 캔버스 생성
        const newCanvas = new fabric.Canvas(canvasRef.current, {
            width: '900px',
            height: '470px',
        })
        setCanvas(newCanvas)

        // 윈도우가 리사이즈가 되었을 때 실행
        const handleResize = () => {
            newCanvas.setDimensions({
                width: '900px',
                height: '470px',
            })
        }
        window.addEventListener('resize', handleResize)

        // 처음 접속했을 때 캔버스에 그리기 가능하도록 설정
        newCanvas.freeDrawingBrush.width = 3
        newCanvas.isDrawingMode = true

        // 언마운트 시 캔버스 정리, 이벤트 제거
        return () => {
            newCanvas.dispose()
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    useEffect(() => {
        handlePenColor(activeColor)
    }, [activeColor])

    const handlePenColor = (color) => {
        if (!canvas) return
        canvas.freeDrawingBrush.width = 3
        canvas.freeDrawingBrush.color = `${color}`
        canvas.isDrawingMode = true
    }

    return (
        <div className="shadow-innerShadow relative top-16 m-auto flex h-[500px] w-3/4 flex-col items-center justify-center rounded-3xl border-none bg-customBlueBorder text-5xl font-thin hover:bg-customBlueBorder">
            <div className="ml-10 mt-4 flex h-full w-full">
                <div className="relative h-4/5 w-4/5">
                    <canvas
                        ref={canvasRef}
                        className="rounded-xl border bg-white"
                    />
                    <div className="tool-bar absolute left-5 top-5 flex flex-col rounded bg-gray-200 p-1 shadow-md">
                        <button
                            onClick={() => setActiveColor('red')}
                            disabled={setActiveColor === 'red'}
                            className="btn btn-xs"
                        >
                            <Circle
                                size={20}
                                weight="fill"
                                className="text-customRed"
                            />
                        </button>
                        <button
                            onClick={() => setActiveColor('green')}
                            disabled={setActiveColor === 'green'}
                            className="btn btn-xs"
                        >
                            <Circle
                                size={20}
                                weight="fill"
                                className="text-green-600"
                            />
                        </button>
                        <button
                            onClick={() => setActiveColor('blue')}
                            disabled={setActiveColor === 'blue'}
                            className="btn btn-xs"
                        >
                            <Circle
                                size={20}
                                weight="fill"
                                className="text-blue-700"
                            />
                        </button>
                        <button
                            onClick={() => setActiveColor('black')}
                            disabled={setActiveColor === 'black'}
                            className="btn btn-xs"
                        >
                            <Circle
                                size={20}
                                weight="fill"
                                className="text-black"
                            />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
