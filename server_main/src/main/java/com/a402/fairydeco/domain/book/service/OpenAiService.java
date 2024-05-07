package com.a402.fairydeco.domain.book.service;
import com.a402.fairydeco.domain.book.dto.BookRegister;
import com.a402.fairydeco.domain.book.dto.BookStory;
import com.a402.fairydeco.domain.book.dto.GenreStatus;
import com.a402.fairydeco.domain.book.dto.ImgPromptDto;
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
import org.apache.commons.logging.Log;
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
    @Value("${openai.model}")
    private String model;
    @Value("${openai.api.url}")
    private String apiURL;
    @Value("${openai.api.image}")
    private String openAiImageApiKey;
    private final RestTemplate restTemplate;
    private final FileUtil fileUtil;
    private final HttpClient httpClient = HttpClient.newHttpClient();
    @Transactional
    public BookStory register(BookRegister bookRegister) throws IOException {
        // 1. 들어온 내용을 바탕으로 동화 등록
        // 2. 프롬프트로 동화 스토리 생성
        // 3. 동화 스토리 save 후 return
        // 이미지가 만약 있을 경우 건희형이 만든 image to text 서비스 메서드 사용해서 한줄 스토리 받음
        Child child = childRepository.findById(bookRegister.getChildId()).orElseThrow(() -> new CustomException(ErrorCode.CHILD_NOT_FOUND_ERROR));
        String prompt = "넌 지금부터 스토리텔링 전문가야. 많은 사람이 흥미를 느낄만한 글을 작성해 줘야 해. 장르에 맞는 씬을 최소 8페이지로 나누고 각 대본의 끝에는 끝! 이 단어를 넣어서 각각 최소 250자 이상 작성해줘.";
        Book savedBook;
        // 이미지 null이면 프롬프트로 그냥 더하고
        // 이미지 있으면 이미지 따로저장 + 이미지분석으로 prompt 가져옴
        if (bookRegister.getBookPicture() != null) {
            // image to text 메서드
            ImgPromptDto imgPromptDto = createPromptKidImg(bookRegister.getBookPicture());
            Book book = Book.builder()
                    .child(childRepository.findById(bookRegister.getChildId()).orElseThrow((() -> new CustomException(ErrorCode.BOOK_NOT_FOUND_ERROR))))
                    .name(bookRegister.getBookMaker()+"의 이야기")
                    .maker(bookRegister.getBookMaker())
                    .genre(GenreStatus.valueOf(bookRegister.getBookGenre()))
                    .prompt(imgPromptDto.getPrompt())
                    .pictureUrl(imgPromptDto.getImageUrl())
                    .pictureName(imgPromptDto.getImageName())
                    .build();
            savedBook = bookRepository.save(book);
        } else {
            Book book = Book.builder()
                    .child(childRepository.findById(bookRegister.getChildId()).orElseThrow(() -> new CustomException(ErrorCode.CHILD_NOT_FOUND_ERROR)))
                    .name(bookRegister.getBookMaker()+"의 이야기")
                    .maker(bookRegister.getBookMaker().replaceAll(" ",""))
                    .genre(GenreStatus.valueOf(bookRegister.getBookGenre()))
                    .prompt(bookRegister.getBookPrompt())
                    .build();
            savedBook = bookRepository.save(book);
        }
        // 동화 ai로 제작
        String hero = "";
        if(savedBook.getMaker().length() == 3){
            hero = savedBook.getMaker().substring(1,3);
        }
        else if(savedBook.getMaker().length() ==2){
            hero = savedBook.getMaker().substring(1,2);
        }
        else if(savedBook.getMaker().length() == 4){
            hero = savedBook.getMaker().substring(2,4);
        }
        else{
            hero = savedBook.getMaker();
        }
        String genre ="";
        if(savedBook.getGenre().toString().equals("ADVENTURE")){
            genre = "모험";
        }
        else if(savedBook.getGenre().toString().equals("MYSTERY")){
            genre = "미스테리";
        }
        else if(savedBook.getGenre().toString().equals("ROMANCE")){
            genre = "로맨스";
        }
        else{
            genre = "판타지";
        }
        String gender = "남";
        if(child.getGender().toString().equals("WOMAN")){
            gender ="여";
        }
        prompt += "장르는 " + genre + ", 주인공은 "+hero+", "+(LocalDate.now().getYear() - Integer.parseInt(child.getBirth().toString().substring(0,4)))+"살 "+ gender+"자 아이가 보기 좋은 동화를 8컷으로 만들어줘  "+ ", 줄거리는 " + savedBook.getPrompt();
        // 스토리 생성
        System.out.println(prompt);
        // 프롬프트는 그대로 while 문으로 8컷 이하시 재생성
        String[] bookStories;
        while (true) {
            StoryRequest request = new StoryRequest(model, prompt);
            StoryResponse storyResponse = restTemplate.postForObject(apiURL, request, StoryResponse.class);
            String story = storyResponse.getChoices().get(0).getMessage().getContent();

            bookStories = story.split("끝!"); // 8개로 나눔
            if (bookStories.length == 8) {
                break;
                // 8개가 아니라면 루프를 다시 시작
            }
        }
        Page[] pages = new Page[8];
        PageStory[] pageStories = new PageStory[8];
        for(int i = 0;i<bookStories.length;i++){
            System.out.println(bookStories[i]);
        }
        // 먼저 만들어진 story를 8개로 나눈후에
        for (int i = 0; i < bookStories.length; i++) {
            Page page = Page.builder()
                    .book(bookRepository.findById(savedBook.getId()).orElseThrow(() -> new CustomException(ErrorCode.BOOK_NOT_FOUND_ERROR)))
                    .story(bookStories[i].trim().substring(3,bookStories[i].trim().length())) //공백제거
                    .build();
            pages[i] = pageRepository.save(page);
            // pages를 save하면서 동시에 pageStory형태로 builder
            pageStories[i] = PageStory.builder()
                    .pageId(pages[i].getId())
                    .pageStory(pages[i].getStory())
                    .build();
        }
        // 이제 return 데이터 builder 진행
        BookStory bookStory = BookStory.builder()
                .bookId(savedBook.getId())
                .bookName(savedBook.getName())
                .pageStory(pageStories)
                .build();
        return bookStory;
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
            System.out.println("LOG : IMG TO TEXT: "+content);
            return content;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
    private String buildRequestBody(String imageUrl) {
        // 프롬프트를 이미지 분석과 스토리 창작을 위한 구체적인 지시로 개선
        String detailedPrompt = String.format(
                "이 이미지를 보고 어린이들이 즐길 수 있는 간단한 동화 스토리를 만들어주세요. "
                        + "이미지를 통해 보여지는 요소들을 활용하여, 모험이나 교훈적인 요소를 포함시켜주세요."
                        + "주인공의 이름은 필요 없어요, 이 스토리를 기반으로 동화를 새로 만들거에요. 그래서 주인공 이름은 필요 없어요."
                        + "다른 설명은 필요 없어요. 동화 내용만 알려주면 되요.");
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