package com.a402.fairydeco.domain.child.dto;

import com.a402.fairydeco.domain.book.dto.MyPageBookDTO;
import com.a402.fairydeco.domain.user.dto.GenderStatus;
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
public class MyPageChildListDTO {

    private Integer childId;
    private String childName;
    private LocalDate childBirth;
    private GenderStatus childGender;
    private List<MyPageBookDTO> bookList;

}
