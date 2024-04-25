package com.a402.fairydeco.domain.user.controller;

import com.a402.fairydeco.domain.user.dto.UserLoginIdRequest;
import com.a402.fairydeco.domain.user.service.UserService;
import com.a402.fairydeco.global.common.dto.SuccessResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
@Tag(name = "User", description = "유저 API")
public class UserController {

    private final UserService userService;

    @Operation(summary = "아이디 중복 확인", description = "회원가입에 필요한 아이디의 중복을 확인한다.")
    @PostMapping("/checkId")
    public SuccessResponse<String> checkUserId(@RequestBody UserLoginIdRequest userLoginIdRequest) {

        return new SuccessResponse<>(userService.isDuplicateId(userLoginIdRequest));
    }
}
