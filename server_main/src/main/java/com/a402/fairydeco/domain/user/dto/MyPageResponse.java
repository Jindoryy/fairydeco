package com.a402.fairydeco.domain.user.dto;

import com.a402.fairydeco.domain.book.dto.MyPageBookDTO;
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
public class MyPageResponse {

    private String userLoginId;
    private String userName;
    private Integer childId;
    private String childName;
    private LocalDate childBirth;
    private GenderStatus childGender;
    private String childProfileUrl;
    private List<MyPageBookDTO> bookList;

}
