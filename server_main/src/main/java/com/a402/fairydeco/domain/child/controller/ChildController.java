package com.a402.fairydeco.domain.child.controller;

import com.a402.fairydeco.domain.child.dto.ChildAddRequest;
import com.a402.fairydeco.domain.child.dto.ChildListResponse;
import com.a402.fairydeco.domain.child.dto.ChildNameListResponse;
import com.a402.fairydeco.domain.child.dto.ChildUpdateRequest;
import com.a402.fairydeco.domain.child.service.ChildService;
import com.a402.fairydeco.global.common.dto.SuccessResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/child")
@Tag(name = "Child", description = "아이 API")
public class ChildController {

    private final ChildService childService;

    @Operation(summary = "내 아이 리스트", description = "내 아이 전체 목록을 조회한다.")
    @GetMapping("/list/{userId}")
    public SuccessResponse<List<ChildListResponse>> getChildList(@PathVariable Integer userId) {

        return new SuccessResponse<>(childService.findChildList(userId));
    }

    @Operation(summary = "내 아이 이름 리스트", description = "메인페이지 지은이에 필요한 아이 이름 목록을 조회한다.")
    @GetMapping("/name-list/{userId}")
    public SuccessResponse<List<ChildNameListResponse>> getChildNameList(@PathVariable Integer userId) {

        return new SuccessResponse<>(childService.findChildNameList(userId));
    }

    @Operation(summary = "아이 등록", description = "마이페이지에서 아이를 추가로 등록한다.")
    @PostMapping("")
    public SuccessResponse<List<ChildListResponse>> addChild(@RequestBody ChildAddRequest childAddRequest) {

        return new SuccessResponse<>(childService.saveChild(childAddRequest));
    }

    @Operation(summary = "아이 정보 수정", description = "프로필페이지에서 아이의 이름과 프로필 사진을 수정한다.")
    @PutMapping("")
    public SuccessResponse<List<ChildListResponse>> updateChildName(@RequestBody ChildUpdateRequest childUpdateRequest) {
        return new SuccessResponse<>(childService.modifyChild(childUpdateRequest));
    }
}
