package com.a402.fairydeco.domain.page.dto;


import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class PageStory {

    private int pageId;
    private String pageStory;

    @Builder
    public PageStory(int pageId, String pageStory){
        this.pageId = pageId;
        this.pageStory = pageStory;
    }

}
