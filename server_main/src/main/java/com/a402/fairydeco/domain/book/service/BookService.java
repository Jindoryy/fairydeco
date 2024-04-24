package com.a402.fairydeco.domain.book.service;


import com.a402.fairydeco.domain.book.dto.BookRegister;
import com.a402.fairydeco.domain.book.dto.BookStory;
import com.a402.fairydeco.domain.book.repository.BookRepository;
import com.a402.fairydeco.global.common.dto.StoryRequest;
import com.a402.fairydeco.global.common.dto.StoryResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class BookService{

    private final BookRepository bookRepository;

    @Value("${openai.model}")
    private String model;
    @Value("${openai.api.url}")
    private String apiURL;
    @Autowired
    private RestTemplate template;


    @Transactional
    public BookStory register(BookRegister bookRegister) throws IOException {
        // 1. 들어온 내용을 바탕으로 동화 등록
        // 2. 프롬프트로 동화 스토리 생성
        // 3. 동화 스토리 save 후 return

        // 이미지가 만약 있을 경우 건희형이 만든 image to text 서비스 메서드 사용해서 한줄 스토리 받음
//        String prompt ="";
//        String pictureName ="";
//        String pictureUrl ="";
//
//        if(bookRegister.getBookPicture() != null){
//            // image to text 메서드
//            // prompt =
////            pictureName =
//        }
//        else{
//            prompt = bookRegister.getBookPrompt();
//        }
//    Book book = Book.builder()
////            .child()
//            .maker(bookRegister.getBookMaker())
//            .genre(bookRegister.getBookGenre())
//            .prompt(prompt)
//            .build();


        // 동화 ai로 제작
            StoryRequest request = new StoryRequest(model, prompt);
        StoryResponse chatGPTResponse =  template.postForObject(apiURL, request, StoryResponse.class);
            return chatGPTResponse.getChoices().get(0).getMessage().getContent();
        }


    }
}
