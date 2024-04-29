package com.a402.fairydeco.domain.book.dto;

import com.a402.fairydeco.domain.user.dto.GenderStatus;
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookMainListResponse {

    private Integer bookId;
    private String bookName;
    private String bookMaker;
    private String bookCoverUrl;

}
