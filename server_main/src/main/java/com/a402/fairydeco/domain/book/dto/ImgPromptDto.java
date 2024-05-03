package com.a402.fairydeco.domain.book.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@NoArgsConstructor
@Getter
@Setter
public class ImgPromptDto {

    private String prompt;
    private String ImageUrl;

    @Builder
    public ImgPromptDto(String prompt, String ImageUrl){
        this.prompt = prompt;
        this.ImageUrl = ImageUrl;
    }
}
