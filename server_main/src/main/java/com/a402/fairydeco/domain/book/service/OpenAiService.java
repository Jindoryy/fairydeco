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
import java.util.List;
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
        if (promptTmp.length < 5) {
            System.out.println("키워드 분석 실패");
            return null;
        }
        String prompt = "너는 동화 작가야. 너가 동화를 잘 써주면 내가 1억달러를 줄게. \n" +
                "내가 키워드를 주면 키워드로 재미있는 동화를 만들어 주면 돼.\n" +
                "양식은 다음과 같아.\n" +
                "\n" +
                "키워드는" + imgPromptDto.getPrompt() + "\n" +
                "양식은 JSON 포맷이야\n" +
                "```\n\n" +
                "{\n" +
                " \"pages\": [\n" +
                "                  {\n" +
                "                    \"pageNumber\": 1,\n" +
                "                    \"imagePrompt\": \"장면묘사1\",\n" +
                "           \"pageStory\" : \"장면 별 스토리1\"\n" +
                "                  },\n" +
                "                   {\n" +
                "                    \"pageNumber\": 2,\n" +
                "                    \"imagePrompt\": \"장면묘사2\",\n" +
                "           \"pageStory\" : \"장면 별 스토리2\"\n" +
                "                  },\n" +
                "                  .....\n" +
                "                \"pageNumber\": 8,\n" +
                "                \"imagePrompt\": \"장면묘사8\",\n" +
                "                \"pageStory\" : \"장면 별 스토리8\"\n " +
                "                ]" +
                "}\n" +
                "```\n" +
//                "인물 정보에 인물의 외관적 특징을 최대한 자세히 묘사해줘\n" +
                "\"imagePrompt\"는 스토리로 stable diffusion이미지 생성 프롬포트를 만들거야. 페이지 별 스토리에 적합한 이미지를 만들기 위해서 필요한 각 등장인물의 생김새(사람이라면 피부색, 성별, 인종, 머리색, 성인 인지 청소년인지 / 동물이라면 어떤 동물인지, 어떤 색인지), 사물의 색, 배경 등 영어로 구체적으로 프롬포트를 적어줘. 등장인물의 이름은 stable diffusion이 인식을 못 하기 때문에 등장인물은 일반 명사로 적어줘야해(예시 child with red curly hair, gree monkey with black cap) 같은 등장인물이라면 모든 페이지에 일관된 모습으로 나와야 해 다른 페이지여도 등장인물의 생김새는 동일해야해. 추가로 등장인물들이 프롬포트에 누락되는 경우가 있기 때문에 프롬포트에 등장하는 인물들은 문장뒤에 추가로, 추가해줘\n";

        Book book = Book.builder()
                .child(childRepository.findById(child.getId()).orElseThrow((() -> new CustomException(ErrorCode.BOOK_NOT_FOUND_ERROR))))
                .name(child.getName() + "의 이야기")
                .maker(child.getName())
                .prompt(imgPromptDto.getPrompt())
                .pictureUrl(imgPromptDto.getImageUrl())
                .pictureName(imgPromptDto.getImageName())
                .complete(CompleteStatus.STORY)
                .recommendAge(RecommendAge.valueOf(age))
                .build();
        Book savedBook = bookRepository.save(book);
        bookRepository.flush();
        // 프롬프트 나이대별 생성
        String[] content = {"자신의 실수를 인정하고 사과하는", "거짓말한 것을 후회하는", "포기하지 않고 열심히 노력해서 결국 성공하는", "두려움을 이겨내고 극복하는", "위험을 고려해서 현명한 결정을 내리는", "행동하기 전에 신중하게 고민해보는",
                "자기 능력을 과신하다가 큰 실수를 저지르는", "나쁜 마음씨를 갖고 살면 벌을 받고, 착하게 살면 복을 받는다는", "다른 사람들의 이야기를 듣고 그들의 경험을 통해 배우는", "현상을 관찰하고 자연의 흐름을 이해함으로 깊은 이해를 얻는",
                "자신을 돌아보고 분석함으로 깨달음을    얻는", "용기를 내어 꿈을 향해 나아가는"};

        if (age.equals("Y")) {
            prompt += "pages의 크기는 8개로 각 \"pageStory\"는 한글로 2~3문장 정도로 짧게 구성해줘.\n" +
                    "3~5세 아이를 위한 동화라 내용이 전체적으로 어색하지 않고 흥미를 유발하며 창의적인 내용으로 구성해줘.\n" +
                    "그리고 단어는 3~5세 아동들이 이해 할 수 있는 쉬운 단어를 사용하고 말투는 다정하게 ~했지요 등의 부드러운 말투를 사용해줘 말투가 고정적일 필요는 없어\n" +
                    "\n" +
                    "충분히 시뮬레이션 하고 결과물만 출력해줘 다른 멘트는 하지마";
        } else {
            prompt += "pages의 크기는 8개로 각 \"pageStory\"는 한글로 5~7문장 정도로 구성해줘\n" +
                    "6~7세 아이를 위한 동화라 " + content[(int) (Math.random() * content.length)] + " 내용으로 작성해줘\n" +
                    "문맥이 어색하지 않고 내용이 전체적으로 이어지도록 구성해줘\n" +
                    "그리고 단어는 6~7세 아이들이 이해 할 수 있는 쉬운 단어를 사용하고 말투는 다정한 ~했답니다 등의 부드러운 말투를 사용해줘 말투가 고정적일 필요는 없어\n" +
                    "\n" +
                    "충분히 시뮬레이션 하고 결과물만 출력해줘 다른 멘트는 하지마";
        }
        // 스토리 생성
        // 프롬프트는 그대로 while 문으로 8컷 이하시 재생성
        String finalPrompt = prompt;
        return CompletableFuture.supplyAsync(() -> {
            try {
                String model = model1;
                if (age.equals("O")) {
                    model = model2;
                }
                JsonNode pagesNode;
                while (true) {
                    // 나이가 어리면 model1으로
                    // 나이 많으면 model2로 실행
                    StoryRequest request = new StoryRequest(model, finalPrompt);
                    StoryResponse storyResponse = restTemplate.postForObject(apiURL, request, StoryResponse.class);
                    String story = storyResponse.getChoices().get(0).getMessage().getContent();
                    // '''json과 ''' 사이의 부분의 인덱스 찾기
                    System.out.println("생성완료");
                    if (!story.substring(0, 1).equals("{")) {
                        story = story.substring(8, story.length() - 4);
                    }
                    ObjectMapper objectMapper = new ObjectMapper();
                    // JSON 문자열을 JsonNode로 읽어오기
                    JsonNode jsonNode = objectMapper.readTree(story);
                    // "pages"에 해당하는 JsonNode 가져오기
                    pagesNode = jsonNode.get("pages");
                    // JsonNode를 배열로 변환
                    System.out.println(pagesNode.size());
                    if (pagesNode.size() < 8) {
                        continue;
                    }
                    break;
                }
                String[] pageStories = new String[pagesNode.size()];
                String[] imagePrompt = new String[pagesNode.size()];
                // pages의 배열에서 각각 인자 배열에 저장
                for (int i = 0; i < pagesNode.size(); i++) {
                    JsonNode pageNode = pagesNode.get(i);
                    // 각각 인자에 넣음
                    pageStories[i] = pageNode.get("pageStory").asText();
                    imagePrompt[i] = pageNode.get("imagePrompt").asText();
                    System.out.println(pageStories[i]);
                }
                // 각 page 8개 db에 저장하는 작업
                for (int i = 0; i < pageStories.length; i++) {
                    // 목소리 파일 생성 후 s3 저장
                    File voice = voiceUtil.createVoice(pageStories[i]);
                    Page page = Page.builder()
                            .book(savedBook)
                            .story(pageStories[i])
                            .imagePrompt(imagePrompt[i])
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

    public void updateStatus(int bookId) {
        Book book = bookRepository.findById(bookId).orElseThrow(() -> new CustomException(ErrorCode.BOOK_NOT_FOUND_ERROR));
        book.updateBookStatus(CompleteStatus.IMAGE);
        System.out.println(book.getComplete());
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
                "이미지를 분석해서 양식처럼 한글로 키워드만 5개 뽑아줘. 키워드 사이에 ,가 들어가는 양식은 무조건 지켜야해. 사람, 동물, 사물을 인식하고 사람은 이름을 지어줘. 그리고 색이 있으면 키워드에 같이 붙여줘. 양식: 키워드1, 키워드2, 키워드3, 키워드4, 키워드5");

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