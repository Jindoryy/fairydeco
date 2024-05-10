package com.a402.fairydeco.domain.book.controller;

import com.a402.fairydeco.domain.book.dto.*;
import com.a402.fairydeco.domain.book.dto.BookChildPictureListResponse;
import com.a402.fairydeco.domain.book.dto.BookDetailResponse;
import com.a402.fairydeco.domain.book.dto.BookLandingListResponse;
import com.a402.fairydeco.domain.book.dto.BookMainListResponse;
import com.a402.fairydeco.domain.book.dto.BookRegister;
import com.a402.fairydeco.domain.book.dto.BookStoryDetailResponse;
import com.a402.fairydeco.domain.book.dto.BookTitleUpdateRequest;
import com.a402.fairydeco.domain.book.dto.BookTitleUpdateResponse;
import com.a402.fairydeco.domain.book.entity.Book;
import com.a402.fairydeco.domain.book.service.BookService;
import com.a402.fairydeco.domain.book.service.OpenAiService;
import com.a402.fairydeco.global.common.dto.SuccessResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutionException;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
@RequiredArgsConstructor
@RequestMapping("/book")
@Tag(name = "Book", description = "동화 API")
public class BookController {

    private final BookService bookService;
    private final OpenAiService openAiService;
    private final Map<Integer, SseEmitter> sseEmitters = new ConcurrentHashMap<>();

    @Operation(summary = "동화 만들기", description = "들어오는 이미지를 통해 스토리 생성 및 이미지 생성")
    @PostMapping(value = "", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public SuccessResponse<?> register(BookRegister bookRegister) throws IOException {
        CompletableFuture<BookCreateRequestDto> future = openAiService.register(bookRegister);
        future.thenRun(() -> {
            try {
                BookCreateRequestDto result = future.get(); // 비동기 작업의 결과 가져오기
                bookService.createBookImage(result);
            } catch (InterruptedException | ExecutionException e) {
                e.printStackTrace();
            }
        });
        return new SuccessResponse<>(HttpStatus.OK.value());
    }


    @Operation(summary = "아이 나이에 맞는 동화 + 샘플 동화", description = "책장에서 보여줄 최신 동화 목록과 샘플 동화 목록을 반환한다.")
    @GetMapping("/main-list/{childId}")
    public SuccessResponse<BookMainListResponse> getBookMainList(@PathVariable Integer childId) {

        return new SuccessResponse<>(bookService.findBookMainList(childId));
    }

    @Operation(summary = "최신 동화 표지목록 20개", description = "랜딩페이지에서 사용할 최신 동화 표지목록 20개를 반환한다.")
    @GetMapping("/landing-list")
    public SuccessResponse<List<BookLandingListResponse>> getBookLandingList() {

        return new SuccessResponse<>(bookService.findBookLandingList());
    }

    @Operation(summary = "동화 제목 수정", description = "동화의 제목을 수정한다.")
    @PutMapping("/title")
    public SuccessResponse<BookTitleUpdateResponse> updateBookTitle(@RequestBody BookTitleUpdateRequest bookTitleUpdateRequest) {

        return new SuccessResponse<>(bookService.modifyBookTitle(bookTitleUpdateRequest));
    }

    @Operation(summary = "아이의 그림동화 목록", description = "아이의 그림이 있는 동화의 목록을 반환한다.")
    @GetMapping("/child-picture-list/{childId}")
    public SuccessResponse<List<BookChildPictureListResponse>> getChildPictureList(@PathVariable Integer childId) {

        return new SuccessResponse<>(bookService.findBookChildPictureList(childId));
    }

    @Operation(summary = "스토리 디테일", description = "마이페이지에서 STORY 단계의 동화를 클릭했을 때 필요한 동화 정보를 반환한다.")
    @GetMapping("/story-detail/{bookId}")
    public SuccessResponse<BookStoryDetailResponse> getBookStoryDetail(@PathVariable Integer bookId) {

        return new SuccessResponse<>(bookService.findBookStory(bookId));
    }

    @Operation(summary = "동화 디테일", description = "완성된 동화 정보를 반환한다.")
    @GetMapping("/book-detail/{bookId}")
    public SuccessResponse<BookDetailResponse> getBookDetail(@PathVariable Integer bookId) {

        return new SuccessResponse<>(bookService.findBook(bookId));
    }

    @Operation(summary = "동화 생성 완료 알림", description = "생성 완료된 동화 알림 수신")
    @GetMapping("/end")
    public SuccessResponse<?> bookComplete(@RequestParam Integer userId, @RequestParam Integer bookId) {
        //테스트 완료 되면 서비스 코드 분리 진행하겠습니다.
        System.out.println("동화 생성 완료: " + bookId);
        Book book = bookService.getBookById(bookId);
        SseEmitter emitter = sseEmitters.get(userId);
        if (emitter != null) {
            try {
                Map<String, Object> data = new HashMap<>();
                data.put("bookId", book.getId());
                data.put("bookName", book.getName());
                data.put("bookCoverUrl", book.getCoverUrl());

                emitter.send(SseEmitter.event().name("book-complete").data(new ObjectMapper().writeValueAsString(data)));
                emitter.complete();
            } catch (IOException e) {
                sseEmitters.remove(bookId);
            }
        }
        return new SuccessResponse<>(null);
    }

    @Operation(summary = "SSE 구독", description = "SSE로 동화 생성 완료 알림 구독")
    @GetMapping("/sse/{userId}")
    public ResponseEntity<SseEmitter> subscribeToBookCreation(@PathVariable Integer userId) {
        //테스트 완료 되면 서비스 코드 분리 진행하겠습니다.
        SseEmitter sseEmitter = new SseEmitter(0L); // 0L로 설정하여 연결 무기한 유지
        sseEmitters.put(userId, sseEmitter);
        sseEmitter.onCompletion(() -> sseEmitters.remove(userId));
        sseEmitter.onTimeout(() -> sseEmitters.remove(userId));

        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_TYPE, "text/event-stream; charset=UTF-8");

        return ResponseEntity.ok().contentType(MediaType.TEXT_EVENT_STREAM).body(sseEmitter);
    }
}
