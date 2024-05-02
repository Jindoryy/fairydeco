'use client'
import React, { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import axios from 'axios'

import 'swiper/css'
import 'swiper/css/pagination'

import { Pagination } from 'swiper/modules'

export default function StoryBox({ story }) {
    const [newStory, setNewStory] = useState([])
    const [focusStory, setFocusStory] = useState('')

    useEffect(() => {
        setNewStory(story)
    }, [story])

    const handleText = (event) => {
        setFocusStory(event.target.value)
    }
    const handleStoryChange = (pageId) => {
        getChangeStory(pageId)
    }
    const getChangeStory = async (pageId) => {
        console.log('change')
        try {
            const response = await axios.put(
                'http://k10a402.p.ssafy.io:8081/page/story',
                {
                    pageId: pageId,
                    pageStory: focusStory,
                }
            )
            if (response.data.status == 'success') {
                alert('수정 되었습니다.')
            } else {
                alert('수정이 실패했습니다. 다시 한 번 시도해주세요')
            }
        } catch (error) {
            console.error(error)
        }
    }
    return (
        <>
            <Swiper
                slidesPerView={3}
                spaceBetween={30}
                pagination={{
                    clickable: true,
                }}
                modules={[Pagination]}
                className="h-[400px] w-11/12"
            >
                <div className="flex w-full items-center justify-center">
                    {newStory.map((story, index) => (
                        <SwiperSlide
                            key={index}
                            className="rounded-2xl border-2 border-[#F4EA00] bg-[#FFFDEA]"
                        >
                            <div className="m-4 mb-0 flex w-11/12 items-center justify-between p-4 pb-0">
                                <div className="card-title text-2xl">
                                    {index + 1}
                                </div>
                                <div className="card-actions justify-end">
                                    <button
                                        className="btn-ms btn ml-8 w-[100px] border-2 border-[#F4EA00] bg-white text-lg hover:border-[#F4EA00] hover:bg-white focus:outline-none"
                                        onClick={() =>
                                            handleStoryChange(story.pageId)
                                        }
                                    >
                                        수정
                                    </button>
                                </div>
                            </div>
                            <textarea
                                defaultValue={story.pageStory}
                                className="mx-8 mt-8 h-[250px] w-10/12 resize-none whitespace-normal break-words rounded-xl bg-[#FFFDEA] p-4 text-xl  focus:bg-white focus:outline-[#F4EA00]"
                                style={{
                                    scrollbarWidth: 'thin',
                                    scrollbarColor: '#F4EA00 #FFFDEA',
                                    rounded: '2',
                                }}
                                onChange={handleText}
                            ></textarea>
                        </SwiperSlide>
                    ))}
                </div>
            </Swiper>
        </>
    )
}
