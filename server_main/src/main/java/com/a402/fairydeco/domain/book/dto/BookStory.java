package com.a402.fairydeco.domain.book.dto;


import com.a402.fairydeco.domain.page.dto.PageStory;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Getter
public class BookStory {

    private int bookId;
    private String bookName;
    private PageStory[] pageStory;

    @Builder
    public BookStory(int bookId, String bookName, PageStory[] pageStory) {
        this.bookId = bookId;
        this.bookName = bookName;
        this.pageStory = pageStory;
    }

}
