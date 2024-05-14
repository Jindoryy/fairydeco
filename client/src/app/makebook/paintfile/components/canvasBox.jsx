'use client'

import { fabric } from 'fabric'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import {
    Circle,
    ArrowCircleLeft,
    Trash,
    PencilLine,
    HandSwipeRight,
    Eraser,
} from '@phosphor-icons/react/dist/ssr'
import Swal from 'sweetalert2'

export default function CanvasBox({ handleLoading }) {
    const router = useRouter()
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    const canvasContainerRef = useRef(null)
    const canvasRef = useRef(null)
    const [canvas, setCanvas] = useState(null)
    const [activeTool, setActiveTool] = useState('pen')
    const [activeColor, setActiveColor] = useState('black')
    const Swal = require('sweetalert2')

    useEffect(() => {
        const canvasContainer = canvasContainerRef.current
        // 캔버스 생성
        const newCanvas = new fabric.Canvas(canvasRef.current, {
            width: canvasContainer.offsetWidth,
            height: canvasContainer.offsetHeight,
        })
        setCanvas(newCanvas)

        // 휠을 이용해서 줌인/줌아웃
        newCanvas.on('mouse:wheel', function (opt) {
            const delta = opt.e.deltaY
            let zoom = newCanvas.getZoom()
            zoom *= 0.999 ** delta
            if (zoom > 20) zoom = 20
            if (zoom < 0.01) zoom = 0.01
            newCanvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom)
            opt.e.preventDefault()
            opt.e.stopPropagation()
        })

        // 윈도우가 리사이즈가 되었을 때 실행
        const handleResize = () => {
            newCanvas.setDimensions({
                width: canvasContainer.offsetWidth,
                height: canvasContainer.offsetHeight,
            })
        }
        window.addEventListener('resize', handleResize)

        // 처음 접속했을 때 캔버스에 그리기 가능하도록 설정
        newCanvas.freeDrawingBrush.width = 5
        newCanvas.isDrawingMode = true

        // 언마운트 시 캔버스 정리, 이벤트 제거
        return () => {
            newCanvas.dispose()
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    useEffect(() => {
        if (!canvasContainerRef.current || !canvasRef.current || !canvas) return

        canvas.off('mouse:down')
        canvas.off('mouse:move')
        canvas.off('mouse:up')

        switch (activeTool) {
            case 'select':
                handleSelectTool()
                break

            case 'pen':
                handlePenTool()
                break

            case 'hand':
                handleHandTool()
                break
        }
    }, [activeTool])

    const handleSelectTool = () => {
        canvas.isDrawingMode = false
        canvas.selection = true
        canvas.defaultCursor = 'default'
    }
    const handlePenTool = () => {
        canvas.freeDrawingBrush.width = 5
        canvas.isDrawingMode = true
    }
    const handleHandTool = () => {
        canvas.isDrawingMode = false
        canvas.selection = false
        canvas.defaultCursor = 'move'

        let panning = false
        const handleMouseDown = () => {
            panning = true
        }
        const handleMouseMove = (event) => {
            if (panning) {
                const delta = new fabric.Point(
                    event.e.movementX,
                    event.e.movementY
                )
                canvas.relativePan(delta)
            }
        }
        const handleMouseUp = () => {
            panning = false
        }
        canvas.on('mouse:down', handleMouseDown)
        canvas.on('mouse:move', handleMouseMove)
        canvas.on('mouse:up', handleMouseUp)
    }

    useEffect(() => {
        handlePenColor(activeColor)
    }, [activeColor])

    const handlePenColor = (color) => {
        if (!canvas) return
        if (color == 'white') {
            canvas.freeDrawingBrush.width = 20
            canvas.freeDrawingBrush.color = `${color}`
            canvas.isDrawingMode = true
        } else {
            canvas.freeDrawingBrush.width = 5
            canvas.freeDrawingBrush.color = `${color}`
            canvas.isDrawingMode = true
        }
    }

    const goBook = () => {
        if (canvas.getObjects().length === 0) {
            Swal.fire({
                title: '앗!',
                text: '캔버스에 그림을 그려주세요.',
                icon: 'error',
                confirmButtonText: '네',
            })
            return
        }
        Swal.fire({
            title: '다 그렸군요!',
            text: '이 그림으로 동화를 만들까요?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '네! 만들어주세요!',
            cancelButtonText: '아니오 다시 그릴래요!',
        }).then((result) => {
            if (result.isConfirmed) {
                makeBook()
                Swal.fire({
                    title: '알겠어요!',
                    text: '동화를 만들어드릴게요!',
                    icon: 'success',
                })
            }
        })
    }
    const makeBook = async () => {
        try {
            handleLoading(true)
            canvas.setBackgroundColor('#ffffff', canvas.renderAll.bind(canvas))
            const imageData = canvas.toDataURL({ format: 'jpeg', quality: 0.8 })

            // Convert data URI to Blob
            function dataURItoBlob(dataURI) {
                const byteString = atob(dataURI.split(',')[1])
                const mimeString = dataURI
                    .split(',')[0]
                    .split(':')[1]
                    .split(';')[0]
                const ab = new ArrayBuffer(byteString.length)
                const ia = new Uint8Array(ab)
                for (let i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i)
                }
                return new Blob([ab], { type: mimeString })
            }

            // Convert Blob to File
            function blobToFile(theBlob, fileName) {
                return new File([theBlob], fileName, { type: theBlob.type })
            }

            // Convert canvas image data to File
            const blob = dataURItoBlob(imageData)
            const file = blobToFile(blob, 'canvas_image.jpg')
            console.log(file)

            const bookFormData = new FormData()
            bookFormData.append('childId', localStorage.getItem('childId'))
            bookFormData.append('bookPicture', file)
            const { data } = await axios.post(`${apiUrl}/book`, bookFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            if (data.status == 'success') {
                Swal.fire({
                    title: '동화책을 만들고 있어요',
                    text: '다 만들어지면 알려줄게요! 그동안 다른 동화책을 볼까요?',
                    icon: 'success',
                    confirmButtonText: '네',
                })
                router.push('/bookList')
            } else {
                Swal.fire({
                    title: '앗!',
                    text: '이야기 만들기가 실패했어요 다시 한 번 해주세요!',
                    icon: 'error',
                    confirmButtonText: '네',
                })
            }
        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            handleLoading(false)
        }
    }
    const goBack = () => {
        Swal.fire({
            title: '잠시만요!',
            text: '뒤로 가면 그림이 다 지워져요! 괜찮나요?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '네',
            cancelButtonText: '아니오',
        }).then((result) => {
            if (result.isConfirmed) {
                router.push('/makebook')
            }
        })
    }
    return (
        <div className="h-dvh w-dvw">
            <div>
                <div
                    className="canvas-container absolute inset-0"
                    ref={canvasContainerRef}
                >
                    <canvas ref={canvasRef} className="border-2" />
                </div>
                <div className="tool-bar absolute right-5 top-5 z-50 flex flex-col gap-3 rounded-lg border border-gray-100 bg-gray-100 p-3 shadow-md">
                    <button
                        onClick={() => setActiveColor('black')}
                        disabled={
                            setActiveColor === 'black' || activeTool != 'pen'
                        }
                        className={`btn btn-md rounded-lg p-2 ${activeColor === 'black' ? 'bg-customGreen text-white' : 'bg-gray-200 text-black'} ${activeTool !== 'pen' ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                        <Circle
                            size={30}
                            weight="fill"
                            className="text-black"
                        />
                    </button>
                    <button
                        onClick={() => setActiveColor('red')}
                        disabled={
                            setActiveColor === 'red' || activeTool != 'pen'
                        }
                        className={`btn btn-md rounded-lg p-2 ${activeColor === 'red' ? 'bg-customGreen text-white' : 'bg-gray-200 text-black'} ${activeTool !== 'pen' ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                        <Circle
                            size={30}
                            weight="fill"
                            className="text-customRed"
                        />
                    </button>
                    <button
                        onClick={() => setActiveColor('orange')}
                        disabled={
                            setActiveColor === 'orange' || activeTool != 'pen'
                        }
                        className={`btn btn-md rounded-lg p-2 ${activeColor === 'orange' ? 'bg-customGreen text-white' : 'bg-gray-200 text-black'} ${activeTool !== 'pen' ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                        <Circle
                            size={30}
                            weight="fill"
                            className="text-orange-500"
                        />
                    </button>
                    <button
                        onClick={() => setActiveColor('yellow')}
                        disabled={
                            setActiveColor === 'yellow' || activeTool != 'pen'
                        }
                        className={`btn btn-md rounded-lg p-2 ${activeColor === 'yellow' ? 'bg-customGreen text-white' : 'bg-gray-200 text-black'} ${activeTool !== 'pen' ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                        <Circle
                            size={30}
                            weight="fill"
                            className="text-yellow-300"
                        />
                    </button>
                    <button
                        onClick={() => setActiveColor('green')}
                        disabled={
                            setActiveColor === 'green' || activeTool != 'pen'
                        }
                        className={`btn btn-md rounded-lg p-2 ${activeColor === 'green' ? 'bg-customGreen text-white' : 'bg-gray-200 text-black'} ${activeTool !== 'pen' ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                        <Circle
                            size={30}
                            weight="fill"
                            className="text-green-600"
                        />
                    </button>
                    <button
                        onClick={() => setActiveColor('blue')}
                        disabled={
                            setActiveColor === 'blue' || activeTool != 'pen'
                        }
                        className={`btn btn-md rounded-lg p-2 ${activeColor === 'blue' ? 'bg-customGreen text-white' : 'bg-gray-200 text-black'} ${activeTool !== 'pen' ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                        <Circle
                            size={30}
                            weight="fill"
                            className="text-blue-700"
                        />
                    </button>
                    <button
                        onClick={() => setActiveColor('indigo')}
                        disabled={
                            setActiveColor === 'indigo' || activeTool != 'pen'
                        }
                        className={`btn btn-md rounded-lg p-2 ${activeColor === 'indigo' ? 'bg-customGreen text-white' : 'bg-gray-200 text-black'} ${activeTool !== 'pen' ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                        <Circle
                            size={30}
                            weight="fill"
                            className="text-indigo-900"
                        />
                    </button>
                    <button
                        onClick={() => setActiveColor('purple')}
                        disabled={
                            setActiveColor === 'purple' || activeTool != 'pen'
                        }
                        className={`btn btn-md rounded-lg p-2 ${activeColor === 'purple' ? 'bg-customGreen text-white' : 'bg-gray-200 text-black'} ${activeTool !== 'pen' ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                        <Circle
                            size={30}
                            weight="fill"
                            className="text-fuchsia-800"
                        />
                    </button>
                    <button
                        onClick={() => setActiveColor('brown')}
                        disabled={
                            setActiveColor === 'brown' || activeTool != 'pen'
                        }
                        className={`btn btn-md rounded-lg p-2 ${activeColor === 'brown' ? 'bg-customGreen text-white' : 'bg-gray-200 text-black'} ${activeTool !== 'pen' ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                        <Circle
                            size={30}
                            weight="fill"
                            className="text-amber-900"
                        />
                    </button>
                    <button
                        onClick={() => setActiveColor('white')}
                        disabled={
                            setActiveColor === 'white' || activeTool != 'pen'
                        }
                        className={`btn btn-md rounded-lg p-2 ${activeColor === 'white' ? 'bg-customGreen text-white' : 'bg-gray-200 text-black'} ${activeTool !== 'pen' ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                        <Eraser size={23} />
                    </button>
                    <button onClick={() => canvas.clear()} className="btn">
                        <Trash size={23} />
                    </button>
                </div>
            </div>
            <div className="absolute bottom-0 flex w-full">
                <button
                    className="btn w-full rounded-none border-none bg-customDarkYellow text-xl hover:bg-customDarkYellow"
                    onClick={goBook}
                >
                    동화 만들기
                </button>
            </div>
            <button
                className="btn btn-ghost absolute left-0 h-auto w-1/12 pt-4 align-middle text-lg font-thin text-white hover:bg-transparent focus:bg-transparent"
                onClick={goBack}
            >
                <ArrowCircleLeft
                    size={80}
                    weight="fill"
                    className="text-customDarkYellow"
                />
            </button>
        </div>
    )
}
