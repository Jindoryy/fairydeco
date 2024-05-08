//imageController.js
const connectDB = require('../config/db');
const imageService = require('../services/imageService');
const axios = require('axios');

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
    } finally {
      await connection.end();
  }
  });
}

async function bookCreation(req, res) {
    const startTime = new Date();
    console.log(`CHECK : BOOK CREATION STARTED AT ${startTime.toISOString()}`);
    const { userId, bookId } = req.body;
    console.log("PHASE 1 : IMAGE CREATE START");
    console.log("Input BookId :" + `${bookId}`);
    const connection = await connectDB();
    if (!connection) {
        res.status(500).send('Database connection failed');
        return;
    }
    console.log("PHASE 2 : DB CONNECTION SUCCESS");
    try {
        const [results] = await connection.query('SELECT page_id, page_story FROM page WHERE book_id = ?', [bookId]);
        if (results.length === 0) {
            await connection.end();
            return res.status(404).send('No pages found for the given BOOK ID');
        }
        console.log("PHASE 3 : DB RETRIVAL SUCCESS, RETURN SUCCESS RESPONSE");
        res.status(200).send({ success: true, message: "동화 제작 중..." });

        const imageUrls = [];

        const batchSize = 2;
        for (let i = 0; i < results.length; i += batchSize) {
            // 현재 배치의 페이지를 추출
            const currentPageBatch = results.slice(i, i + batchSize);

            // 모든 이미지 생성 요청을 동시에 처리
            const batchImageUrls = await Promise.all(currentPageBatch.map(page =>
                imageService.generateImage(page.page_story, page.page_id, bookId)
            ));

            // URL 결과를 총 배열에 추가
            imageUrls.push(...batchImageUrls);

            // 모든 처리가 끝나면 다음 배치를 위해 잠시 대기
            if (i + batchSize < results.length) {
                await new Promise(resolve => setTimeout(resolve, 20000)); // 20초 대기
            }
        }
        console.log("PHASE 4 : IMAGE CREATE & S3 UPLOAD SUCCESS");
        // DB 업데이트는 모든 이미지 생성 후에 진행
        await Promise.all(results.map((page, index) => {
            return connection.query('UPDATE page SET page_image_url = ? WHERE page_id = ?', [imageUrls[index], page.page_id]);
        }));

        console.log("PHASE 5 : TITLE IMAGE CREATE & S3 UPLOAD START");
        await new Promise(resolve => setTimeout(resolve, 20000)); // 20초 대기
        const allPageStories = results.map(page => page.page_story.replace(/^\d{1,2}\.\s/, '')).join(' ');
        const coverImageUrl = await imageService.generateTitleImage(allPageStories, bookId);
        console.log("PHASE 6 : TITLE IMAGE CREATE & S3 UPLOAD SUCCESS");
        await connection.query('UPDATE book SET book_cover_url = ? WHERE book_id = ?', [coverImageUrl, bookId]);
        await connection.query(`UPDATE book SET book_complete = 'COMPLETE' WHERE book_id = ?`, [bookId]);
        console.log("PHASE 7 : TITLE IMAGE DB UPDATE & BOOK STATUS UPDATE SUCCESS");
        try {
          await axios.get(`http://k10a402.p.ssafy.io:8081/book/end/${bookId}`);
          console.log(`CHECK : SIGNAL SENT TO SPRING BOOT SERVER FOR BOOK ID ${bookId}`);
        } catch (error) {
          console.error('Failed to send signal to Spring Boot server:', error);
        }

        const endTime = new Date(); // endTime을 처리 완료 후에 정의
        console.log(`CHECK : BOOK CREATION ENDED AT ${endTime.toISOString()}`);
        console.log(`TOTAL TIME TAKEN: ${(endTime.getTime() - startTime.getTime()) / 1000} seconds`);
    } catch (error) {
        console.error('Failed to create or upload images:', error);
        res.status(500).send('Failed to create or upload images');
    } finally {
      await connection.end();
  }
}

module.exports = {
  createImage,
  bookCreation
};
