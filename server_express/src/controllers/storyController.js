// storyController.js
const connectDB = require('../config/db');
const stableService = require('../services/stableService');
const axios = require('axios');
const queue = [];
let isProcessing = false;

// 큐를 처리하는 함수, 순차적으로 작업을 실행
async function processQueue() {
    if (isProcessing || queue.length === 0) return;  // 현재 작업 중이거나 큐가 비어있으면 리턴

    isProcessing = true;
    const task = queue.shift();  // 큐에서 작업을 하나 꺼내기

    try {
        await task();  // 작업 실행
    } finally {
        isProcessing = false;  // 작업 완료 후 처리 상태를 false로 변경
        setImmediate(processQueue);  // 다음 작업을 위해 큐 처리 함수 재호출
    }
}

// 동화 책 생성을 위한 컨트롤러 함수
async function bookStableCreation(req, res) {
    const startTime = new Date();  // 시작 시간 기록
    console.log(`CHECK : BOOK CREATION STARTED AT ${startTime.toISOString()}`);
    const { userId, bookId, childId } = req.body;

    // 데이터베이스 연결 시도
    const connection = await connectDB();
    if (!connection) {
        res.status(500).send('Database connection failed');
        return;
    }
    console.log("PHASE 2 : DB CONNECTION SUCCESS");

    // 페이지 정보 쿼리
    const [results] = await connection.query('SELECT page_id, page_story FROM page WHERE book_id = ?', [bookId]);
    if (results.length === 0) {
        await connection.end();  // 결과가 없으면 연결 종료
        res.status(404).send(`No pages found for the given BOOK ID : ${bookId}, PAGE ID : ${pageId}`);
        return;
    }
    res.status(200).send({ success: true, message: "동화 제작 중..." });
    console.log("PHASE 3 : DB RETRIEVAL SUCCESS, RETURN SUCCESS RESPONSE");
    
    // 작업을 큐에 추가
    queue.push(async () => {
        try {
            // 이미지 생성 및 URL 저장
            const imageUrls = await Promise.all(results.map(page =>
                stableService.storyToImage(page.page_story, bookId, page.page_id)
            ));
            console.log("PHASE 4 : IMAGE URLs RETRIEVED");

            // 페이지 이미지 URL 업데이트
            await Promise.all(results.map((page, index) => {
                return connection.query('UPDATE page SET page_image_url = ? WHERE page_id = ?', [imageUrls[index], page.page_id]);
            }));
            console.log("PHASE 5 : PAGE IMAGE URLs UPDATED");

            // 커버 이미지 생성 및 업로드
            const allPageStories = results.map(page => page.page_story.replace(/^\d{1,2}\.\s/, '')).join(' ');
            const coverImageUrl = await stableService.storyToImage(allPageStories, "title", bookId);
            await connection.query('UPDATE book SET book_cover_url = ? WHERE book_id = ?', [coverImageUrl, bookId]);
            await connection.query(`UPDATE book SET book_complete = 'COMPLETE' WHERE book_id = ?`, [bookId]);
            console.log("PHASE 6 : COVER IMAGE CREATED AND DB UPDATED");
            
            const endUrl = `http://k10a402.p.ssafy.io:8081/book/end?userId=${userId}&bookId=${bookId}`;
            await axios.get(endUrl);
            console.log("PHASE 7: SEND SSE SUCCESS");
        } catch (error) {
            console.log("PHASE 7: FAILED");
            console.error('Failed during book creation process:', error);
        } finally {
            await connection.end();  // 작업 완료 후 DB 연결 종료
            console.log("PHASE 8 : DB CONNECTION CLOSED");
        }
    });

    processQueue();  // 큐 처리 시작
}

module.exports = {
  bookStableCreation,
};
