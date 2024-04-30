package com.a402.fairydeco.domain.user.dto;

import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MyPageUserDTO {

    private String userLoginId;
    private String userName;
    private LocalDate userBirth;
    private GenderStatus userGender;
}
