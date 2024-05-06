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

async function createImagePrompt(pageStory) {
  try {
    const gptResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { "role": "system", "content": "You are an assistant who helps generate prompts for DALL-E 3." },
        { "role": "user", "content": `Create a prompt for a DALL-E image based on the following story: "${pageStory}". The prompt should describe a scene suitable for children, preferably in Pixar animation style, and follow these conditions: 
        - One single image 
        - No speech bubbles
        - No text or letters
        - Cute and child-friendly. and like Piaxr-style or cartoon style` }
      ]
    });
    return gptResponse.choices[0].message.content;
  } catch (error) {
    console.error('Error in creating image prompt:', error);
    return null;
  }
}

async function generateImage(pageStory, pageId, bookId) {
  try {
    // 프롬프트 생성
    const prompt = await createImagePrompt(pageStory);
    if (!prompt) throw new Error("Failed to create prompt");

    // 이미지 생성 요청 전에 3초 기다림
    await new Promise(resolve => setTimeout(resolve, 3000)); // 3초 대기

    console.log(`PHASE-CREATION 1 : PAGE ${pageId} IMAGE CREATE START`);
    const imageResponse = await openai.images.generate({
      model: "dall-e-3",
      prompt: `이 내용에 맞는 이야기의 한 장면을 그려줘, 아이들이 좋아하는 귀여운 그림체로 만들어줘 Pixar 스타일의 애니메이션 그림체도 좋아. 내용: ${pageStory}`,
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
    // 프롬프트 생성
    const prompt = await createImagePrompt(pageStories);
    if (!prompt) throw new Error("Failed to create prompt");

    // 이미지 생성 요청 전에 3초 기다림
    await new Promise(resolve => setTimeout(resolve, 3000)); // 3초 대기

    console.log(`PHASE-CREATION 1 : TITLE IMAGE CREATE START`);
    const imageResponse = await openai.images.generate({
      model: "dall-e-3",
      prompt: `이 내용에 맞는 이야기의 한 장면을 그려줘, 아이들이 좋아하는 귀여운 그림체로 만들어줘 Pixar 스타일의 애니메이션 그림체도 좋아. 내용: ${pageStory}`,
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
