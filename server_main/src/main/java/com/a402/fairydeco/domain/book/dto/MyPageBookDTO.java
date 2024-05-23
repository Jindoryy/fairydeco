package com.a402.fairydeco.domain.book.dto;

import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MyPageBookDTO {

    private Integer bookId;
    private String bookName;
    private String bookMaker;
    private String bookPictureUrl;
    private String bookCoverUrl;
    private LocalDate bookCreatedAt;
    private CompleteStatus bookComplete;

}
