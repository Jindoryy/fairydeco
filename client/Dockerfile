# nginx 이미지 사용
FROM nginx:latest

# nginx 설정 파일
COPY nginx.conf /etc/nginx/nginx.conf

# Jenkins에서 빌드한 Next.js 정적 파일을 이미지로 복사
COPY ./client/.next /usr/share/nginx/html
COPY ./client/public /usr/share/nginx/html/public
# 필요에 따라 다른 파일 또는 폴더 추가 복사

# nginx 실행
CMD ["nginx", "-g", "daemon off;"]