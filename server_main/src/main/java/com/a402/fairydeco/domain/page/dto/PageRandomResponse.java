package com.a402.fairydeco.domain.page.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PageRandomResponse {

    private String childAgeCheck;
    private String pagePictureUrl;

}
