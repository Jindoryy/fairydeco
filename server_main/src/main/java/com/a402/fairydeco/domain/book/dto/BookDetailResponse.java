package com.a402.fairydeco.domain.book.dto;

import com.a402.fairydeco.domain.page.dto.PageAllListResponse;
import com.a402.fairydeco.domain.page.entity.Page;
import jakarta.persistence.criteria.CriteriaBuilder.In;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookDetailResponse {

    private Integer bookId;
    private Integer childId;
    private String bookName;
    private String bookMaker;
    private String bookPictureUrl;
    private String bookCoverUrl;
    private Integer bookNextId;
    private List<PageAllListResponse> pageList;

}
