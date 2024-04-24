package com.a402.fairydeco.domain.book.service;

import com.a402.fairydeco.domain.book.dto.BookRegister;
import com.a402.fairydeco.domain.book.dto.BookStory;

import java.io.IOException;

public interface BookService {

    public BookStory register(BookRegister bookRegister) throws IOException;

}
