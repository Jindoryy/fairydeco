package com.a402.fairydeco.domain.book.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookMainListResponse {

    private List<mainBookListDTO> sampleBookList;
    private List<mainBookListDTO> recentBookList;

}
