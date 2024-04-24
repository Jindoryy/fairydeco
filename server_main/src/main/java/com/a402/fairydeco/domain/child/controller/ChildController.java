package com.a402.fairydeco.domain.child.controller;

import com.a402.fairydeco.domain.child.dto.ChildListResponse;
import com.a402.fairydeco.domain.child.dto.ChildNameListResponse;
import com.a402.fairydeco.domain.child.service.ChildService;
import com.a402.fairydeco.domain.user.entity.User;
import com.a402.fairydeco.domain.user.service.UserService;
import com.a402.fairydeco.global.common.dto.SuccessResponse;
import com.a402.fairydeco.global.common.exception.CustomException;
import com.a402.fairydeco.global.common.exception.ErrorCode;
import com.sun.net.httpserver.Authenticator.Success;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.persistence.criteria.CriteriaBuilder.In;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/child")
@Tag(name = "Child", description = "아이 API")
public class ChildController {

    private final UserService userService;
    private final ChildService childService;


    @Operation(summary = "내 아이 리스트", description = "내 아이 전체 목록을 조회한다.")
    @GetMapping("/list/{userId}")
    public SuccessResponse<List<ChildListResponse>> getChildList(@PathVariable Integer userId) {
        if(!userService.isExistUser(userId)) {
            throw new CustomException(ErrorCode.USER_NOT_FOUND_ERROR);
        }
        return new SuccessResponse<>(childService.findChildList(userId));
    }

    @Operation(summary = "내 아이 이름 리스트", description = "메인페이지 지은이에 필요한 아이 이름 목록을 조회한다.")
    @GetMapping("/name-list/{userId}")
    public SuccessResponse<List<ChildNameListResponse>> getChildNameList(@PathVariable Integer userId) {

        if (!userService.isExistUser(userId)) {
            throw new CustomException(ErrorCode.USER_NOT_FOUND_ERROR);
        }
        return new SuccessResponse<>(childService.findChildNameList(userId));

    }
}
