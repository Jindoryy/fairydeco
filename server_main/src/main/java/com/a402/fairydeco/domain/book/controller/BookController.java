package com.a402.fairydeco.domain.book.controller;

import com.a402.fairydeco.domain.book.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RequestMapping("/book")
@RestController
public class BookController {


    private final BookService bookService;


}
