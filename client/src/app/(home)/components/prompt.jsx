import { Heart, GlobeHemisphereEast, StarAndCrescent, Ghost, PlusCircle, CaretRight } from '@phosphor-icons/react/dist/ssr'

export default function Prompt() {
    return (
        <div className="h-96 w-11/12 font-ourFont">
            <div className="m-1 mt-7 text-4xl font-bold">
                AI동화를 꾸며보아요!
            </div>
            <div className="text-2xl">
                <span className="text-customPurple">이야기</span>를 쓰거나{' '}
                <span className="text-customGreen">그림</span>을 그려서
                올려봐요! (둘 중 <span className="text-customRed">한가지</span>
                로만 동화를 만들 수 있어요!)
            </div>
            <div className="flex h-auto flex-col items-center justify-start rounded-3xl bg-customPink p-3 mt-3">
                <div className="flex w-11/12 justify-between pb-1 pt-4">
                    <div className="h-28 w-1/4 rounded-2xl bg-white p-2 shadow-customShadow">
                        <div className="mb-1 text-2xl pl-4 font-bold">지은이</div>
                        <select className="text-xl ml-3 h-12 outline:border-customPink select select-sm w-11/12 max-w-xs border-customPink focus:border-customPink focus:outline-customPink">
                            <option className="text-xl">박아들</option>
                            <option className="text-xl">박딸</option>
                        </select>
                    </div>
                    <div className="h-28 w-2/3 rounded-2xl bg-white p-2 shadow-customShadow">
                        <div className="mb-1 text-2xl pl-4 font-bold">카테고리</div>
                        <div className="ml-4 mr-4 mt-2 flex flex-row justify-between">
                            <button class="btn btn-sm btn-outline w-44 h-12 border-customPink hover:bg-customPink hover:border-customPink hover:text-black text-xl">
                                <GlobeHemisphereEast className="text-customPurple" size={30}></GlobeHemisphereEast>모험</button>
                            <button class="btn btn-sm btn-outline w-44 h-12 border-customPink hover:bg-customPink hover:border-customPink hover:text-black text-xl">
                                <StarAndCrescent className="text-customPurple" size={30}></StarAndCrescent>판타지
                            </button>
                            <button class="btn btn-sm btn-outline w-44 h-12 border-customPink hover:bg-customPink hover:border-customPink hover:text-black text-xl">
                                <Heart className="text-customPurple" size={30}></Heart> 로맨스
                            </button>
                            <button class="btn btn-sm btn-outline w-44 h-12 border-customPink hover:bg-customPink hover:border-customPink hover:text-black text-xl">
                                <Ghost className="text-customPurple" size={30}></Ghost> 미스터리
                            </button>
                        </div>
                    </div>
                </div>
                <div className="flex w-11/12 h-56 items-center justify-between mt-6">
                    <div className="w-4/5">
                        <div className="mb-1 text-2xl pl-4 font-bold">이야기</div>
                        <textarea className="w-11/12 h-full text-xl min-h-[190px] rounded-2xl p-4 focus:border-none focus:outline-none resize-none"placeholder='만들고 싶은 이야기를 적어주세요.
                         예시) 6살 여자아이가 숲으로 모험을 떠나는 동화를 만들어주세요! 여자아이는 흑발에 눈이 크답니다!'></textarea>
                    </div>
                    <div className="w-1/5">
                        <div className="mb-1 text-2xl pl-4 font-bold">그림</div>
                        <div className="bg-white w-11/12 h-full min-h-[190px] rounded-2xl flex justify-center items-center"><PlusCircle size={40}></PlusCircle></div>
                    </div>
                </div>
                <div>
                    <button class="btn btn-sm w-44 h-12 bg-customYellow mt-4 mb-2 shadow-customShadow text-base hover:bg-customYellow">동화 만들기 <CaretRight size={20} /></button>
                </div>
            </div>
        </div>
    )
}
