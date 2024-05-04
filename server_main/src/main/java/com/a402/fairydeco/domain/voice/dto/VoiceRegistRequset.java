package com.a402.fairydeco.domain.voice.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Getter
@NoArgsConstructor
public class VoiceRegistRequset {

    private Integer userId;
    private MultipartFile voiceFile;

}
