//storyRoutes.js
const express = require('express');
const router = express.Router();
const storyController = require('../controllers/storyController');
const imageController = require('../controllers/imageController');

/**
 * @swagger
 * /stories/test:
 *   get:
 *     summary: 서버 테스트
 *     description: 간단한 메시지를 반환하여 익스프레스 서버가 정상 작동 중임을 테스트합니다.
 *     responses:
 *       200:
 *         description: 메시지가 성공적으로 검색되었습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "서버가 정상적으로 작동하고 있습니다."
 *       500:
 *         description: 내부 서버 오류가 발생했습니다.
 */
router.get('/test', storyController.test);

/**
 * @swagger
 * /stories/create-image:
 *   post:
 *     summary: 이미지 생성
 *     description: 주어진 페이지 ID에 대한 이야기를 바탕으로 이미지를 생성하고 S3에 저장합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pageId
 *             properties:
 *               pageId:
 *                 type: integer
 *                 description: 이미지를 생성할 페이지의 ID입니다.
 *                 example: 101
 *     responses:
 *       200:
 *         description: 이미지가 성공적으로 생성 및 업로드 되었습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 imageUrl:
 *                   type: string
 *                   description: 업로드된 이미지의 URL입니다.
 *       500:
 *         description: 이미지 생성 또는 업로드 중 오류가 발생했습니다.
 */
router.post('/create-image', imageController.createImage);

/**
 * @swagger
 * /stories/book-creation:
 *   post:
 *     summary: 동화 이미지 생성 및 저장
 *     description: 주어진 유저 ID와 동화 ID를 바탕으로 동화의 각 페이지에 대한 이미지를 생성하고 저장합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - storyId
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: 유저의 ID
 *                 example: 1
 *               storyId:
 *                 type: integer
 *                 description: 동화의 ID
 *                 example: 100
 *     responses:
 *       200:
 *         description: 이미지 생성 및 저장이 시작되었습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "동화 제작 중..."
 *       500:
 *         description: 서버 오류로 인해 이미지 생성을 시작할 수 없습니다.
 */
router.post('/book-creation', imageController.bookCreation);
module.exports = router;