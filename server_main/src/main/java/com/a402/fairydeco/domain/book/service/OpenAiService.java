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
        if (promptTmp.length != 5) {
            System.out.println("키워드 분석 실패");
            return null;
        }
        String prompt = "너는 동화 작가야. 너가 동화를 잘 써주면 내가 1억달러를 줄게. \n" +
                "내가 키워드를 주면 그것들과 관련된 동화를 만들어 주면 돼.\n" +
                "양식은 다음과 같아.\n" +
                "\n" +
                "키워드 : " + imgPromptDto.getPrompt() + "\n" +
                "양식은 JSON 포맷이야\n" +
                "```\n\n" +
                "{\n" +
                "   \"등장인물\" : [\n" +
                "    {\n" +
                "      \"이름1\" : \"인물 정보1\",\n" +
                "    },\n" +
                "    {\n" +
                "       \"이름2\" : \"인물 정보2\",\n" +
                "    },\n" +
                "    ........\n" +
                "   ],\n" +
                "   \"제목\" : ,\n" +
                "   \"내용 배열\" : [ \"내용 1\", \"내용 2\", ... ],\n" +
                "}\n\n" +
                "```\n" +
                "키워드 중에 동물이나 사람을 등장인물로 해줘.\n" +
                "인물 정보에 인물의 외관적 특징을 최대한 자세히 묘사해줘\n";

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
        // 프롬프트 나이대별 생성
        if (age.equals("Y")) {
            prompt += "스토리는 내용 8개 정도로 한 내용은 2~3줄 정도로 짧게 구성\n" +
                    "3~5세 아이를 위한 동화라 내용은 흥미를 유발하지만 이해도는 크게 필요없는 내용으로 써줘\n" +
                    "문맥이 어색하지 않도록, 내용이 이어지도록 구성해줘\n" +
                    "그리고 단어는 3~5세 아동들이 이해 할 수 있는 쉬운 단어를 사용하고 어투는 다정한 ~했답니다 등의 부드러운 말투를 사용해줘 말투가 고정적일 필요는 없어\n" +
                    "\n" +
                    "시뮬레이션 하고 결과물만 출력해줘 다른 멘트는 하지마";
        } else {
            prompt += "스토리는 내용 8개 정도로 한 내용은 5~6줄 정도로 구성\n" +
                    "6~7세 아이를 위한 동화라 내용은 창의적이고 교육적인 내용으로 작성해줘\n" +
                    "문맥이 어색하지 않도록, 내용이 이어지도록 구성해줘\n" +
                    "그리고 단어는 6~7세 아동들이 이해 할 수 있는 쉬운 단어를 사용하고 어투는 다정한 ~했답니다 등의 부드러운 말투를 사용해줘 말투가 고정적일 필요는 없어\n" +
                    "\n" +
                    "시뮬레이션 하고 결과물만 출력해줘 다른 멘트는 하지마";
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
                    // '''json과 ''' 사이의 부분의 인덱스 찾기
                    if(!story.substring(0,1).equals("{")){
                        story = story.substring(8,story.length()-4);
                        System.out.println(story);
                    }
                    ObjectMapper objectMapper = new ObjectMapper();
                    // JSON 문자열을 JsonNode로 읽어오기
                    JsonNode jsonNode = objectMapper.readTree(story);
                    // "내용 배열"에 해당하는 JsonNode 가져오기
                    JsonNode contentArrayNode = jsonNode.get("내용 배열");
                    // JsonNode를 배열로 변환
                    bookStories = objectMapper.treeToValue(contentArrayNode, String[].class);

                    // JSON 문자열을 JsonElement로 파싱
//                    JsonElement jsonElement = JsonParser.parseString(story);
//                    // JsonElement에서 JsonObject 추출
//                    JsonObject jsonObject = jsonElement.getAsJsonObject();
//                    // "내용 배열"에 해당하는 JsonArray 추출
//                    JsonArray storyList = jsonObject.getAsJsonArray("내용 배열");
                    // JsonArray를 배열로 변환
//                    bookStories = new Gson().fromJson(storyList, String[].class);
                    System.out.println(bookStories.length);
                    if (bookStories.length < 8) {
                        continue;
                    }

                    for (String tmp : bookStories) {
                        System.out.println(tmp);
                    }
                    break;
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