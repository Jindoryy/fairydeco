package com.a402.fairydeco.global.common.sse;

import com.a402.fairydeco.domain.user.entity.User;
import com.a402.fairydeco.domain.user.repository.UserRepository;
import com.a402.fairydeco.global.common.exception.CustomException;
import com.a402.fairydeco.global.common.exception.ErrorCode;
import java.io.IOException;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@Service
@RequiredArgsConstructor
public class SseService {

    private static final long TIMEOUT = 60 * 60 * 1000L; //1시간
    private final EmitterRepository emitterRepository;
    private final UserRepository userRepository;

    //subscribe 연결 설정
    public SseEmitter subscribe(Integer userId) {
        SseEmitter sseEmitter = new SseEmitter(TIMEOUT);

        User user = userRepository.findById(userId)
            .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND_ERROR));

        emitterRepository.save(userId, sseEmitter);

        //종료 되었을 경우
        sseEmitter.onCompletion(() -> {
            emitterRepository.deleteById(userId);
            System.out.println("연결 종료");
        });

        //timeOut 경우 - sseEmitter 완료 or 사용자 정보를 삭제 => 뭐가 더 나은지는 모르겠음
        sseEmitter.onTimeout(sseEmitter::complete);
//        sseEmitter.onTimeout(() -> {
//            emitterRepository.delete(username);
//        });

        // 503 에러를 방지하기 위한 더미 이벤트 전송
        sendConnect(sseEmitter, userId);

        return sseEmitter;
    }

    private void sendConnect(SseEmitter sseEmitter, Integer userId) {
        try {
            sseEmitter.send(SseEmitter.event()
                .name("CONNECT userId: " + userId)
                .data("connect completed"));
            System.out.println("연결 성공");
        } catch (IOException e) {
            System.out.println("연결 실패");
            emitterRepository.deleteById(userId);
            throw new CustomException(ErrorCode.SSE_CONNECT_FAIL_ERROR);
        }
    }

    public void send(Integer userId) {

        emitterRepository.findByUserId(userId).ifPresentOrElse(sseEmitter -> {
            try {
                sseEmitter.send(SseEmitter.event()
                    .data("send data"));
                System.out.println("send 완료");
            } catch (IOException e) {
                System.out.println("send 실패");
                emitterRepository.deleteById(userId);
                throw new CustomException(ErrorCode.SSE_SEND_FAIL_ERROR);
            }
        }, () -> {
            System.out.println("SseEmitter User Not Found");
            throw new CustomException(ErrorCode.SSE_USER_NOT_FOUND_ERROR);
        });

//        //Optional이 null 일 경우의 exception 처리가 안되어있음
//        Optional<SseEmitter> optionalEmitter = emitterRepository.findByUserId(userId);
//
//        // 연결되어 있는 경우
//        SseEmitter sseEmitter = optionalEmitter.get();
//
//        try {
//            emitter.send(SseEmitter.event()
//                .data("send data"));
//            System.out.println("send 완료");
//        } catch (IOException e) {
//            System.out.println("send 실패");
//            emitterRepository.deleteById(userId);
//            throw new CustomException(ErrorCode.SSE_SEND_FAIL_ERROR);
//        }
    }

    //연결 종료
    public void disConnect(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND_ERROR));

        emitterRepository.deleteById(user.getId());
    }

}
