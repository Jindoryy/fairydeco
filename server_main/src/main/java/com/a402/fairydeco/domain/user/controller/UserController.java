package com.a402.fairydeco.domain.user.controller;

import com.a402.fairydeco.domain.user.dto.MyPageResponse;
import com.a402.fairydeco.domain.user.dto.UserIdRequest;
import com.a402.fairydeco.domain.user.dto.UserLoginIdRequest;
import com.a402.fairydeco.domain.user.dto.UserLoginRequest;
import com.a402.fairydeco.domain.user.dto.UserLoginResponse;
import com.a402.fairydeco.domain.user.dto.UserRegistRequest;
import com.a402.fairydeco.domain.user.service.UserService;
import com.a402.fairydeco.global.common.dto.SuccessResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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

    @Operation(summary = "회원가입", description = "회원을 등록한다.")
    @PostMapping("/signup")
    public SuccessResponse<String> signUpUser(@RequestBody UserRegistRequest userRegistRequest) {
        userService.registUser(userRegistRequest);

        return new SuccessResponse<>("success");
    }

    @Operation(summary = "로그인", description = "로그인을 진행한다.")
    @PostMapping("/login")
    public SuccessResponse<UserLoginResponse> loginUser(@RequestBody UserLoginRequest userLoginRequest) {

        return new SuccessResponse<>(userService.loginUser(userLoginRequest));
    }


    @Operation(summary = "아이디 중복 확인", description = "회원가입에 필요한 아이디의 중복을 확인한다.")
    @PostMapping("/checkId")
    public SuccessResponse<String> checkUserId(@RequestBody UserLoginIdRequest userLoginIdRequest) {

        return new SuccessResponse<>(userService.isDuplicateId(userLoginIdRequest));
    }

    @Operation(summary = "마이페이지 정보", description = "마이페이지에 필요한 정보를 반환한다.")
    @GetMapping("/mypage/{childId}")
    public SuccessResponse<MyPageResponse> getMyPage(@PathVariable Integer childId) {

        return new SuccessResponse<>(userService.findMyPageList(childId));
    }
}
