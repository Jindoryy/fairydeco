package com.a402.fairydeco.domain.book.dto;

import com.a402.fairydeco.domain.page.dto.PageListResponse;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookStoryDetailResponse {

    private Integer bookId;
    private Integer childId;
    private String bookName;
    private List<PageListResponse> pageList;

}
