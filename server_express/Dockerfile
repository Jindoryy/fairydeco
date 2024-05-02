# Node.js 20 버전의 Alpine 이미지 사용
FROM node:20-alpine

# root에 /app 폴더 생성
RUN mkdir /app

# work dir 고정
WORKDIR /app

# Express.js 서버 파일들을 /app에 복사
COPY . .

# 애플리케이션 실행
CMD ["npm", "run", "start"]