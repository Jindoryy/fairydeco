package com.a402.fairydeco.global.common.sse;

import com.a402.fairydeco.global.common.dto.SuccessResponse;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RequiredArgsConstructor
@RequestMapping("/sse")
@RestController
public class SseController {

    private static final long TIMEOUT = 60 * 60 * 1000L; // 1시간
    private final SseService sseService;

    //대부분 @RequstParam을 받았던데 이걸로 쓸지, 아니면 @PathVariable로 /connect/{id} 로 받을지 ?
    @Operation(summary = "sse 연결 테스트")
    @GetMapping(value = "/connect", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter connect(@RequestParam Integer userId, HttpServletResponse response) {
//        response.addHeader("X-Accel-Buffering", "no"); // nginx 관련 설정

        return sseService.subscribe(userId);
    }

    @Operation(summary = "sse 연결 종료")
    @DeleteMapping("/disconnect")
    public SuccessResponse<String> disconnect(@RequestParam Integer userId) {
        sseService.disConnect(userId);

        return new SuccessResponse<>("disconnect");
    }

    @Operation(summary = "send 테스트")
    @GetMapping("/test/send")
    public SuccessResponse<String> testSend(@RequestParam Integer userId) {
        //userId, 동화id .. ?
        sseService.send(userId);

        //String 대신 알림에 보여줄 정보 DTO로 반환
        return new SuccessResponse<>("send ok");
    }

}
