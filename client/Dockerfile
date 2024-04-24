# nginx 이미지 사용
FROM nginx:latest

# nginx 설정 파일
COPY nginx.conf /etc/nginx/nginx.conf

# Jenkins에서 빌드한 정적 파일을 이미지로 복사
COPY ./build /usr/share/nginx/html

# nginx 실행
CMD ["nginx", "-g", "daemon off;"]