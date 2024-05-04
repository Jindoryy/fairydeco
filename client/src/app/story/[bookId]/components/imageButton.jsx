import { useRouter } from 'next/navigation'
import axios from 'axios'

export default function ImageButton({ bookId }) {
    const router = useRouter()
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    const handleMakeStory = () => {
        console.log(bookId)
        getImage()
    }
    const getImage = async () => {
        //유저아이디 변경 필요
        try {
            const response = await axios.post(`${apiUrl}/book/image`, {
                userId: 1,
                bookId: bookId,
            })
            if (response.data.status == 'success') {
                alert(
                    '기다려주시면 재밌는 동화를 만들어드릴게요!~ 동화가 만들어지는 데에 3~5분이 소요됩니다. '
                )
                router.push('/')
            } else {
                alert('동화를 만드는 데 실패했습니다. 다시 한 번 시도해주세요!')
            }
        } catch (error) {
            console.error('failed to make Image: ', error)
        }
    }
    return (
        <div className="mb-4">
            <button
                onClick={handleMakeStory}
                className="btn btn-sm mb-2 mt-4 h-12 w-44 bg-[#FBF573] text-base shadow-customShadow hover:bg-[#FBF573] focus:border-[#FBF573]"
            >
                이 이야기로 할래요
            </button>
        </div>
    )
}
