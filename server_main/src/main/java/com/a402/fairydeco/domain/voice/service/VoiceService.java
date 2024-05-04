package com.a402.fairydeco.domain.voice.service;

import com.a402.fairydeco.domain.user.entity.User;
import com.a402.fairydeco.domain.user.repository.UserRepository;
import com.a402.fairydeco.domain.voice.dto.VoiceRegistRequset;
import com.a402.fairydeco.domain.voice.entity.Voice;
import com.a402.fairydeco.domain.voice.repository.VoiceRepository;
import com.a402.fairydeco.global.common.exception.CustomException;
import com.a402.fairydeco.global.common.exception.ErrorCode;
import com.a402.fairydeco.global.util.FileUtil;
import java.io.IOException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class VoiceService {

    private final VoiceRepository voiceRepository;
    private final UserRepository userRepository;
    private final FileUtil fileUtil;

    public void saveVoice(VoiceRegistRequset voiceRegistRequset) throws IOException {

        User user = userRepository.findById(voiceRegistRequset.getUserId())
            .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND_ERROR));

        if (voiceRegistRequset.getVoiceFile() == null) {
            throw new CustomException(ErrorCode.MISSING_USER_INFO);
        }

        String voiceUrl = fileUtil.uploadFile(voiceRegistRequset.getVoiceFile());
        String voiceName = voiceRegistRequset.getVoiceFile().getOriginalFilename();

        Voice voice = Voice.builder()
            .user(user)
            .fileUrl(voiceUrl)
            .fileName(voiceName)
            .build();

        voiceRepository.save(voice);
    }
}
