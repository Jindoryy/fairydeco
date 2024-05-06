package com.a402.fairydeco.domain.page.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PageAllListResponse {

    private Integer pageId;
    private String pageStory;
    private String pageimageUrl;
    //voiceUrl 필요 시 추가

}
