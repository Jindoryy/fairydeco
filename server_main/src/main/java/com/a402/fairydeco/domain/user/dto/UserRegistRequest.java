package com.a402.fairydeco.domain.user.dto;

import com.a402.fairydeco.domain.child.dto.ChildListRequest;
import java.time.LocalDate;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserRegistRequest {
    private String loginId;
    private String password;
    private String name;
    private LocalDate birth;
    private GenderStatus gender;
    private List<ChildListRequest> childList;

}
