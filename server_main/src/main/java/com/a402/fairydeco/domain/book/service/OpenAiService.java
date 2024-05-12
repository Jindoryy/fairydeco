package com.a402.fairydeco.domain.book.service;

import com.a402.fairydeco.domain.book.dto.*;
import com.a402.fairydeco.domain.book.entity.Book;
import com.a402.fairydeco.domain.book.repository.BookRepository;
import com.a402.fairydeco.domain.child.entity.Child;
import com.a402.fairydeco.domain.child.repository.ChildRepository;
import com.a402.fairydeco.domain.page.dto.PageStory;
import com.a402.fairydeco.domain.page.entity.Page;
import com.a402.fairydeco.domain.page.repository.PageRepository;
import com.a402.fairydeco.global.common.dto.StoryRequest;
import com.a402.fairydeco.global.common.dto.StoryResponse;
import com.a402.fairydeco.global.common.exception.CustomException;
import com.a402.fairydeco.global.common.exception.ErrorCode;
import com.a402.fairydeco.global.util.FileUtil;
import com.a402.fairydeco.global.util.VoiceUtil;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.File;
import java.net.http.HttpClient;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;

import java.net.URI;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.http.HttpRequest.BodyPublishers;
import java.time.Duration;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.concurrent.CompletableFuture;

@Service
@Transactional
@RequiredArgsConstructor
public class OpenAiService {
    private final BookRepository bookRepository;
    private final PageRepository pageRepository;
    private final ChildRepository childRepository;
    private final BookService bookService;
    @Value("${openai.model1}")
    private String model1; // 4~5세
    @Value("${openai.model2}")
    private String model2; // 6~7세
    @Value("${openai.model3}")
    private String fineModel; // 스토리 파인튜닝 모델
    @Value("${openai.api.url}")
    private String apiURL;
    @Value("${openai.api.image}")
    private String openAiImageApiKey;

    private final RestTemplate restTemplate;
    private final FileUtil fileUtil;
    private final VoiceUtil voiceUtil;
    private final HttpClient httpClient = HttpClient.newHttpClient();

    @Transactional
    public CompletableFuture<BookCreateRequestDto> register(BookRegister bookRegister) throws IOException {
        // 1. 들어온 내용을 바탕으로 동화 등록
        // 2. 프롬프트로 동화 스토리 생성
        // 3. 동화 스토리 save 후 return
        // 이미지가 만약 있을 경우 건희형이 만든 image to text 서비스 메서드 사용해서 한줄 스토리 받음
        Child child = childRepository.findById(bookRegister.getChildId()).orElseThrow(() -> new CustomException(ErrorCode.CHILD_NOT_FOUND_ERROR));
        String age;
//        String prompt = "<동화 스토리 작성 프롬프트>\n" +
//                "\n" +
//                "넌 지금부터 동화 스토리텔링 전문가야. 아래 키워드를 활용하여 많은 사람이 흥미를 느낄만한 글을 작성해 줘야 해. 이 프롬프트를 전송하면 아래의 단계를 진행해 줘.\n" +
//                "\n" +
//                "1. 씬을 8장 이상으로 나누고 각 씬별 대본을 작성해 줘. 대본은 아래의 구조로 작성해 줘.\n" +
//                "    구조:\n" +
//                "    1. 내용1 끝!\n" +
//                "    2. 내용2 끝!\n" +
//                "    3. 내용3 끝!\n" +
//                "    4. 내용4 끝!\n" +
//                "    5. 내용5 끝!\n" +
//                "    6. 내용6 끝!\n" +
//                "    7. 내용7 끝!\n" +
//                "    8. 내용8 끝!\n" +
//                "\n" +
//                "2. 주의사항:\n" +
//                "    *도입부: 2초 내로 사람들의 흥미를 유발할 수 있는 문구나 주제를 넣어줘.\n" +
//                "    *각 씬의 대본은 끝에는 끝! 이 단어를 넣어서 8장 이상으로 무조건 나누고 구체적으로 작성해야해. 그리고 전부 한글로 작성해야해.\n" +
//                "    *많은 사람들이 좋아하고 관심있어 하는 대중적이고 유명한 키워드를 중간 중간 넣어줘.\n" +
//                "    *대본은 디테일이 중요해. 필요한 단어나 배경지식이 있다면 외부에서 검색해서 스토리의 완성도를 더 깊이있게 만들어줘";

        String prompt = "";

        if ((LocalDate.now().getYear() - Integer.parseInt(child.getBirth().toString().substring(0, 4))) > 5) {
            age = "O";
        } else {
            age = "Y";
        }
        // 이미지 null이면 키워드 그냥 더하고
        // 이미지 있으면 이미지 따로저장 + 이미지분석으로 키워드 가져옴
        // image to text 메서드
        ImgPromptDto imgPromptDto = createPromptKidImg(bookRegister.getBookPicture());
        String[] promptTmp = imgPromptDto.getPrompt().split(",");
        if(promptTmp.length != 5){
            System.out.println("키워드 분석 실패");
            return null;
        }
        Book book = Book.builder()
                .child(childRepository.findById(child.getId()).orElseThrow((() -> new CustomException(ErrorCode.BOOK_NOT_FOUND_ERROR))))
                .name(child.getName() + "의 이야기")
                .maker(child.getName())
                .prompt(imgPromptDto.getPrompt())
                .pictureUrl(imgPromptDto.getImageUrl())
                .pictureName(imgPromptDto.getImageName())
                .recommendAge(RecommendAge.valueOf(age))
                .build();
        Book savedBook = bookRepository.save(book);
        if (age.equals("Y")) {
            prompt += "목적 : 키워드로 동화 스토리를 생성해줘 주고 구분을 쉽게 할 수 있도록 양식을 무조건 지켜서 8개로 시뮬레이션해 양식으로 문자열 파싱을 할거라서 각 스토리 끝에 '끝!'은 꼭 지켜줘야해\n " +
                    "양식 : {번호. 내용 끝!} ex) 1. 내용1 끝!  2. 내용2 끝! 3. 내용3 끝! ....... 8. 내용8 끝!\n" +
                    "주의사항 : 3~5세 아이를 위한 동화라 내용은 창의적이고 흥미를 유발하지만 이해도는 크게 필요없는 내용으로 부탁해 그리고 단어는 3~5세 아동들이 이해 할 수 있는 쉬운 단어를 사용하고 어투는 다정한 ~했어요 등의 부드러운 말투를 사용해줘. 양식으로 문자열 파싱을 할거라서 각 스토리 끝에 '끝!'은 꼭 지켜줘야해. 그리고 결과물만 출력해줘 다른 멘트는 하지마 추가적으로 동화 내용의 문맥이 논리적이고 어색하지 않은지도 시뮬레이션해서 수정해야해\n" +
                    "\n" +
                    "키워드 :"+ savedBook.getPrompt();
        } else {
            prompt += "목적 : 키워드로 동화 스토리를 생성해줘 주고 구분을 쉽게 할 수 있도록 양식을 무조건 지켜서 8개로 시뮬레이션해 양식으로 문자열 파싱을 할거라서 각 스토리 끝에 '끝!'은 꼭 지켜줘야해 \n" +
                    "양식 : {번호. 내용 끝!} ex) 1. 내용1 끝!  2. 내용2 끝! 3. 내용3 끝! ....... 8. 내용8 끝!\n" +
                    "주의사항 : 6~8세 아이를 위한 동화라 내용은 창의적이고 교훈을 줄 수 있는 내용으로 부탁해 그리고 단어는 6~8세 아동들이 이해 할 수 있는 쉬운 단어를 사용하고 어투는 다정한 ~했어요 등의 부드러운 말투를 사용해줘. 양식으로 문자열 파싱을 할거라서 각 스토리 끝에 '끝!'은 꼭 지켜줘야해. 그리고 내용은 각 200자 이상으로 결과물만 출력해줘 다른 멘트는 하지마 추가적으로 동화 내용의 문맥이 논리적이고 어색하지 않은지도 시뮬레이션해서 수정해야해\n" +
                    "\n" +
                    "키워드 :"+ savedBook.getPrompt();
        }
        // 스토리 생성
        // 프롬프트는 그대로 while 문으로 8컷 이하시 재생성
        String finalPrompt = prompt;
        return CompletableFuture.supplyAsync(() -> {
            try {
                String[] bookStories;
                String model = model1;
                if (age.equals("O")) {
                    model = model2;
                }
                while (true) {
                    // 나이가 어리면 model1으로
                    // 나이 많으면 model2로 실행
                    StoryRequest request = new StoryRequest(model, finalPrompt);
                    StoryResponse storyResponse = restTemplate.postForObject(apiURL, request, StoryResponse.class);
                    String story = storyResponse.getChoices().get(0).getMessage().getContent();
                    System.out.println(story);
                    String[] tmp = story.split("끝!");
                    System.out.println(tmp.length);
                    if (tmp.length < 7) {
                        continue;
                    }
                    String finePrompt = "넌 지금부터 동화 제작 전문가야. 문장마다 끝!을 사용하는 구조는 유지하고 현재 문장에서 영어가 들어간 단어는 한국어로 바꿔주고, 자연스럽지 않은 문장은 자연스럽게 바꿔주고 전체적으로 4살 아이가 이해할 수 있는 단어들로 구성해줘";
                    finePrompt += "\n\n " + story;
                    request = new StoryRequest(fineModel, finePrompt);
                    storyResponse = restTemplate.postForObject(apiURL, request, StoryResponse.class);
                    String fineStory = storyResponse.getChoices().get(0).getMessage().getContent();
                    bookStories = fineStory.split("끝!"); // 8개로 나눔
                    System.out.println(bookStories.length+"~~");
                    System.out.println(fineStory);
                    if (bookStories.length >= 7) {
                        break;
                        // 8개가 아니라면 루프를 다시 시작
                    }
                }
                // 앞에 1. , 2. 지우는 작업
                for (int i = 0; i < bookStories.length; i++) {
                    bookStories[i] = bookStories[i].trim();
                    int tmp = i + 1;
                    for (int j = 0; j < bookStories[i].length(); j++) {
                        if (bookStories[i].substring(j, j + 1).equals(".")) {
                            bookStories[i] = bookStories[i].substring(j + 1, bookStories[i].length());
                            break;
                        }
                    }
                }
                // 각 page 8개 db에 저장하는 작업
                for (int i = 0; i < bookStories.length; i++) {
                   // 목소리 파일 생성 후 s3 저장
                    File voice = voiceUtil.createVoice(bookStories[i]);
                    Page page = Page.builder()
                            .book(savedBook)
                            .story(bookStories[i])
                            .voiceUrl(fileUtil.uploadMP3(voice))
                            .voiceDuration(voiceUtil.getVoiceDuration(voice))
                            .build();
                    pageRepository.save(page);
                }

                BookCreateRequestDto bookCreateRequestDto = BookCreateRequestDto.builder()
                        .userId(child.getUser().getId())
                        .bookId(savedBook.getId())
                        .childId(child.getId())
                        .build();
                return bookCreateRequestDto;
            } catch (Exception e) {
                // 예외 처리
                return null;
            }
        });
    }

    public ImgPromptDto createPromptKidImg(MultipartFile image) throws IOException {
        // 이미지를 S3에 업로드하고 URL을 얻음
        String imageUrl = fileUtil.uploadFile(image);
        String imageName = image.getOriginalFilename();
        // 동화 스토리 생성
        String prompt = generateStory(imageUrl);
        ImgPromptDto response = new ImgPromptDto(prompt, imageUrl, imageName);
        return response;
    }

    public String generateStory(String imageUrl) {
        String requestBody = buildRequestBody(imageUrl);
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://api.openai.com/v1/chat/completions"))
                .header("Content-Type", "application/json")
                .header("Authorization", "Bearer " + openAiImageApiKey)
                .timeout(Duration.ofMinutes(2))
                .POST(BodyPublishers.ofString(requestBody))
                .build();
        try {
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            String responseBody = response.body();
            // Parse the response JSON and extract the content field
            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode = mapper.readTree(responseBody);
            String content = rootNode
                    .path("choices")
                    .get(0)
                    .path("message")
                    .path("content")
                    .asText()
                    .replace("\n", " ")
                    .replace("#", "");
            System.out.println("LOG : IMG TO TEXT: " + content);
            return content;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    private String buildRequestBody(String imageUrl) {
        // 프롬프트를 이미지 분석과 스토리 창작을 위한 구체적인 지시로 개선
        String detailedPrompt = String.format(
                "이미지를 분석해서 옆의 예시처럼 키워드만 5개 뽑아줘    농부, 부자, 사자, 계란, 친구");
        String requestBody = String.format("""
                {
                    "model": "gpt-4-turbo",
                    "messages": [
                        {
                            "role": "user",
                            "content": [
                                {
                                    "type": "text",
                                    "text": "%s"
                                },
                                {
                                    "type": "image_url",
                                    "image_url": {
                                        "url": "%s"
                                    }
                                }
                            ]
                        }
                    ],
                    "max_tokens": 1000
                }""", detailedPrompt, imageUrl);
        return requestBody;
    }
}