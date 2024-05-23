package com.a402.fairydeco.domain.voice.controller;

import com.a402.fairydeco.domain.voice.dto.VoiceRegistRequset;
import com.a402.fairydeco.domain.voice.service.VoiceService;
import com.a402.fairydeco.global.common.dto.SuccessResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.io.IOException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/voice")
@Tag(name = "Voice", description = "목소리 API")
public class VoiceController {

    private final VoiceService voiceService;

    @Operation(summary = "목소리 녹음 파일 저장", description = "녹음한 목소리 파일을 저장한다.")
    @PostMapping(value = "", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public SuccessResponse<String> saveVoice(VoiceRegistRequset voiceRegistRequset) throws IOException {
        voiceService.saveVoice(voiceRegistRequset);

        return new SuccessResponse<>("success");
    }

}
