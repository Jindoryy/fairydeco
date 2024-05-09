package com.a402.fairydeco.domain.book.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class BookCreateRequestDto {

    private Integer bookId;
    private Integer pageId;

    @Builder
    public BookCreateRequestDto(Integer bookId, Integer pageId){
        this.bookId = bookId;
        this.pageId = pageId;
    }

}