# nginx 이미지 사용
FROM nginx:latest

# root에 /app 폴더 생성
RUN mkdir /app

# work dir 고정
WORKDIR /app

# Next.js 빌드 결과물과 정적 파일을 /app에 복사
COPY ./.next ./.next
COPY ./public ./public
COPY ./node_modules ./node_modules
COPY ./package.json ./package.json

# nginx 설정 파일 복사
COPY nginx.conf /etc/nginx/nginx.conf

# CMD를 통한 Next.js 서버 실행
CMD ["npx", "next", "start"]