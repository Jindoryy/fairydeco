package com.a402.fairydeco.domain.book.controller;

import com.a402.fairydeco.domain.book.dto.BookRegister;
import com.a402.fairydeco.domain.book.dto.BookStory;
import com.a402.fairydeco.domain.book.service.BookService;
import com.a402.fairydeco.global.common.dto.SuccessResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RequiredArgsConstructor
@RequestMapping("/book")
@RestController
public class BookController {

    private final BookService bookService;


    @PostMapping("")
        public SuccessResponse<BookStory> register(BookRegister bookRegister) throws IOException {
//        bookService.
        return new SuccessResponse<>(bookService.register(bookRegister));
    }

}
