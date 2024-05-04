package com.a402.fairydeco.domain.book.dto;

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
