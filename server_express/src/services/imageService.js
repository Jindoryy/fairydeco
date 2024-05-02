//imageService.js
const { OpenAI } = require("openai");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const axios = require("axios");
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
});

async function generateImage(pageStory, pageId) {
  try {
    // 이미지 생성 요청 전에 15초 기다림
    await new Promise(resolve => setTimeout(resolve, 15000)); // 15초 대기
    
    const imageResponse = await openai.images.generate({
        model: "dall-e-3",
        prompt: pageStory,
        n: 1,
        size: "1024x1024"
    });

    const imageUrl = imageResponse.data[0].url;

    // 이미지 데이터 다운로드 => S3에 업로드 하기 위해 다운로드
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const imageData = Buffer.from(response.data, 'binary');

    const s3Params = {
        Bucket: process.env.S3_BUCKET,
        Key: `storybook-images/${pageId}.png`,
        Body: imageData,
        ContentType: 'image/png'
    };
    
    // S3 업로드 진행
    await s3Client.send(new PutObjectCommand(s3Params));

    // S3에 업로드된 이미지의 URL 생성
    const uploadedUrl = `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Params.Key}`;
    return uploadedUrl;
  } catch (error) {
    console.error('Error in generating or uploading image:', error);
    throw error;
  }
}

module.exports = {
  generateImage
};
