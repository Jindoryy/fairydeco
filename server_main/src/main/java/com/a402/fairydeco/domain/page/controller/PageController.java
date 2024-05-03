package com.a402.fairydeco.domain.page.controller;

import com.a402.fairydeco.domain.book.dto.BookRegister;
import com.a402.fairydeco.domain.book.dto.BookStory;
import com.a402.fairydeco.domain.book.service.BookService;
import com.a402.fairydeco.domain.page.dto.StoryUpdate;
import com.a402.fairydeco.domain.page.service.PageService;
import com.a402.fairydeco.global.common.dto.SuccessResponse;
import com.a402.fairydeco.global.util.FileUtil;
import lombok.RequiredArgsConstructor;
import lombok.Value;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RequiredArgsConstructor
@RequestMapping("/page")
@RestController
public class PageController {

    private final PageService pageService;


    @PutMapping("/story")
    public SuccessResponse<String> updateStory(@RequestBody StoryUpdate storyUpdate){
        return new SuccessResponse<>(pageService.updateStory(storyUpdate));
    }

}
