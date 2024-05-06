package com.a402.fairydeco.domain.book.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@NoArgsConstructor
@Getter
@Setter
public class BookRegister {

    private int childId;
    private String bookMaker;
    private String bookGenre;
    private String bookPrompt;
    private MultipartFile bookPicture;

    @Builder
    public BookRegister(int childId, String bookMaker, String bookGenre, String bookPrompt, MultipartFile bookPicture) {
        this.childId = childId;
        this.bookMaker = bookMaker;
        this.bookGenre = bookGenre;
        this.bookPrompt = bookPrompt;
        this.bookPicture = bookPicture;
    }

}
