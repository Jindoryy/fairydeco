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
            <div className="flex min-h-96 flex-col items-center justify-start rounded-3xl bg-customPink p-3 ">
                <div className="flex w-11/12 justify-between pb-1 pt-1">
                    <div className="h-20 w-1/4 rounded-2xl bg-white p-2">
                        <div className="mb-1 text-base">지은이</div>
                        <select className="outline:border-customPink select select-sm w-full max-w-xs border-customPink focus:border-customPink focus:outline-customPink">
                            <option>박아들</option>
                            <option>박딸</option>
                        </select>
                    </div>
                    <div className="h-20 w-2/3 rounded-2xl bg-white p-2">
                        <div className="mb-1 text-base">카테고리</div>
                        <div>
                            <button class="btn btn-outline">Default</button>
                            <button class="btn btn-outline btn-primary">
                                Primary
                            </button>
                            <button class="btn btn-outline btn-secondary">
                                Secondary
                            </button>
                            <button class="btn btn-outline btn-accent">
                                Accent
                            </button>
                        </div>
                    </div>
                </div>
                <div className="flex w-11/12 bg-slate-400">
                    <div className="bg-customYellow">이야기</div>
                    <div className="bg-customPurple">스토리</div>
                </div>
            </div>
        </div>
    )
}
