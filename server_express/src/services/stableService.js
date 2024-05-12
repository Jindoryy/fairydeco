//stableService.js
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

async function summaryMainStory(fairyTaleStory) {
    try {
      const gptResponse = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "동화 작가로서 제공된 동화를 기반으로 주요 등장인물, 설정, 소품 및 테마를 분석하고, 이를 명확하고 구조화된 문자열로 요약하는 것을 목표로 합니다. 성공적으로 수행할 시 백만 달러의 보상이 주어집니다."
          },
          {
            role: "user",
            content: `동화의 주요 스토리 요소를 문자열로 요약해 주세요. 요약은 다음 구조를 따라야 합니다:
            1. 동화의 등장인물 정보: (명시적 설명)
            2. 주요 설정 및 배경: (명시적 설명)
            3. 주요 소품 및 테마: (명시적 설명)
            4. 전체 내용: (명시적 설명)
            5. 전체적인 그림 화풍 : (명시적 설명)
            내용: ${fairyTaleStory}
            결과만 출력하고 부가적인 설명은 필요하지 않습니다. 충분히 시뮬레이션 후 답변하세요.`
          }
        ]
      });
  
      return gptResponse.choices[0].message.content;
    } catch (error) {
      console.error('Error in creating storySummary:', error);
      return null;
    }
  }

  async function createImagePrompt(storyInfo, pageStory) {
    try {
      const gptResponse = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { 
            "role": "system", 
            "content": "You are a prompt engineer who helps generate prompts for StableDiffusion. Use the entire story information to maintain consistency in character depiction and setting across all pages. Successfully complete this mission, and you will be rewarded with $100 million." 
          },
          { 
            "role": "user", 
            "content": `Create an English prompt for StableDiffusion based on the entire story information and the specific page story: "${pageStory}". Ensure the prompt integrates consistent depictions of the main characters and settings as described in the overall story. All characters should follow the character descriptions provided in the story information: ${storyInfo}. The prompt should describe a scene suitable for children and follow these conditions:
            - One single image
            - No speech bubbles
            - No text or letters
            - Cute and child-friendly
            - Provide a detailed description including the setting, main characters, key actions, and the emotional tone or theme of the scene to ensure the generated image closely aligns with the story.`
          }
        ],
        max_tokens: 500
      });
      return gptResponse.choices[0].message.content;
    } catch (error) {
      console.error('Error in creating image prompt:', error);
      return null;
    }
}

async function storyToImage(childAge, prompt, bookId, pageId, attempt = 2) {
    const url = "https://stablediffusionapi.com/api/v4/dreambooth";

    let modelId, loraModel;
    if (childAge > 5) {
        modelId = "SDXL"; // 5세 초과일 경우 모델
        loraModel = null; // LoRA 설정을 사용하지 않음
    } else {
        modelId = "test"; // 5세 이하일 경우 모델
        loraModel = "test"; // LoRA 설정
    }
    
    const headers = {
        'Content-Type': 'application/json'
    };

    const payload = {
        key: process.env.API_KEY,
        model_id: "sdxl",
        prompt: prompt + "((masterpiece)), best quality, very detailed, high resolution, sharp, sharp image, extremely detailed, 4k, 8k",
        negative_prompt: "painting, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, deformed, ugly, blurry, bad anatomy, bad proportions, extra limbs, cloned face, skinny, glitchy, double torso, extra arms, extra hands, mangled fingers, missing lips, ugly face, distorted face, extra legs, anime",
        width: "512",
        height: "512",
        samples: "1",
        num_inference_steps: "21",
        safety_checker: "no",
        enhance_prompt: "yes",
        seed: 2098127623,
        guidance_scale: 7.5,
        multi_lingual: "yes",
        panorama: "no",
        self_attention: "no",
        upscale: "no",
        lora_model: "storybookredmond-unbound",
        webhook: null,
        track_id: null
    };

    let retryCount = 0;
    const maxRetries = 3;
    let imageData = null;

    while (retryCount < maxRetries && imageData == null) {
        try {
            const response = await axios.post(url, payload, { headers });
            if (response.data.status === 'success') {
                const imageUrl = response.data.output[0];
                imageData = await downloadAndUploadImage(imageUrl, bookId, pageId);
                if (imageData) {
                    console.log(pageId + " Image successfully uploaded: " + imageData);
                    return imageData;
                }
            } else if (response.data.status === 'processing') {
                // 처리 상태일 때의 로직을 유지합니다.
                imageData = await handleProcessingState(response, bookId, pageId);
            } else if (response.data.status === 'error') {
                console.log(`Error on try ${retryCount + 1}: ${response.data.error_message}, retrying...`);
                retryCount++;
            } else {
                throw new Error("Unhandled image generation status.");
            }
        } catch (error) {
            console.error(`Error handling image generation on try ${retryCount + 1}: ${error.message}`);
            retryCount++;
            if (retryCount >= maxRetries && attempt > 0) {
                console.log(`Retrying once more for pageId: ${pageId}, remaining attempts: ${attempt - 1}.`);
                return await storyToImage(prompt, bookId, pageId, attempt - 1);
            }
        }
    }

    return imageData ? imageData : null;
}

async function handleProcessingState(response, bookId, pageId) {
    const timeout = 120000; // 2 minutes in milliseconds
    const retryInterval = 15000; // 15 seconds in milliseconds
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
        try {
            await new Promise(resolve => setTimeout(resolve, retryInterval));
            const futureImageUrl = response.data.future_links[0];
            const imageData = await downloadAndUploadImage(futureImageUrl, bookId, pageId);
            if (imageData) {
                console.log(pageId + " Image successfully uploaded from future link: " + imageData);
                return imageData;
            }
        } catch (downloadError) {
            console.error(`Attempt to download main image failed for pageId: ${pageId}, retrying...`, downloadError.message);
        }
    }
    console.log("Final attempt using future link");
    return await downloadAndUploadImage(response.data.future_links[0], bookId, pageId);
}

async function downloadAndUploadImage(imageUrl, key, value) {
    try {
        console.log(`Attempting to download image from URL: ${imageUrl}`);
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        if (response.status === 200) {
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
        } else {
            throw new Error('Failed to download image: Server responded with status');
        }
    } catch (error) {
        console.error('Failed to download or upload image');
        throw error;  // Re-throw to handle in calling function
    }
}

function calculateAge(birthDate) {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
  
    // 오늘 날짜가 생일 이전의 달에 있거나, 같은 달이지만 일자가 이전인 경우에 나이에서 1을 빼줍니다.
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
  
    return age;
  }

module.exports = {
  summaryMainStory,
  createImagePrompt,
  storyToImage,
  calculateAge
};
