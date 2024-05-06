'use client'
import React, { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import axios from 'axios'

import 'swiper/css'
import 'swiper/css/pagination'

import { Pagination } from 'swiper/modules'

export default function StoryBox({ story }) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    const [newStory, setNewStory] = useState([])

    useEffect(() => {
        setNewStory(story)
    }, [story])

    const handleText = (event, pageId) => {
        const updatedStory = newStory.map((storyItem) => {
            if (storyItem.pageId === pageId) {
                return {
                    ...storyItem,
                    pageStory: event.target.value,
                }
            }
            return storyItem
        })
        setNewStory(updatedStory)
    }
    const handleStoryChange = async (pageId, pageStory) => {
        try {
            const response = await axios.put(`${apiUrl}/page/story`, {
                pageId: pageId,
                pageStory: pageStory,
            })
            let pageNumber = newStory.findIndex((el) => el.pageId === pageId)

            if (response.data.status === 'success') {
                alert(`${pageNumber + 1}번 이야기가 수정 되었습니다.`)
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
                                            handleStoryChange(
                                                story.pageId,
                                                story.pageStory
                                            )
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
                                onChange={(event) =>
                                    handleText(event, story.pageId)
                                }
                            ></textarea>
                        </SwiperSlide>
                    ))}
                </div>
            </Swiper>
        </>
    )
}
