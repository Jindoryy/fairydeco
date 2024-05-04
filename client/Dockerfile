# Node.js 20 버전의 Alpine 이미지 사용
FROM node:20-alpine

# root에 /app 폴더 생성
RUN mkdir /app

# work dir 고정
WORKDIR /app

# Next.js 빌드 결과물과 정적 파일을 /app에 복사
# COPY ./.next ./.next
# COPY ./public ./public
# COPY ./node_modules ./node_modules
# COPY ./package.json ./package.json
COPY . .


# 환경 변수 설정
ENV NEXT_PUBLIC_API_URL="https://fairydeco.site/api"

# 애플리케이션 실행
CMD ["npm", "run", "start"]