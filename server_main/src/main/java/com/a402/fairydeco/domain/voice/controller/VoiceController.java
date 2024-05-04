package com.a402.fairydeco.domain.voice.controller;

import com.a402.fairydeco.domain.voice.service.VoiceService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/voice")
@Tag(name = "Voice", description = "목소리 API")
public class VoiceController {

    private final VoiceService voiceService;

}
