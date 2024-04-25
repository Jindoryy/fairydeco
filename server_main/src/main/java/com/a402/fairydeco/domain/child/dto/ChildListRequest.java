package com.a402.fairydeco.domain.child.dto;

import com.a402.fairydeco.domain.user.dto.GenderStatus;
import java.time.LocalDate;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ChildListRequest {
    private String childName;
    private LocalDate childBirth;
    private GenderStatus childGender;
}
