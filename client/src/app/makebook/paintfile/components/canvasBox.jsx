'use client'
import { fabric } from 'fabric'
import { useEffect, useRef, useState } from 'react'
import { ArrowCircleLeft, Circle } from '@phosphor-icons/react/dist/ssr'
import { useRouter } from 'next/navigation'

export default function CanvasBox() {
    const router = useRouter()
    const canvasContainerRef = useRef(null)
    const canvasRef = useRef(null)
    const [canvas, setCanvas] = useState(null)
    const [activeColor, setActiveColor] = useState('black')
    const [parentWidth, setParentWidth] = useState(null)
    const [parentHeight, setParentHeight] = useState(null)

    useEffect(() => {
        const canvasContainer = canvasContainerRef.current
        if (!canvasContainer) return
        const parentWidth = canvasContainer.offsetWidth
        const parentHeight = canvasContainer.offsetHeight

        // 캔버스 생성
        const newCanvas = new fabric.Canvas(canvasRef.current, {
            width: parentWidth,
            height: parentHeight,
        })
        setCanvas(newCanvas)

        // 윈도우가 리사이즈가 되었을 때 실행
        const handleResize = () => {
            const newParentWidth = canvasContainer.offsetWidth
            const newParentHeight = canvasContainer.offsetHeight
            newCanvas.setDimensions({
                width: newParentWidth,
                height: newParentHeight,
            })
            setParentWidth(newParentWidth)
            setParentHeight(newParentHeight)
        }
        window.addEventListener('resize', handleResize)

        // 처음 접속했을 때 캔버스에 그리기 가능하도록 설정
        newCanvas.freeDrawingBrush.width = 1
        newCanvas.isDrawingMode = true

        // 초기 부모 요소의 크기 설정
        setParentWidth(parentWidth)
        setParentHeight(parentHeight)

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
        canvas.freeDrawingBrush.width = 1
        canvas.freeDrawingBrush.color = `${color}`
        canvas.isDrawingMode = true
    }

    const goBack = () => {
        router.push('/makebook')
    }

    return (
        <>
            <button
                className="btn btn-ghost relative ml-2 h-auto w-1/12 pt-2 align-middle text-lg font-thin text-white hover:bg-transparent focus:bg-transparent"
                onClick={goBack}
            >
                <ArrowCircleLeft
                    size={80}
                    weight="fill"
                    className="text-white"
                />
            </button>
            <div
                ref={canvasContainerRef}
                className="relative top-16 m-auto flex h-[500px] w-3/4 flex-col items-center justify-center rounded-3xl border-none bg-customBlueBorder text-5xl font-thin shadow-innerShadow hover:bg-customBlueBorder"
            >
                <div className="ml-10 mt-4 flex h-full w-full">
                    <div className="relative h-4/5 w-4/5">
                        <canvas
                            ref={canvasRef}
                            className="rounded-xl border bg-white"
                        />
                        <div className="tool-bar absolute left-5 top-5 flex flex-col rounded bg-gray-200 p-1 shadow-md">
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
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
