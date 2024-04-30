'use client'
import React, { useRef, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'

import 'swiper/css'
import 'swiper/css/pagination'

import { Pagination } from 'swiper/modules'

export default function StoryBox() {
    const [numbers, setNumbers] = useState([1, 2, 3, 4, 5, 6, 7, 8])
    const [story, setStory] = useState([
        '건희는 아침에 일어나 숲으로 가기로 결심했다. 그녀는 어제 꿈에서 꽤도둑들이 숨은 보물을 찾았다는 이야기를 듣고 흥분했다. 숲으로 향하는 건희는 길을 가다가 예쁜 꽃밭을 발견했다. 더 진행하기 전에 꽃밭을 구경하기로 했다.',
        '꽃밭에서 시간을 보낸 건희는 보물을 찾는 것을 잊었다. 하지만 갑자기 듣는 음모 소리에 깜짝 놀랐다. 눈을 돌리니, 꽤도둑들이 보물을 찾는 중이었다! 건희는 당황하지만 용기를 내어 꽤도둑들이 알고 있는 보물 말고 다른 보물을 찾기로 했다',
        '건희가 꽤도둑들을 피해 깊은 숲으로 들어갔다. 그러던 중 큰 나무 뒤에서 엉크러진 무언가를 발견했다. 온몸이 속이 쭉 뻣뻣해진 건희는 그것이 무엇일지 궁금해 했다. 엉크러진 무언가를 향해 걸어가려 했지만 끝내 걸음이 멎고 말았다.',
        '잠시 후, 재워 있는 동물 소리가 발견된 나무 다리의 끝에 딸려 있는 오래된 인형이 보였다. 건희는 무서워하기도 하다가, 동심으로 인해 그 인형에 감정을 느낀다. 나무 다리를 통해 인형을 가져오려는데, 인형은 사라져 버렸다.',
        '한참을 인형을 찾았지만 다다음 날에야 바닥에 떨어진 인형을 찾았다. 인형은 조그만 흰색 옷을 입은 것이었다. 건희는 서둘러 인형을 주워 얼굴을 살핀 후 그냥 아늑한 소리를 내 준다.',
        '그리고 인형을 품에 안고 집으로 향했다. 돌아가기 전 마지막 숲을 조각해 보면 도둑들이 숲을 쏘다녀서 포기한 보물을 발견하는데 건희는 아주 큰 밝게 웃음치고 주웠다. 그로 인해 건희는 아머 다행히도 시련을 겪어야 보석같은 보물을 찾았다는 소중한 교훈의 가르침을 얻게 되었다.',
        '그리고 마지막으로, 다음날 아침 다시 일어나겠다는 건희는 수수께끼의 보물을 지니고 숲으로 향했다. 건희와 인형은 앞으로 갈 많은 모험을 바라 보았다. 그리고 끝내 건희는 동화 같은 모험을 살았다. ',
        '이야기는 이거로 끝나나요~~',
    ])

    const handleStoryChange = (event) => {
        console.log(event.target.value)
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
                    {numbers.map((number, index) => (
                        <SwiperSlide
                            key={index}
                            className="rounded-2xl border-2 border-[#F4EA00] bg-[#FFFDEA]"
                        >
                            <div className="m-4 mb-0 flex w-11/12 items-center justify-between p-4 pb-0">
                                <div className="card-title text-2xl">
                                    {number}
                                </div>
                                <div className="card-actions justify-end">
                                    <button
                                        className="btn-ms btn ml-8 w-[100px] border-2 border-[#F4EA00] bg-white text-lg hover:border-[#F4EA00] hover:bg-white focus:outline-none"
                                        onClick={handleStoryChange}
                                    >
                                        수정
                                    </button>
                                </div>
                            </div>
                            <textarea
                                className="mx-8 mt-8 h-[250px] w-10/12 resize-none whitespace-normal break-words rounded-xl bg-[#FFFDEA] p-4 text-xl  focus:bg-white focus:outline-[#F4EA00]"
                                style={{
                                    scrollbarWidth: 'thin',
                                    scrollbarColor: '#F4EA00 #FFFDEA',
                                    rounded: '2',
                                }}
                            >
                                {story[index]}
                            </textarea>
                        </SwiperSlide>
                    ))}
                </div>
            </Swiper>
        </>
    )
}
