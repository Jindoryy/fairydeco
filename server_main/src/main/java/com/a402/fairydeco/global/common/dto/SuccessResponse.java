package com.a402.fairydeco.global.common.dto;

public class SuccessResponse<T> extends BaseResponse<T> {
    public SuccessResponse(T data) {
        super("success", data);
    }
}
