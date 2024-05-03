package com.a402.fairydeco.domain.book.service;

import com.a402.fairydeco.domain.book.dto.BookRegister;
import com.a402.fairydeco.domain.book.dto.BookStory;
import com.a402.fairydeco.domain.book.dto.GenreStatus;
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
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

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
    private final RestTemplate restTemplate;
    private final FileUtil fileUtil;

    @Transactional
    public BookStory register(BookRegister bookRegister) throws IOException {
        // 1. 들어온 내용을 바탕으로 동화 등록
        // 2. 프롬프트로 동화 스토리 생성
        // 3. 동화 스토리 save 후 return

        // 이미지가 만약 있을 경우 건희형이 만든 image to text 서비스 메서드 사용해서 한줄 스토리 받음

        String pictureName = "";
        String pictureUrl = "";
        Child child = childRepository.findById(bookRegister.getChildId()).orElseThrow(() -> new CustomException(ErrorCode.CHILD_NOT_FOUND_ERROR));
        String prompt = "넌 지금부터 스토리텔링 전문가야. 많은 사람이 흥미를 느낄만한 글을 작성해 줘야 해. 장르에 맞는 씬을 최소 8페이지로 나누고 각 대본의 끝에는 끝! 이 단어를 넣어서 각각 최소 250자 이상 작성해줘.";
        Book savedBook;
        // 이미지 null이면 프롬프트로 그냥 더하고
        // 이미지 있으면 이미지 따로저장 + 이미지분석으로 prompt 가져옴
        if (bookRegister.getBookPicture() != null) {
            // image to text 메서드
//             prompt =
            Book book = Book.builder()
                    .child(childRepository.findById(bookRegister.getChildId()).orElseThrow((() -> new CustomException(ErrorCode.BOOK_NOT_FOUND_ERROR))))
                    .maker(bookRegister.getBookMaker())
                    .genre(GenreStatus.valueOf(bookRegister.getBookGenre()))
                    .prompt(prompt)
//                    .pictureUrl(fileUtil.uploadFile(bookRegister.getBookPicture()))
//                    .pictureName(bookRegister.getBookPicture().getOriginalFilename())
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
        String hero = savedBook.getMaker();
        if(savedBook.getMaker().length() == 3){hero = savedBook.getMaker().substring(1,3);}
        else if(savedBook.getMaker().length() ==2){hero = savedBook.getMaker().substring(1,2);}
        else if(savedBook.getMaker().length() == 4){hero = savedBook.getMaker().substring(2,4);}
        String genre ="판타지";
        if(savedBook.getGenre().toString().equals("ADVENTURE")){genre = "모험";}
        else if(savedBook.getGenre().toString().equals("MYSTERY")){genre = "미스테리";}
        else if(savedBook.getGenre().toString().equals("ROMANCE")){genre = "로맨스";}
        String gender = "남";
        if(child.getGender().toString().equals("WOMAN")){gender = "여";}


        prompt += "장르는 " + genre + ", 주인공은 "+hero+", "+(LocalDate.now().getYear() - Integer.parseInt(child.getBirth().toString().substring(0,4)))+"살 "+gender+"자 아이가 보기 좋은 동화를 8컷으로 만들어줘  "+ ", 줄거리는 " + savedBook.getPrompt();
        // 스토리 생성
        StoryRequest request = new StoryRequest(model, prompt);
        StoryResponse storyResponse = restTemplate.postForObject(apiURL, request, StoryResponse.class);
        String story = storyResponse.getChoices().get(0).getMessage().getContent();

        String[] bookStories = story.split("끝!"); // 8개로 나눔
        Page[] pages = new Page[8];
        PageStory[] pageStories = new PageStory[8];
        for(int i = 0;i<bookStories.length;i++){
            System.out.println(bookStories[i]);
        }
        // 먼저 만들어진 story를 8개로 나눈후에
        for (int i = 0; i < bookStories.length; i++) {
            Page page = Page.builder()
                    .book(bookRepository.findById(savedBook.getId()).orElseThrow(() -> new CustomException(ErrorCode.BOOK_NOT_FOUND_ERROR)))
                    .story(bookStories[i].trim().substring(3,bookStories[i].trim().length()).replaceAll("\r\n", " ")) //공백제거
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

}
