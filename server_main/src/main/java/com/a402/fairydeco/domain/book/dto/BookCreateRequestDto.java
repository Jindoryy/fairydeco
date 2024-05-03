package com.a402.fairydeco.domain.book.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class BookCreateRequestDto {

    private Integer userId;
    private Integer bookId;
}
