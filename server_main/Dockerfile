FROM openjdk:17

# root에 /app 폴더 생성
RUN mkdir /app

# work dir 고정
WORKDIR /app

ARG JAR_FILE=build/libs/fairydeco-0.0.1-SNAPSHOT.jar

COPY ${JAR_FILE} fairydeco.jar

ENTRYPOINT ["java","-jar","fairydeco.jar"]
