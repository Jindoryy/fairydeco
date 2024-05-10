'use client'
import { fabric } from 'fabric'
import { useEffect, useRef, useState } from 'react'
import { Circle, ArrowCircleLeft } from '@phosphor-icons/react/dist/ssr'
import { useRouter } from 'next/navigation'
import axios from 'axios'

export default function CanvasBox() {
    const router = useRouter()
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    const canvasContainerRef = useRef(null)
    const canvasRef = useRef(null)
    const [canvas, setCanvas] = useState(null)
    const [activeColor, setActiveColor] = useState('black')

    useEffect(() => {
        const canvasContainer = canvasContainerRef.current
        // 캔버스 생성
        const newCanvas = new fabric.Canvas(canvasRef.current, {
            width: '900px',
            height: '540px',
        })
        setCanvas(newCanvas)

        // 윈도우가 리사이즈가 되었을 때 실행
        const handleResize = () => {
            if (!canvasContainer) return
            const parentWidth = canvasContainer.offsetWidth
            const parentHeight = canvasContainer.offsetHeight
            newCanvas.setDimensions({
                width: '900px',
                height: '540px',
            })
        }
        window.addEventListener('resize', handleResize)

        // 처음 접속했을 때 캔버스에 그리기 가능하도록 설정
        newCanvas.freeDrawingBrush.width = 1
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
        canvas.freeDrawingBrush.width = 1
        canvas.freeDrawingBrush.color = `${color}`
        canvas.isDrawingMode = true
    }
    const goBack = () => {
        router.push('/makebook')
    }

    const makeBook = async () => {
        if (canvas.getObjects().length === 0) {
            alert('캔버스에 그림을 그려주세요.')
            return
        }

        try {
            // 캔버스를 이미지로 변환
            const imageData = canvas.toDataURL({ format: 'jpeg', quality: 0.8 })
            const bookFormData = new FormData()
            bookFormData.append('childId', localStorage.getItem('childId'))
            bookFormData.append('bookPicture', imageData)
            const { data } = await axios.post(`${apiUrl}/book`, bookFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            if (data.status == 'success') {
                alert(
                    '이야기를 만들기 시작했어요! 3분정도 기다려주세요. 다른 아이의 그림을 보러갈까요?'
                )
                router.push('/bookList')
            } else {
                alert('이야기 만들기가 실패했어요 다시 한 번 해주세요!')
            }
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }
    return (
        <div className="relative h-dvh w-dvw">
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
            <div className="relative m-auto flex h-5/6 w-3/4 items-center rounded-3xl border-none bg-customBlueBorder text-5xl font-thin shadow-innerShadow hover:bg-customBlueBorder">
                <div className="ml-4 mt-8 flex h-full w-5/6">
                    <div className="relative h-5/6 w-4/5">
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
                <div className="flex justify-center">
                    <button
                        className="btn btn-lg w-full border-none bg-customDarkYellow text-lg font-thin hover:bg-customDarkYellow"
                        onClick={makeBook}
                    >
                        동화 만들기!
                    </button>
                </div>
            </div>
        </div>
    )
}
