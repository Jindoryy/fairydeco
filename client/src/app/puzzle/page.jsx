'use client'

import React, { useState, useEffect, useRef } from 'react'
import * as headbreaker from 'headbreaker'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import Swal from 'sweetalert2'
import NewImage from 'next/image'
import NextImage from '../../../public/image/puzzle-next.png'
import AnswerImage from '../../../public/image/puzzle-answer.png'
import SketchImage from '../../../public/image/puzzle-sketch.png'
import { ArrowCircleLeft } from '@phosphor-icons/react/dist/ssr'
import { Question } from '@phosphor-icons/react/dist/ssr'

function DemoJigsaw(props) {
    const Swal = require('sweetalert2')
    const puzzleRef = useRef(null)
    const [canvas, setCanvas] = useState(null)
    const [resetTrigger, setResetTrigger] = useState(0)
    // const [shuffleTrigger, setShuffleTrigger] = useState(0)
    const [sketchOpacity, setSketchOpacity] = useState(0.55)
    const router = useRouter()

    useEffect(() => {
        const img = new Image()
        img.onload = () => {
            const newCanvas = new headbreaker.Canvas(puzzleRef.current.id, {
                width: props.width,
                height: props.height,
                pieceSize: props.pieceSize,
                strokeWidth: 2,
                lineSoftness: 0.18,
                image: img,
                fixed: true,
                outline: new headbreaker.outline.Rounded(),
                painter: new headbreaker.painters.Konva(),
                // borderFill: props.pieceSize / 10,
                // proximity: props.pieceSize / 5,
                // strokeColor: 'white',
            })

            newCanvas.adjustImagesToPuzzleWidth();
            newCanvas.autogenerate({
                horizontalPiecesCount: props.horizontalPiecesCount,
                verticalPiecesCount: props.verticalPiecesCount,
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
                    Swal.fire({
                        title: '정답입니다! 다음 퍼즐도 풀어볼까요?',
                        icon: 'success',
                        confirmButtonText: '네!',
                        showDenyButton: true,
                        denyButtonText: `아니오`
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.reload()
                        }
                    });
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
        props.horizontalPiecesCount,
        props.verticalPiecesCount,
        resetTrigger,
    ])

    //다시 섞고 싶을 때
    // useEffect(() => {
    //     if (shuffleTrigger > 0 && canvas) {
    //         canvas.shuffle(0.5)
    //         canvas.redraw()
    //     }
    // }, [shuffleTrigger, canvas])

    // const shufflePuzzle = () => {
    //     setShuffleTrigger((prev) => prev + 1)
    // }

    const resetPuzzle = () => {
        // setShuffleTrigger(0) 
        setResetTrigger((prev) => prev + 1)
    }
    
    const sketchToggle = () => {
        setSketchOpacity(prevOpacity => prevOpacity === 0.55 ? 0 : 0.55)
    }

    const nextPuzzle = () => {
        Swal.fire({
            title: '다음 퍼즐로 넘어갑니다!',
            icon: 'success',
            confirmButtonText: '네!'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.reload()
            }
        });
    }
    
    const goBack = () => {
        // router.push('/')
        router.push('/play')
    }

    return (
        <>  
            <div
                className="w-[90%] flex items-center justify-between mx-auto"
            >
                <button
                    className="btn btn-ghost relative h-auto align-middle text-lg font-thin text-white hover:bg-transparent focus:bg-transparent"
                    onClick={goBack}
                >
                    <ArrowCircleLeft
                        size={80}
                        weight="fill"
                        className="text-black"
                    />
                </button>
                <div className='text-[3rem] ml-[100px]'>
                    <span>퍼즐놀이</span>
                    <button
                        onClick={()=>document.getElementById('help_modal').showModal()}
                        className='ml-[5px] align-text-bottom'
                    >
                        <Question
                            size={50}
                            weight="fill"
                            className='text-[#9999998f]'
                        />
                    </button>
                    <dialog id="help_modal" className="modal">
                        <div className="modal-box w-11/12 max-w-5xl">
                            <h3 className="font-bold text-[1.8rem]">도움말</h3>
                            <div className="py-4 flex flex-wrap justify-around">
                                <div className='flex items-center basis-[45%]'>
                                    <div className='flex flex-col items-center'>
                                        <NewImage
                                            src={AnswerImage}
                                            alt={'go to next puzzle'}
                                            className='w-[100px]'
                                        />
                                        <span className='text-[1.2rem]'>
                                            정답 보기
                                        </span>
                                    </div>
                                    <div className='text-[1.7rem] ml-[10px]'>
                                        퍼즐을 정답으로 맞춰줘요.
                                    </div>
                                </div>
                                <div className='flex items-center basis-[45%]'>
                                    <div className='flex flex-col items-center'>
                                        <NewImage
                                            src={SketchImage}
                                            alt={'go to next puzzle'}
                                            className='w-[100px]'
                                        />
                                        <span className='text-[1.2rem]'>
                                            힌트 없애기
                                        </span>
                                    </div>
                                    <div className='text-[1.7rem] ml-[10px]'>
                                        정답 밑그림을 안보이게 해요.
                                    </div>
                                </div>
                                <div className='flex items-center basis-[45%]'>
                                    <div className='flex flex-col items-center'>
                                        <NewImage
                                            src={NextImage}
                                            alt={'go to next puzzle'}
                                            className='w-[100px]'
                                        />
                                        <span className='text-[1.2rem]'>
                                            다음 퍼즐
                                        </span>
                                    </div>
                                    <div className='text-[1.7rem] ml-[10px]'>
                                        다음 퍼즐을 보여줘요.
                                    </div>
                                </div>
                                <div className='flex items-center basis-[45%]'>
                                    <div style={{ display: 'table' }} className='my-5 mx-2.5'>
                                        <span
                                            className='bg-customPurple w-20 h-20 text-2xl rounded-lg text-white table-cell align-middle text-center'
                                        >
                                            4x4
                                        </span>
                                    </div>
                                    <div className='text-[1.7rem] ml-[10px]'>
                                        퍼즐 조각 개수가 바뀌어요.
                                    </div>
                                </div>

                            </div>
                            <div className="modal-action">
                                <form method="dialog">
                                    <button className="btn btn-lg">닫기</button>
                                </form>
                            </div>
                        </div>
                        <form method="dialog" className="modal-backdrop">
                            <button>close</button>
                        </form>
                    </dialog>
                </div>
                <div>
                    <button
                        onClick={resetPuzzle}
                        className='w-[90px]'
                    >
                        <NewImage
                            src={AnswerImage}
                            alt={'go to next puzzle'}
                        />
                        <span>
                            정답 보기
                        </span>
                    </button>
                    <button
                        onClick={sketchToggle}
                        className='w-[90px]'
                    >
                        <NewImage
                            src={SketchImage}
                            alt={'go to next puzzle'}
                        />
                        <span>
                            힌트 없애기
                        </span>
                    </button>
                    <button
                        onClick={nextPuzzle}
                        className='w-[85px]'
                    >
                        <NewImage
                            src={NextImage}
                            alt={'go to next puzzle'}
                        />
                        <span>
                            다음 퍼즐
                        </span>
                    </button>
                </div>
            </div>
            <div className='flex flex-col items-center justify-center'>
                <div
                    ref={puzzleRef}
                    id={props.id}
                    className='relative border-[6px] border-[#020715] rounded-lg'
                >
                </div>
                <img 
                    src={props.imageSrc}
                    style={{ opacity: sketchOpacity, zIndex: '-1' }}
                    className='w-[550px] absolute border-[15px] border-[#af00ad] left-[55%]'
                /> 
            </div>
        </>
    )
}

export default function Puzzle() {
    const [pieceSize, setPieceSize] = useState(175)
    const [width, setWidth] = useState(1300)
    const [height, setHeight] = useState(600)
    const [childAgeCheck, setChildAgeCheck] = useState('')
    const [pagePictureUrl, setPagePictureUrl] = useState('')
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    const [horizontalPiecesCount, setHorizontalPiecesCount] = useState(3)
    const [verticalPiecesCount, setVerticalPiecesCount] = useState(3)

    const getPageImage = async () => {
        try {
            const childId = localStorage.getItem('childId')
            const response = await axios.get(`${apiUrl}/page/puzzle-image/${childId}`)
            
            if (response.data.status == 'success') {
                setChildAgeCheck(response.data.data.childAgeCheck)
                setPagePictureUrl(response.data.data.pagePictureUrl)
                console.log(response.data.data.pagePictureUrl)
                console.log(response.data.data.childAgeCheck)

                if (response.data.data.childAgeCheck === 'O') {
                    setPieceSize(130)
                    setHorizontalPiecesCount(4)
                    setVerticalPiecesCount(4)
                }
            } else {
                console.error('Failed to get PageImage: ', error)
            }
        } catch (error) {
            console.error('Failed to get PageImage: ', error)
        }
    }

    useEffect(() => {
        getPageImage()
    }, [])

    const handle2x2Puzzle = () => {
        setPieceSize(260)
        setWidth(1300)
        setHeight(600)
        setHorizontalPiecesCount(2)
        setVerticalPiecesCount(2)
    }

    const handle3x3Puzzle = () => {
        setPieceSize(175)
        setWidth(1300)
        setHeight(600)
        setHorizontalPiecesCount(3)
        setVerticalPiecesCount(3)
    }

    const handle4x4Puzzle = () => {
        setPieceSize(130)
        setWidth(1300)
        setHeight(600)
        setHorizontalPiecesCount(4)
        setVerticalPiecesCount(4)
    }

    const handle5x5Puzzle = () => {
        setPieceSize(105)
        setWidth(1300)
        setHeight(600)
        setHorizontalPiecesCount(5)
        setVerticalPiecesCount(5)
    }

    return (
        <div
            style={{ zIndex: '-2'}}
            className="h-dvh w-dvw bg-customYellow absolute flex flex-row items-center justify-center"
        >
            <div>
                <button onClick={handle2x2Puzzle}
                    className='bg-customPurple block w-20 h-20 text-2xl rounded-lg text-white my-5'
                >
                    2x2
                </button>
                <button onClick={handle3x3Puzzle}
                    className='bg-customPurple block w-20 h-20 text-2xl rounded-lg text-white my-5'
                >
                    3x3
                </button>
                <button onClick={handle4x4Puzzle}
                    className='bg-customPurple block w-20 h-20 text-2xl rounded-lg text-white my-5'
                >
                    4x4
                </button>
                <button onClick={handle5x5Puzzle}
                    className='bg-customPurple block w-20 h-20 text-2xl rounded-lg text-white my-5'
                >
                    5x5
                </button>
            </div>
            <div className='basis-[88%]'>
                <DemoJigsaw
                    id="puzzle"
                    pieceSize={pieceSize}
                    width={width}
                    height={height}
                    imageSrc={pagePictureUrl}
                    horizontalPiecesCount={horizontalPiecesCount}
                    verticalPiecesCount={verticalPiecesCount}
                />
            </div>
        </div>
    )
}