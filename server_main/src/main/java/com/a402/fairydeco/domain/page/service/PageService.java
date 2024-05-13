package com.a402.fairydeco.domain.page.service;


import com.a402.fairydeco.domain.page.dto.StoryUpdate;
import com.a402.fairydeco.domain.page.entity.Page;
import com.a402.fairydeco.domain.page.repository.PageRepository;
import com.a402.fairydeco.global.common.exception.CustomException;
import com.a402.fairydeco.global.common.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class PageService {

    private final PageRepository pageRepository;

    @Transactional
    public String updateStory(StoryUpdate storyUpdate){
        Page page = pageRepository.findById(storyUpdate.getPageId()).orElseThrow(() -> new CustomException(ErrorCode.PAGE_NOT_FOUND_ERROR));
        page.updateStory(storyUpdate.getPageStory());

        return storyUpdate.getPageStory();
    }

    public String findPageOneRandom() {
        Page page = pageRepository.findRandomPageWithImage();

        return page.getImageUrl();
    }
}
