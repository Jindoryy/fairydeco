<img src="https://capsule-render.vercel.app/api?type=waving&color=C3E5AE&height=150&section=header&text=&fontSize=300"  style="width: 100%;"  />



# <center><img src="../img/logoonlybook.png"  width="90"  height="75" /></center> 동꾸 (동화 꾸미기) 
### 동꾸(동화 꾸미기)는 아이가 직접 만들어가는 AI 동화 창작 서비스입니다.

<center>![동화꾸미기메인1.gif](../img/동화꾸미기메인1.gif)</center>



## 1. 프로젝트 개요

### 개발 기간
|개발기간|2024-04-08 ~ 2024-05-20 (6주)|
|---|---|

### 팀원 소개
|이건희|박지원|김연화|이진규|김선혁|최영진|
|:---:|:---:|:---:|:---:|:---:|:---:|
|<img src="https://github.com/sunhyeok99/Baekjoon/assets/132821972/baebca60-5144-4f2c-88df-8654ecdb0630" width="80" height="100">|<img src="https://github.com/sunhyeok99/Baekjoon/assets/132821972/4c9f5efd-cffc-42ab-8946-9a33c30b2751" width="85" height="100">|<img src="https://github.com/sunhyeok99/Baekjoon/assets/132821972/7f39161b-ba1e-441e-8b45-a79600b1028f" width="85" height="100">|<img src="https://github.com/sunhyeok99/Baekjoon/assets/132821972/7a3594f9-91aa-4131-8f5c-59bf755788d2" width="85" height="100">|<img src="https://github.com/sunhyeok99/Baekjoon/assets/132821972/7ce97644-5a46-44ec-820f-e1b6e492c66b" width="85" height="100">|<img src="https://github.com/sunhyeok99/Baekjoon/assets/132821972/c2066cd2-4a89-4fa1-90db-4ed5427dd8a6" width="85" height="100">|
|팀장, Infra, AI|Frontend|Frontend|Backend, AI|Backend, AI|Backend, Frontend|

### 기획 배경
|어린이들의 유투브 과도한 시청|
|:---:|
|수동적인 참여와 제한적인 사고|

### 서비스 목표
**아이들의 능동적으로 참여하고, 아이들의 창의력과 인지능력 상승을 할 수 있는 서비스**


***

## 2. 프로젝트 특징 

**아이가 그림을 그리면 그림에서 키워드를 분석해 8페이지 동화를 만들어 줍니다.**

**아이의 나이에 따라 그림체와 스토리의 단어, 분량, 내용 등에 차이가 있습니다.**

|3~5세 아이 동화 화면|6~7세 아이 동화 화면|
|:---:|:---:|
|<img src="../img/3~5세 아이 동화 화면.png"|<img src="../img/6~7세 아이 동화 화면.png"|
 

***

## 3. 기능소개 
### 주요 기능

- 아이가 그린 그림으로 나이대 별 동화 생성
- 나이에 따라 다른 아이가 만든 동화 추천
- 내가 만든 동화 자동재생 기능

### 세부 기능

|기능|내용|
|:---:|:---:|
|동화 생성|동화를 생성하는 아이의 나이에 따라서 동화의 길이, 말투, 사용되는 단어 등을 다르게 생성한다.|
|그림 드로잉 기능|아이가 직접 그림을 그릴 수 있으며 그린 그림을 저장할 수 있다.|
|동화 TTS 기능|동화를 감상할 때 동화 스토리에 해당하는 내용을 음성으로 지원한다.|
|자동재생|아이가 생성한 동화들을 자동재생을 통하여 감상할 수 있다.|
|퍼즐놀이|2X2 크기부터 5X5 크기까지 완성되어 있는 정답 그림을 참고하여 퍼즐놀이를 즐길 수 있다.|

### 주요 페이지 소개

|메인 페이지|그림 드로잉 페이지|
|:---:|:---:|
|<img src="../img/.gif" width="470" height="260">|<img src="../img/그림 드로잉 페이지.gif" width="470" height="260">|

|랜딩 페이지|아이 선택 페이지|
|:---:|:---:|
|<img src="../img/" width="470" height="260">|<img src="../img/" width="470" height="260">|

|동화 감상 페이지|다른 동화 추천 및 선택 페이지|
|:---:|:---:|
|<img src="../img/동화 감상 페이지.gif" width="470" height="260">|<img src="../img/다른 동화 추천 및 선택 페이지.gif" width="470" height="260">|

|퍼즐 게임|마이 페이지|
|:---:|:---:|
|<img src="../img/퍼즐 게임.gif" width="470" height="260">|<img src="../img/" width="470" height="260">|

***

## 4. 기술스택

### Front-end

|<img src="../img/Next.js" width="70" height="70">|<img src="../img/Node.js" width="70" height="70">|<img src="../img/Daisy.ui.png" width="70" height="70">|
|:---:|:---:|:---:|
|Next.js|Node.js|Daisy.ui|

### Back-end

|<img src="../img/Java.svg" width="70" height="70">|<img src="../img/Spring Boot.png" width="70" height="70">| <center><img src="../img/Spring Security.png" width="70" height="70"></center> |<img src="../img/jpa.png" width="70" height="70">|
|:---:|:---:|:------------------------------------------------------------------------------------------------------------------------------------------------:|:---:|
|Java|Spring Boot|                                                                  SpringSecurity                                                                  |Jpa|

### Infra

|<img src="../img/NGiNX.png" width="70" height="70">|<img src="../img/Jenkins.png" width="70" height="70">|<img src="../img/AWS EC2.jpg" width="70" height="70">|<img src="../img/Docker.png" width="70" height="70">|
|:---:|:---:|:---:|:---:|
|NGiNX|Jenkins|AWS EC2|Docker|

### ETC

|<img src="../img/OpenAI.png" width="70" height="70">| <center><img src="../img/StableDiffusion.png" width="70" height="70"></center> |<img src="../img/MySQL.png" width="70" height="70">|<img src="../img/Gerrig.png" width="70" height="70">|<img src="../img/Jira.png" width="80" height="70">|
|:---:|:---:|:---:|:---:|:---:|
|OpenAi|StableDiffusion|MySQL|Gerrit|Jira|

***

## 5. 아키텍쳐

![image](../img/아키텍쳐.png)

***

## 6. ERD

![image](../img/ERD.png)

***

## 7. 변화 과정


![image](../img/변화과정1.png) | ![image](../img/변화과정2.png)
---|---|

기존에는 부모님과 같이 이용하는 서비스를 계획해서 그림 또는 프롬프트 입력을 통해 스토리 생성 -> 스토리 확인 후 이미지 생성

![image](../img/변화과정3.png)

=> **아이들도 간편하고 쉽게 사용할 수 있도록 하나의 과정으로 통합**

<img src="https://capsule-render.vercel.app/api?type=waving&color=C3E5AE&height=150&section=footer" style="width: 100%;" />
