//storyController.js
const axios = require('axios');
const AWS = require('aws-sdk');

// AWS S3 설정
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

exports.test = (req, res) => {
  res.send('Hello World!');
}

exports.createStoryImages = async (req, res) => {
  try {
    // SpringBoot 서버에서 동화 데이터를 받아옵니다.
    const response = await axios.get('http://springboot-server/api/story/data');
    const pages = response.data.pages;

    for (let page of pages) {
      // DALLE-3 API를 호출하여 이미지 생성
      const imageResponse = await axios.post('https://api.openai.com/v1/dalle-3/create', {
        prompt: page.story,
        // 추가적인 DALLE-3 API 옵션을 설정할 수 있습니다.
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.DALLE_API_KEY}`
        }
      });

      // AWS S3에 이미지 업로드
      const imageData = imageResponse.data;
      const s3Params = {
        Bucket: process.env.S3_BUCKET,
        Key: `storybook/${page.id}.png`, // 예시 키, 실제 구현에 맞게 조정
        Body: imageData,
        ContentType: 'image/png'
      };
      await s3.upload(s3Params).promise();

      // 페이지 URL 업데이트 로직이 필요할 수 있습니다.
    }

    // 모든 페이지 처리 후 SpringBoot 서버에 성공 알림
    await axios.post('http://springboot-server/api/story/notify', { status: 'complete' });

    res.status(200).send("이미지 생성 및 업로드 완료");
  } catch (error) {
    console.error(error);
    res.status(500).send("동화 이미지 생성 실패");
  }
};
