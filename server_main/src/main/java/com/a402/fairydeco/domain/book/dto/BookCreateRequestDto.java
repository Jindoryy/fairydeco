package com.a402.fairydeco.domain.book.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class BookCreateRequestDto {

    private Integer userId;
    private Integer bookId;

    @Builder
    public BookCreateRequestDto(Integer userId, Integer bookId){
        this.userId = userId;
        this.bookId = bookId;
    }

}