package com.a402.fairydeco.domain.book.dto;

import com.a402.fairydeco.domain.user.dto.GenderStatus;
import com.a402.fairydeco.domain.user.dto.UserRegistRequestValidator;
import java.time.LocalDate;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class BookTitleUpdateRequest {

    private Integer bookId;
    private String bookName;
}
