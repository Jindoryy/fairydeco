//imageService.js
const { OpenAI } = require("openai");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const axios = require("axios");
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY_IMAGE,
});

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
});

async function generateImage(pageStory, pageId, bookId) {
  try {
    // 이미지 생성 요청 전에 3초 기다림
    await new Promise(resolve => setTimeout(resolve, 3000)); // 3초 대기

    console.log(`PHASE-CREATION 1 : PAGE ${pageId} IMAGE CREATE START`);
    const imageResponse = await openai.images.generate({
        model: "dall-e-3",
        prompt: `Please generate a purely graphic fairy tale image with no text at all, reflecting the given theme: "${pageStory}." The image should stimulate children's imagination and sense of adventure. Ensure the image contains no text, no English words, and no speech bubbles.`,
        n: 1,
        size: "1024x1024"
    });

    console.log(`PHASE-CREATION 2 : PAGE ${pageId} OPEN API RESPONSE SUCCESS`);
    const imageUrl = imageResponse.data[0].url;

    // 이미지 데이터 다운로드 => S3에 업로드 하기 위해 다운로드
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const imageData = Buffer.from(response.data, 'binary');

    console.log(`PHASE-CREATION 3 : PAGE ${pageId} DOWNLOAD SUCCESS`);

    const s3Params = {
        Bucket: process.env.S3_BUCKET,
        Key: `storybook-images/${bookId}-${pageId}.png`,
        Body: imageData,
        ContentType: 'image/png'
    };
    
    // S3 업로드 진행
    await s3Client.send(new PutObjectCommand(s3Params));

    // S3에 업로드된 이미지의 URL 생성
    const uploadedUrl = `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Params.Key}`;
    console.log(`PHASE-CREATION 4 : PAGE ${pageId} S3 UPLOAD SUCCESS`);
    return uploadedUrl;
  } catch (error) {
    console.error('Error in generating or uploading image:', error);
    return null;
  }
}

async function generateTitleImage(pageStories, bookId) {
  try {
    console.log(pageStories)
    const prompt = `Please generate a purely graphic fairy tale image with no text at all, reflecting the given theme: "${pageStories}." The image should stimulate children's imagination and sense of adventure. Ensure the image contains no text, no English words, and no speech bubbles.`;

    // 이미지 생성 요청 전에 3초 기다림
    await new Promise(resolve => setTimeout(resolve, 3000)); // 3초 대기

    console.log(`PHASE-CREATION 1 : TITLE IMAGE CREATE START`);
    const imageResponse = await openai.images.generate({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024"
    });

    console.log(`PHASE-CREATION 2 : TITLE IMAGE OPEN API RESPONSE SUCCESS`);
    const imageUrl = imageResponse.data[0].url;

    // 이미지 데이터 다운로드 => S3에 업로드 하기 위해 다운로드
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const imageData = Buffer.from(response.data, 'binary');

    console.log(`PHASE-CREATION 3 : TITLE IMAGE DOWNLOAD SUCCESS`);

    const s3Params = {
        Bucket: process.env.S3_BUCKET,
        Key: `storybook-images/title-${bookId}.png`,
        Body: imageData,
        ContentType: 'image/png'
    };
    
    // S3 업로드 진행
    await s3Client.send(new PutObjectCommand(s3Params));

    // S3에 업로드된 이미지의 URL 생성
    const uploadedUrl = `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Params.Key}`;
    console.log(`PHASE-CREATION 4 : TITLE IMAGE S3 UPLOAD SUCCESS`);
    return uploadedUrl;
  } catch (error) {
    console.error('Error in generating or uploading image:', error);
    return null;
  }
}


module.exports = {
  generateImage,
  generateTitleImage
};
