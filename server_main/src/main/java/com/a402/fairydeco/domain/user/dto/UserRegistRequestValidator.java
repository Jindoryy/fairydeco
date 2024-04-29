package com.a402.fairydeco.domain.user.dto;

import java.util.regex.Pattern;

public class UserRegistRequestValidator {

    private static final Pattern LOGIN_ID_PATTERN = Pattern.compile("^[a-zA-Z0-9]{4,15}$");
    private static final Pattern PASSWORD_PATTERN = Pattern.compile("^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{8,20}$");
    private static final Pattern NAME_PATTERN = Pattern.compile("^[a-zA-Z가-힣]{1,20}$");

    public static void validateLoginId(String loginId) {
        if (loginId == null || !LOGIN_ID_PATTERN.matcher(loginId).matches()) {
            throw new IllegalArgumentException("아이디는 영문 혹은 숫자로 이루어진 4~15글자여야 합니다.");
        }
    }

    public static void validatePassword(String password) {
        if (password == null || !PASSWORD_PATTERN.matcher(password).matches()) {
            throw new IllegalArgumentException("비밀번호는 영문+숫자 조합, 8~20글자여야 합니다.");
        }
    }

    public static void validateName(String name) {
        if (name == null || !NAME_PATTERN.matcher(name).matches()) {
            throw new IllegalArgumentException("이름은 한글 또는 영문으로 1~20글자여야 합니다.");
        }
    }
}
