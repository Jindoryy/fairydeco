FROM openjdk:17
# work dir 고정
WORKDIR /app
ARG JAR_FILE=build/libs/fairydeco-0.0.1-SNAPSHOT.jar
COPY ${JAR_FILE} fairydeco.jar
ENTRYPOINT ["java","-jar","fairydeco.jar"]
