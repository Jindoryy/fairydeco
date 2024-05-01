package com.a402.fairydeco.global.common.sse;

import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Repository;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@Repository
public class EmitterRepository {

    //여러 스레드에서 동시에 사용할 수 있기 때문에 SseEmitter 저장 Map은 동시성을 보장하는 ConcurrentHashMap을 사용.
    public final Map<Integer, SseEmitter> emitters = new ConcurrentHashMap<>();

    public SseEmitter save(Integer userId, SseEmitter sseEmitter) {
        emitters.put(userId, sseEmitter);

        return sseEmitter;
    }

    public void deleteById(Integer userId) {
        emitters.remove(userId);
    }

    public Optional<SseEmitter> findByUserId(Integer userId) {
        SseEmitter sseEmitter = emitters.get(userId);

        return Optional.ofNullable(sseEmitter);
    }
}
