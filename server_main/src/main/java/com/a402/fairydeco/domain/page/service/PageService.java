package com.a402.fairydeco.domain.page.service;


import com.a402.fairydeco.domain.book.dto.RecommendAge;
import com.a402.fairydeco.domain.child.entity.Child;
import com.a402.fairydeco.domain.child.repository.ChildRepository;
import com.a402.fairydeco.domain.page.dto.PageRandomResponse;
import com.a402.fairydeco.domain.page.dto.StoryUpdate;
import com.a402.fairydeco.domain.page.entity.Page;
import com.a402.fairydeco.domain.page.repository.PageRepository;
import com.a402.fairydeco.global.common.exception.CustomException;
import com.a402.fairydeco.global.common.exception.ErrorCode;
import java.time.LocalDate;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class PageService {

    private final PageRepository pageRepository;
    private final ChildRepository childRepository;

    @Transactional
    public String updateStory(StoryUpdate storyUpdate){
        Page page = pageRepository.findById(storyUpdate.getPageId()).orElseThrow(() -> new CustomException(ErrorCode.PAGE_NOT_FOUND_ERROR));
        page.updateStory(storyUpdate.getPageStory());

        return storyUpdate.getPageStory();
    }

    public PageRandomResponse findPageOneRandom(Integer childId) {
        Child child = childRepository.findById(childId)
            .orElseThrow(() -> new CustomException(ErrorCode.CHILD_NOT_FOUND_ERROR));

        int age = LocalDate.now().getYear() - child.getBirth().getYear() + 1;
        String childAgeCheck = (age <= 5) ? "Y" : "O";

        Page page = pageRepository.findRandomPageWithImage();

        return PageRandomResponse.builder()
            .childAgeCheck(childAgeCheck)
            .pagePictureUrl(page.getImageUrl())
            .build();
    }
}
