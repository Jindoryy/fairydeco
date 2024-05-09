//bookService.js
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
          { "role": "user", "content": `Create a prompt for a StableDiffusionImage based on the following story: "${pageStory}". The prompt should describe a scene suitable for children. The prompt should follow these conditions:
            - One single image
            - No speech bubbles
            - No text or letters
            - Cute and child-friendly. Provide a detailed description including the setting, main characters, key actions, and the emotional tone or theme of the scene to ensure the generated image closely aligns with the story.` }
        ]
      });
      return gptResponse.choices[0].message.content;
    } catch (error) {
      console.error('Error in creating image prompt:', error);
      return null;
    }
}

async function storyToImage(pageStory, bookId, pageId) {
  const convertprompt = await createImagePrompt(pageStory);
  const url = "https://stablediffusionapi.com/api/v4/dreambooth";

  const headers = {
      'Content-Type': 'application/json'
  };

  const payload = {
      key: process.env.API_KEY,
      model_id: "sdxl",
      prompt: convertprompt+"((masterpiece)), best quality, very detailed, high resolution, sharp, sharp image, extremely detailed, 4k, 8k, fairytale",
      negative_prompt: "painting, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, deformed, ugly, blurry, bad anatomy, bad proportions, extra limbs, cloned face, skinny, glitchy, double torso, extra arms, extra hands, mangled fingers, missing lips, ugly face, distorted face, extra legs, anime",
      width: "1024",
      height: "1024",
      samples: "1",
      num_inference_steps: "31",
      safety_checker: "no",
      enhance_prompt: "yes",
      seed: 2098127623,
      guidance_scale: 7.5,
      multi_lingual: "yes",
      panorama: "no",
      self_attention: "no",
      upscale: "no",
      webhook: null,
      track_id: null
  };

  let retryCount = 0;
  const maxRetries = 3;

  while (retryCount < maxRetries) {
      try {
          const response = await axios.post(url, payload, { headers });
          // console.log(response);
          if (response.data.status === 'success') {
              const timeout = 600000; // 10 minutes in milliseconds
              const retryInterval = 15000; // 15 seconds in milliseconds
              const startTime = Date.now();

              while (Date.now() - startTime < timeout) {
                  try {
                      await new Promise(resolve => setTimeout(resolve, retryInterval));
                      const imageData = await downloadAndUploadImage(response.data.output[0], bookId, pageId);
                      if (imageData) {
                          return imageData;
                      }
                  } catch (downloadError) {
                      console.log(`Attempt to download main image failed for pageId: ${pageId}, retrying...`, downloadError.message);
                  }
              }
              console.log("Final attempt using proxy link.");
              return await downloadAndUploadImage(response.data.output[0], bookId, pageId);
          } else if (response.data.status === 'processing') {
              const timeout = 600000; // 10 minutes in milliseconds
              const retryInterval = 15000; // 15 seconds in milliseconds
              const startTime = Date.now();

              while (Date.now() - startTime < timeout) {
                  try {
                      await new Promise(resolve => setTimeout(resolve, retryInterval));
                      const imageData = await downloadAndUploadImage(response.data.future_links[0], pageId, bookId);
                      if (imageData) {
                          return imageData;
                      }
                  } catch (downloadError) {
                      console.log(`Attempt to download main image failed for pageId: ${pageId}, retrying...`, downloadError.message);
                  }
              }
              console.log("Final attempt using future link");
              return await downloadAndUploadImage(response.data.future_links[0], pageId, bookId);
          } else if (response.data.status === 'error') {
              console.log(response.data);
              console.log(`Error on try ${retryCount + 1}, retrying...`);
              retryCount++;
              continue;
          } else {
              throw new Error("Unhandled image generation status.");
          }
      } catch (error) {
          console.error(`Error handling image generation on try ${retryCount + 1}:`, error);
          retryCount++;
          if (retryCount >= maxRetries) {
              return null;
          }
      }
  }
  console.error('All retry attempts failed.');
  return null;
}


async function downloadAndUploadImage(imageUrl, key, value) {
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const imageData = Buffer.from(response.data, 'binary');
    const s3Params = {
        Bucket: process.env.S3_BUCKET,
        Key: `storybook-images/${key}-${value}.png`,
        Body: imageData,
        ContentType: 'image/png'
    };
    await s3Client.send(new PutObjectCommand(s3Params));
    const uploadedUrl = `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Params.Key}`;
    console.log(`Upload successful: ${uploadedUrl}`);
    return uploadedUrl;
}

module.exports = {
  storyToImage,
};