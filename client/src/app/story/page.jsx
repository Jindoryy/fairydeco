import GuideText from './components/guideText'
import TitleBox from './components/titleBox'
import StoryBox from './components/storyBox'

export default function Story() {
    return (
        <div className="flex flex-col items-center justify-center">
            <GuideText />
            <TitleBox />
            <StoryBox />
        </div>
    )
}
