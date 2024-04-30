package com.a402.fairydeco.domain.book.dto;

import com.a402.fairydeco.domain.page.dto.PageAllListResponse;
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
public class MyPageBookDTO {

    private Integer bookId;
    private String bookName;
    private String bookMaker;
    private String bookPictureUrl;
    private String bookCoverUrl;
    private LocalDate bookCreatedAt;
    private CompleteStatus bookComplete;

}
