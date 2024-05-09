package com.a402.fairydeco.domain.book.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class BookCreateRequestDto {

    private Integer bookId;

    @Builder
    public BookCreateRequestDto(Integer bookId){
        this.bookId = bookId;
    }

}