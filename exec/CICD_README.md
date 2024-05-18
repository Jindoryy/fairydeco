# 배포 가이드

## MobaXterm

### Mobaxterm Download

> https://mobaxterm.mobatek.net/

### SSH 접속정보 입력

1. SSH 타입 선택
2. 서버 주소 입력
3. Specify username 체크
4. 계정명 입력 (deafault : ubuntu)
5. Use private key 체크
6. 디렉토리에서 \*.pem 키 선택

## 우분투 서버 기본 설정

### 서버 시간 한국기준으로 변경

```bash
sudo timedatectl set-timezone Asia/Seoul
```

### 패키지 업데이트

```bash
sudo apt-get -y update && sudo apt-get -y upgrade
```

### Swap 영역 할당

```bash
free -h
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
sudo echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

## Docker 설치

### 설치전 필요한 패키지 설치

```bash
sudo apt-get -y install apt-transport-https ca-certificates curl gnupg-agent software-properties-common
```

### Docker GPC 인증 확인

```bash
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
```

OK가 나오면 정상

### Docker Repo 등록

```bash
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
```

### 패키지 리스트 갱신

```bash
sudo apt-get -y update
```

### Docker 설치 및 권한부여

```bash
sudo apt-get -y install docker-ce docker-ce-cli containerd.io
sudo usermod -aG docker ubuntu
sudo service docker restart
```

## Jenkins

### Jenkins 설치

```bash
docker pull jenkins/jenkins:jdk17
docker run -d --restart always --env JENKINS_OPTS=--httpPort=8080 -v /etc/localtime:/etc/localtime:ro -e TZ=Asia/Seoul -p 8080:8080 -v /jenkins:/var/jenkins_home -v /var/run/docker.sock:/var/run/docker.sock -v /usr/local/bin/docker-compose:/usr/local/bin/docker-compose --name jenkins -u root jenkins/jenkins:jdk17
```

### Jenkins 플러그인 미러서버 변경

```bash
sudo docker stop jenkins
sudo mkdir /jenkins/update-center-rootCAs
sudo wget https://cdn.jsdelivr.net/gh/lework/jenkins-update-center/rootCA/update-center.crt -O /jenkins/update-center-rootCAs/update-center.crt
sudo sed -i 's#https://updates.jenkins.io/update-center.json#https://raw.githubusercontent.com/lework/jenkins-update-center/master/updates/tencent/update-center.json#' /jenkins/hudson.model.UpdateCenter.xml
sudo docker restart jenkins
```

### initialAdminPassword 가져오기

```bash
docker exec -it jenkins /bin/bash
cd /var/jenkins_home/secrets
cat initialAdminPassword
```

k10a402.p.ssafy.io:8080 접속시 initialAdminPassword 비밀번호를 입력

### Jenkins 내부에 Docker 설치

```bash
docker exec -it jenkins /bin/bash
apt-get update && apt-get -y install apt-transport-https ca-certificates curl gnupg2 software-properties-common && curl -fsSL https://download.docker.com/linux/$(. /etc/os-release; echo "$ID")/gpg > /tmp/dkey; apt-key add /tmp/dkey && add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/$(. /etc/os-release; echo "$ID") $(lsb_release -cs) stable" && apt-get update && apt-get -y install docker-ce
groupadd -f docker
usermod -aG docker jenkins
chown root:docker /var/run/docker.sock
```

### Jenkins 플러그인 설치

- SSH Agent
- Docker
- Docker Commons
- Docker Pipeline
- Docker API
- Generic Webhook Trigger
- GitLab
- GitLab API
- GitLab Authentication
- GitHub Authentication
- NodeJS

### Gitlab Credentials 등록 (Username with password)

- Jenkins 관리 - Manage Credentials - Stores scoped to Jenkins - Domains - (global) - Add credentials
- 아래 정보 입력
  - Kind : Username with password 선택
  - Username : Gitlab 계정 아이디 입력
  - Password : Gitlab 계정 비밀번호 입력 **(토큰 발행시, API 토큰 입력)**
  - ID : Credential에 대한 별칭 (ex : fairydeco)
- **Create** 클릭

### Gitlab Credentials 등록 (API Token)

- Jenkins 관리 - Manage Credentials - Stores scoped to Jenkins - Domains - (global) - Add credentials
- 아래 정보 입력
  - Kind : Gitlab API token 선택
  - API tokens : Gitlab 계정 토큰 입력
  - ID : Credential에 대한 별칭 (ex : fairydeco)
- **Create** 클릭

### Gitlab 커넥션 추가

- Jenkins 관리 - System Configuration - System
- Gitlab의 **Enable authentication for ‘/project’ end-point** 체크
- 아래 정보 입렵
  - Connection name : Gitlab 커넥션 이름 지정
  - Gitlab host URL : Gitlab 시스템의 Host 주소 입력
  - Credentials : 조금 전 등록한 **Jenkins Credential (API Token)**을 선택
  - 이후, **Test Connection**을 눌러 Success가 뜨면 **저장** 클릭
  - 아니라면 입력한 정보를 다시 확인

### Docker Hub Credential 추가

- https://hub.docker.com/ <= 접속 및 로그인 후 Access Token 발급
- Repositories - Create repository <- Docker hub 레포지토리 생성
- Jenkins 관리 - Manage Credentials - Stores scoped to Jenkins - Domains - (global) - Add credentials
- Credential 정보 입력
  - Kind : Username with password
  - Username : DockerHub에서 사용하는 계정 아이디 입력 (ex : fairydeco)
  - Password : DockerHub에서 사용하는 Access Token 입력
  - ID : Jenkins 내부에서 사용하는 Credential 별칭 입력 (ex : fairydeco-docker)
- **Create** 클릭

### Ubuntu Credential 추가

- Jenkins 관리 - Manage Credentials - Stores scoped to Jenkins - Domains - (global) - Add credentials
- Kind를 `SSH Username with private key`로 설정
- 아래 정보 입력
  - ID : Jenkins에서 Credential에 지정할 별칭 입력 (ex : ubuntu-a402)
  - Username : SSH 원격 서버 호스트에서 사용하는 계정명 입력 (ex : ubuntu)
  - Enter directly 체크 - Add 클릭
  - AWS \*.pem 키의 내용을 메모장으로 읽어 복사 후 Key에 붙여넣기
- **Create** 클릭

## Nginx & SSL

- 외부 도메인 구입 후 해당 Url로 Certbot 인증 진행
- 외부 도메인 사이트에서 AAAA, A 라우팅 주소를 서버 ip 주소로 할당
- 80 포트 할당된 nginx를 통해 포트 포워딩 할당

```conf
server {
        listen 80 default_server;
        listen [::]:80 default_server;
        root /var/www/html;
        index index.html index.htm index.nginx-debian.html;

        server_name _;

        location / {
                try_files $uri $uri/ =404;
        }
}

server {
        server_name fairydeco.site; # managed by Certbot


        location /api/ {
                proxy_pass http://localhost:8081/;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection 'upgrade';
                proxy_set_header Host $host;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto $scheme;
                proxy_read_timeout 1800;
        }

        location / {
                proxy_pass http://localhost:3000/;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection 'upgrade';
                proxy_set_header Host $host;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto $scheme;
                proxy_read_timeout 1800;
        }
    listen [::]:443 ssl ipv6only=on; # managed by Certbot
    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/fairydeco.site-0001/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/fairydeco.site-0001/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot

}
server {
    if ($host = fairydeco.site) {
        return 301 https://$host$request_uri;
    } # managed by Certbot

        listen 80 ;
        listen [::]:80 ;
    server_name fairydeco.site;
    return 404; # managed by Certbot


}

server {
    listen 80;
    server_name k10a402.p.ssafy.io;

    location / {
        proxy_pass http://localhost:3000;
        proxy_read_timeout 1800;
    }

    location /api {
        proxy_pass http://localhost:8081;
        proxy_read_timeout 1800;
    }

}
```

- Certbot 인증 후 default.conf 의 주석 부분들은 수정 안하는 것을 권장, 인증서 자동 업데이트시 문제가 생길 수 있음

## CI,CD를 위한 Webhook 설정

- Jenkins Item - Pipeline - General - Build Triggers
  - Build when a change is pushed to Gitlab 체크
  - Push Events 체크
  - Opened Merge Request Events 체크
  - Approved Merge Request (EE-only) 체크
  - Comments 체크
  - **발행된 Secret token 복사해두고 저장**
- Gitlab Webhook 지정
  - Gitlab에 특정 브랜치에 merge request가 된 경우 Webhook을 통해 빌드 및 서비스 재배포 이벤트 발동
  - Gitlab의 배포할 서비스의 Repository 접속
  - Settings - Webhooks 클릭
  - URL : Jenkins의 Item URL 입력 (양식 : `http://[Jenkins Host]:[Jenkins Port]/project/[파이프라인 아이템명]`)
  - Secret token : Jenkins의 Gitlab trigger 고급 설정 중 Secret token Generate 버튼을 이용해 만든 토큰 입력
  - Trigger : Push events 체크, merge request가 되면 Jenkins 이벤트가 발동하게 할 브랜치 입력
  - SSL verification의 **Enable SSL verification** 체크
  - **Add webhook** 클릭

## Client & Server 통합 Pipeline

```groovy
pipeline {
    agent any

    tools {
        gradle "gradle8.7"
        nodejs "Node"
    }

    environment {
        backendImageName = "leekh109/fairydeco-server"
        clientImageName = "leekh109/fairydeco-client"
        expressImageName = "leekh109/fairydeco-express"
        registryCredential = 'docker_hub'
        releaseServerAccount = 'ubuntu'
        releaseServerUri = 'k10a402.p.ssafy.io'
        releasePort = 3000
    }

    stages {
        stage('Git Clone') {
            steps {
                git branch: 'develop',
                    credentialsId: '',
                    url: 'https://lab.ssafy.com/s10-final/S10P31A402'
            }
        }
        stage('Fetch .env from EC2') {
            steps {
                dir('client') {
                    script {
                        sshagent(credentials: ['ubuntu-a402']) {
                            // Copy .env.local file from EC2
                            sh '''
                            scp -o StrictHostKeyChecking=no $releaseServerAccount@$releaseServerUri:~/app/.env.local .env.local
                            '''
                        }
                        // .env.local
                        sh 'echo "Contents of .env.local file:"'
                        sh 'cat .env.local || echo ".env.local file not found"'
                    }
                }
            }
        }
        stage('Node Build') {
            steps {
                dir('client') {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }
        stage('Jar Build') {
            steps {
                dir ('server_main') {
                    sh 'chmod +x ./gradlew'
                    sh './gradlew build'
                }
            }
        }
        stage('Express Install') {
            steps {
                dir('server_express') {
                    script {
                        sh 'npm install'
                    }
                }
            }
        }
        stage('Image Build & DockerHub Push') {
            steps {
                dir('client') {
                    script {
                        docker.withRegistry('', registryCredential) {
                            sh "docker buildx build --platform linux/amd64 -t $clientImageName:$BUILD_NUMBER --push ."
                            sh "docker buildx build --platform linux/amd64 -t $clientImageName:latest --push ."
                        }
                    }
                }
                dir('server_main') {
                    script {
                        docker.withRegistry('', registryCredential) {
                            sh "docker buildx build --platform linux/amd64 -t $backendImageName:$BUILD_NUMBER --push ."
                            sh "docker buildx build --platform linux/amd64 -t $backendImageName:latest --push ."
                        }
                    }
                }
                dir('server_express') {
                    script {
                        docker.withRegistry('', registryCredential) {
                            sh "docker buildx build --platform linux/amd64 -t $expressImageName:$BUILD_NUMBER --push ."
                            sh "docker buildx build --platform linux/amd64 -t $expressImageName:latest --push ."
                        }
                    }
                }
            }
        }
        stage('Before Service Stop') {
            steps {
                script {
                    sshagent(credentials: ['ubuntu-a402']) {
                        sh '''
                        ssh -o StrictHostKeyChecking=no $releaseServerAccount@$releaseServerUri "cd app; sudo docker-compose down"
                        ssh -o StrictHostKeyChecking=no $releaseServerAccount@$releaseServerUri "cd app; sudo docker rmi $clientImageName:latest"
                        ssh -o StrictHostKeyChecking=no $releaseServerAccount@$releaseServerUri "cd app; sudo docker rmi $backendImageName:latest"
                        ssh -o StrictHostKeyChecking=no $releaseServerAccount@$releaseServerUri "cd app; sudo docker rmi $expressImageName:latest"
                        '''
                    }
                }
            }
        }
        stage('Service Start') {
            steps {
                script {
                    sshagent(credentials: ['ubuntu-a402']) {
                        sh '''
                            ssh -o StrictHostKeyChecking=no $releaseServerAccount@$releaseServerUri "cd app; sudo docker-compose -f docker-compose.yml up -d"
                        '''
                    }
                }
            }
        }
    }
    post {
        success {
         	script {
                def Author_ID = sh(script: "git show -s --pretty=%an", returnStdout: true).trim()
                def Author_Name = sh(script: "git show -s --pretty=%ae", returnStdout: true).trim()
                mattermostSend (color: 'good',
                message: "빌드 성공: ${env.JOB_NAME} #${env.BUILD_NUMBER} by ${Author_ID}(${Author_Name})\n(<${env.BUILD_URL}|Details>)",
                endpoint: '메타모스트 웹훅 url',
                channel: 'build'
                )
            }
        }
        failure {
            script {
                def Author_ID = sh(script: "git show -s --pretty=%an", returnStdout: true).trim()
                def Author_Name = sh(script: "git show -s --pretty=%ae", returnStdout: true).trim()
                mattermostSend (color: 'danger',
                message: "빌드 실패: ${env.JOB_NAME} #${env.BUILD_NUMBER} by ${Author_ID}(${Author_Name})\n(<${env.BUILD_URL}|Details>)",
                endpoint: '메타모스트 웹훅 url',
                channel: 'build'
                )
            }
        }
    }
}

```

## BackEnd Dockerfile(SpringBoot)

```docker
FROM openjdk:17

# root에 /app 폴더 생성
RUN mkdir /app

# work dir 고정
WORKDIR /app

ARG JAR_FILE=build/libs/fairydeco-0.0.1-SNAPSHOT.jar

COPY ${JAR_FILE} fairydeco.jar

ENTRYPOINT ["java","-jar","fairydeco.jar"]
```

## BackEnd Dockerfile(Express.js)

```docker
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
```

## FrontEnd Dockerfile(Next.js)

```docker
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

# 애플리케이션 실행
CMD ["npm", "run", "start"]
```

## Mysql 배포 (RDS)

1. AWS -> RDS -> Database 생성
2. Mysql, 프리 티어 설정
3. 퍼블릭 엑세스를 예로 설정(로컬에서 DB 수정을 하기 위함, 최종 배포 후 설정 변경)
4. 초기 데이터베이스 생성(DB를 하나 생성해두는 것이 편하다)
5. 새로운 파라미터 보안 그룹 설정(IPv4와 IPv6 모두 접근가능하게 변경)
6. DB 앤드포인트 복사 후 인텔리제이에 DB 연동(Test Connection으로 Success가 나오는지 꼭 확인)
7. application-secret.yaml에 DB정보 추가해주기
