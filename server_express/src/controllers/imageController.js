//imageController.js
const connectDB = require('../config/db');
const imageService = require('../services/imageService');

async function createImage(req, res) {
  const { pageId } = req.body;

  connection.query('SELECT page_story FROM page WHERE page_id = ?', [pageId], async (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).send('Error fetching story from database');
    }
    if (results.length === 0) {
      return res.status(404).send('No story found for the given page ID');
    }

    try {
      const pageStory = results[0].page_story;
      const imageUrl = await imageService.generateImage(pageStory, pageId);
      res.status(200).send({ imageUrl });
    } catch (error) {
      console.error('Failed to create or upload image:', error);
      res.status(500).send('Failed to create or upload image');
    }
  });
}

async function bookCreation(req, res) {
    const { userId, storyId } = req.body;
    const connection = await connectDB();
    if (!connection) {
        res.status(500).send('Database connection failed');
        return;
    }

    try {
        const [results] = await connection.query('SELECT page_id, page_story FROM page WHERE book_id = ?', [storyId]);
        if (results.length === 0) {
            await connection.end();
            return res.status(404).send('No pages found for the given story ID');
        }

        res.status(200).send({ success: true, message: "동화 제작 중..." });

        const imageUrls = [];

        const batchSize = 4;
        for (let i = 0; i < results.length; i += batchSize) {
            // 현재 배치의 페이지를 추출
            const currentPageBatch = results.slice(i, i + batchSize);

            // 모든 이미지 생성 요청을 동시에 처리
            const batchImageUrls = await Promise.all(currentPageBatch.map(page =>
                imageService.generateImage(page.page_story, page.page_id)
            ));

            // URL 결과를 총 배열에 추가
            imageUrls.push(...batchImageUrls);

            // 모든 처리가 끝나면 다음 배치를 위해 잠시 대기
            if (i + batchSize < results.length) {
                await new Promise(resolve => setTimeout(resolve, 20000)); // 20초 대기
            }
        }

        // DB 업데이트는 모든 이미지 생성 후에 진행
        await Promise.all(results.map((page, index) => {
            return connection.query('UPDATE page SET page_image_url = ? WHERE page_id = ?', [imageUrls[index], page.page_id]);
        }));

        console.log(`All images uploaded and DB updated for storyId ${storyId}`);
    } catch (error) {
        console.error('Failed to create or upload images:', error);
        res.status(500).send('Failed to create or upload images');
    }
}

module.exports = {
  createImage,
  bookCreation
};
