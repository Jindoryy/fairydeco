package com.a402.fairydeco.domain.book.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class ImgPromptDto {

    private String prompt;
    private String imageUrl;
    private String imageName;

    @Builder
    public ImgPromptDto(String prompt, String imageUrl, String imageName) {
        this.prompt = prompt;
        this.imageUrl = imageUrl;
        this.imageName = imageName;
    }

}
