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
    private MultipartFile bookPicture;

    @Builder
    public BookRegister(int childId, MultipartFile bookPicture) {
        this.childId = childId;
        this.bookPicture = bookPicture;
    }

}
