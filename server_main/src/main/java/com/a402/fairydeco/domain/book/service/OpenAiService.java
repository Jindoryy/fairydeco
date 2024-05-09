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
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

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

@Service
@Transactional
@RequiredArgsConstructor
public class OpenAiService {
    private final BookRepository bookRepository;
    private final PageRepository pageRepository;
    private final ChildRepository childRepository;
    private final BookService bookService;
    @Value("${openai.model1}")
    private String model1;
    @Value("${openai.model2}")
    private String model2;
    @Value("${openai.api.url}")
    private String apiURL;
    @Value("${openai.api.image}")
    private String openAiImageApiKey;
    private final RestTemplate restTemplate;
    private final FileUtil fileUtil;
    private final HttpClient httpClient = HttpClient.newHttpClient();

    @Transactional
    public Boolean register(BookRegister bookRegister) throws IOException {
        // 1. 들어온 내용을 바탕으로 동화 등록
        // 2. 프롬프트로 동화 스토리 생성
        // 3. 동화 스토리 save 후 return
        // 이미지가 만약 있을 경우 건희형이 만든 image to text 서비스 메서드 사용해서 한줄 스토리 받음
        Child child = childRepository.findById(bookRegister.getChildId()).orElseThrow(() -> new CustomException(ErrorCode.CHILD_NOT_FOUND_ERROR));
        String age = "Y";
        String prompt = "<동화 스토리 작성 프롬프트>\n" +
                "\n" +
                "넌 지금부터 동화 스토리텔링 전문가야. 아래 키워드를 활용하여 많은 사람이 흥미를 느낄만한 글을 작성해 줘야 해. 이 프롬프트를 전송하면 아래의 단계를 진행해 줘.\n" +
                "\n" +
                "1. 씬을 8장 이상으로 나누고 각 씬별 대본을 작성해 줘. 대본은 아래의 구조로 작성해 줘.\n" +
                "\n" +
                "    구조:\n" +
                "    1. 소년이 크리스마스에 석탄을 받습니다. 그는 화를 냅니다! 그는 산타에게 화를 냅니다! 끝!\n" +
                "    2. 소년이 크리스마스에 석탄을 받습니다. 그는 화를 냅니다! 그는 산타에게 화를 냅니다! 끝!\n" +
                "    3. 소년이 크리스마스에 석탄을 받습니다. 그는 화를 냅니다! 그는 산타에게 화를 냅니다! 끝!\n" +
                "    4. 소년이 크리스마스에 석탄을 받습니다. 그는 화를 냅니다! 그는 산타에게 화를 냅니다! 끝!\n" +
                "    5. 소년이 크리스마스에 석탄을 받습니다. 그는 화를 냅니다! 그는 산타에게 화를 냅니다! 끝!\n" +
                "    6. 소년이 크리스마스에 석탄을 받습니다. 그는 화를 냅니다! 그는 산타에게 화를 냅니다! 끝!\n" +
                "    7. 소년이 크리스마스에 석탄을 받습니다. 그는 화를 냅니다! 그는 산타에게 화를 냅니다! 끝!\n" +
                "    8. 소년이 크리스마스에 석탄을 받습니다. 그는 화를 냅니다! 그는 산타에게 화를 냅니다! 끝!\n" +
                "\n" +
                "2. 답변 형식 (답변에 대한 참고 자료야. 형식만 참고하되 아이디어는 직접 구성해줘.):\n" +
                "        1. 옛날 옛적, '크리스탈리아'라는 작은 마을에는 거대한 다이아몬드 거인이 살고 있었습니다. 거인은 온몸이 반짝이는 보석으로 덮여 있어 언제나 눈부신 빛을 발하고 있었지요. 하지만 거인은 자신의 아름다움 때문에 마을 사람들이 겁을 먹고 자신과 친구가 되려 하지 않는다는 사실에 깊은 슬픔을 느꼈습니다. 끝!\n" +
                "        2. 어느 날, 거인은 마을 사람들과 친구가 되기 위해 자신의 보석을 나눠주기로 결심했습니다. 보석으로 만든 집과 도구들을 마을 사람들과 나누며 그들의 삶을 편안하게 만들었습니다. 끝!\n" +
                "        3. 그러나 보석을 나눠주면서 거인은 점점 작아져 갔고, 마침내는 마을 사람들과 비슷한 크기가 되었습니다. 이제 거인은 마을 사람들과 어울리며 행복한 시간을 보낼 수 있었습니다. 끝!\n" +
                "        4. 거인의 아름다움은 그의 외모가 아니라 그의 따뜻한 마음에서 비롯된 것임을 마을 사람들도 깨달았습니다. 그리고 거인은 '다이아몬드 거인'으로 불리며 사랑과 우정을 받았습니다. 끝!\n" +
                "        5. 이야기는 거인이 선물한 사랑과 우정이 얼마나 소중한지를 알려주며, 외모보다 마음의 아름다움이 중요하다는 교훈을 전합니다. 끝!\n" +
                "        6. 마을 사람들은 거인의 이야기를 세대를 거쳐 전해왔고, 모두가 그의 따뜻한 마음을 기억하며 행복한 추억으로 남았습니다. 끝!\n" +
                "        7. 이 동화는 우리에게 외모가 아닌 마음이 진정한 아름다움임을 일깨워 주는 이야기로, 아이들에게 큰 교훈을 줄 수 있을 것입니다. 끝!\n" +
                "        8. 마을 사람들은 거인의 이야기를 기억하며, 사랑과 우정을 중요시하는 소중한 가르침을 받았습니다. 끝!\n" +
                "\n" +
                "3. 주의사항:\n" +
                "    *도입부: 2초 내로 사람들의 흥미를 유발할 수 있는 문구나 주제를 넣어줘.\n" +
                "    *결말: 유머나 반전나 교훈을 주는 식으로 마무리 해줘.\n" +
                "    *각 씬의 대본은 끝에는 끝! 이 단어를 넣어서 8장 이상으로 무조건 나누고 구체적으로 작성해야해. 그리고 한글로 작성해야해.\n" +
                "    *많은 사람들이 좋아하고 관심있어 하는 대중적이고 유명한 키워드를 중간 중간 넣어줘.\n" +
                "    *대본은 디테일이 중요해. 필요한 단어나 배경지식이 있다면 외부에서 검색해서 스토리의 완성도를 더 깊이있게 만들어줘";
        if ((LocalDate.now().getYear() - Integer.parseInt(child.getBirth().toString().substring(0, 4))) > 5) {
            age = "O";
        }
        // 이미지 null이면 키워드 그냥 더하고
        // 이미지 있으면 이미지 따로저장 + 이미지분석으로 키워드 가져옴
        // image to text 메서드
        ImgPromptDto imgPromptDto = createPromptKidImg(bookRegister.getBookPicture());
        Book book = Book.builder()
                .child(childRepository.findById(bookRegister.getChildId()).orElseThrow((() -> new CustomException(ErrorCode.BOOK_NOT_FOUND_ERROR))))
                .name(bookRegister.getBookMaker() + "의 이야기")
                .maker(bookRegister.getBookMaker())
                .prompt(imgPromptDto.getPrompt())
                .pictureUrl(imgPromptDto.getImageUrl())
                .pictureName(imgPromptDto.getImageName())
                .recommendAge(RecommendAge.valueOf(age))
                .build();
        Book savedBook = bookRepository.save(book);
        // 동화 ai로 제작
        String gender = "남";
        if (child.getGender().toString().equals("WOMAN")) {
            gender = "여";
        }
       if(age.equals("Y")){
           prompt += "\n\n 쉬운단어로 각 대본은 50자 정도로 무조건 8컷 이상 만들어줘. 키워드 :" + savedBook.getPrompt();
       }
       else{
           prompt += "\n\n 쉬운단어로 각 대본은 150자 정도로 무조건 8컷 이상 만들어줘. 키워드 :" + savedBook.getPrompt();
       }
        // 스토리 생성
        // 프롬프트는 그대로 while 문으로 8컷 이하시 재생성
        String[] bookStories;
        String model = model1;
        if (age.equals("O")) {
            model = model2;
        }
        while (true) {
            // 나이가 어리면 model1으로
            // 나이 많으면 model2로 실행
            StoryRequest request = new StoryRequest(model, prompt);
            StoryResponse storyResponse = restTemplate.postForObject(apiURL, request, StoryResponse.class);
            String story = storyResponse.getChoices().get(0).getMessage().getContent();
            System.out.println(story);
            String[] tmp = story.split("\n");
            if(tmp.length<7){
                continue;
            }
            story += "\n\n 동화체로 바꿔주고 구조는 유지하되 존댓말로 4살 아이가 보기에 자연스럽게 바꿔줘";
             request = new StoryRequest(model, story);
             storyResponse = restTemplate.postForObject(apiURL, request, StoryResponse.class);
            story = storyResponse.getChoices().get(0).getMessage().getContent();
            bookStories = story.split("끝!"); // 8개로 나눔
            System.out.println(story);
            if (bookStories.length >= 7) {
                break;
                // 8개가 아니라면 루프를 다시 시작
            }
        }
        // 앞에 1. , 2. 지우는 작업
        for (int i = 0; i < bookStories.length; i++) {
            bookStories[i] = bookStories[i].trim();
            int tmp = i + 1;
                for(int j=0;j<bookStories[i].length();j++){
                    if(bookStories[i].substring(j,j+1).equals(".")){
                        bookStories[i] = bookStories[i].substring(j+1,bookStories[i].length());
                        break;
                    }
                }
        }
        // 각 page 8개 db에 저장하는 작업
        for (int i = 0; i < bookStories.length; i++) {
            Page page = Page.builder()
                    .book(bookRepository.findById(savedBook.getId()).orElseThrow(() -> new CustomException(ErrorCode.BOOK_NOT_FOUND_ERROR)))
                    .story(bookStories[i]) //공백제거
                    .build();
            pageRepository.save(page);
        }
        BookCreateRequestDto bookCreateRequestDto = BookCreateRequestDto.builder()
                .bookId(savedBook.getId())
                .build();

        if(bookService.createBookImage(bookCreateRequestDto)){
            return true;
        }
        return false;
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