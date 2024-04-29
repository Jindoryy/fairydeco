package com.a402.fairydeco.domain.book.controller;

import com.a402.fairydeco.domain.book.dto.BookChildPictureListResponse;
import com.a402.fairydeco.domain.book.dto.BookDetailResponse;
import com.a402.fairydeco.domain.book.dto.BookLandingListResponse;
import com.a402.fairydeco.domain.book.dto.BookMainListResponse;
import com.a402.fairydeco.domain.book.dto.BookRegister;
import com.a402.fairydeco.domain.book.dto.BookStory;
import com.a402.fairydeco.domain.book.dto.BookStoryDetailResponse;
import com.a402.fairydeco.domain.book.dto.BookTitleUpdateRequest;
import com.a402.fairydeco.domain.book.dto.BookTitleUpdateResponse;
import com.a402.fairydeco.domain.book.service.BookService;
import com.a402.fairydeco.domain.book.service.OpenAiService;
import com.a402.fairydeco.global.common.dto.SuccessResponse;
import com.a402.fairydeco.global.util.FileUtil;
import io.swagger.v3.oas.annotations.Operation;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RequiredArgsConstructor
@RequestMapping("/book")
@RestController
public class BookController {

    private final BookService bookService;
    private final OpenAiService openAiService;
    private FileUtil fileUtil;

    @PostMapping(value = "", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
        public SuccessResponse<BookStory> register(BookRegister bookRegister) throws IOException {
        return new SuccessResponse<>(openAiService.register(bookRegister));
    }

    @PostMapping("test")
    public SuccessResponse<BookStory> test(MultipartFile file) throws IOException {
        fileUtil.uploadFile(file);
        return null;
    }
    @Operation(summary = "최신 동화 목록 20개", description = "메인페이지에서 사용할 최신 동화 목록과 그 정보를 20개 반환한다. 최초 로딩 시 bookId는 0으로 요청한다.")
    @GetMapping("/main-list/{bookId}")
    public SuccessResponse<List<BookMainListResponse>> getBookMainList(@PathVariable Integer bookId) {

        return new SuccessResponse<>(bookService.findBookMainList(bookId));
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

}
