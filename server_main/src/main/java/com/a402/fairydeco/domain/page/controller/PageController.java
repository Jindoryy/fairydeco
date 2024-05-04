package com.a402.fairydeco.domain.page.controller;

import com.a402.fairydeco.domain.page.dto.StoryUpdate;
import com.a402.fairydeco.domain.page.service.PageService;
import com.a402.fairydeco.global.common.dto.SuccessResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/page")
@Tag(name = "Page", description = "페이지 API")
public class PageController {

    private final PageService pageService;

    @Operation(summary = "스토리 수정", description = "동화의 스토리를 수정한다.")
    @PutMapping("/story")
    public SuccessResponse<String> updateStory(@RequestBody StoryUpdate storyUpdate){

        return new SuccessResponse<>(pageService.updateStory(storyUpdate));
    }

}
