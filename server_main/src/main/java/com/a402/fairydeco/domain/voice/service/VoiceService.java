package com.a402.fairydeco.domain.voice.service;

import com.a402.fairydeco.domain.voice.repository.VoiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class VoiceService {

    private final VoiceRepository voiceRepository;

}
