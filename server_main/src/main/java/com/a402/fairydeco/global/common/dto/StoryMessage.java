package com.a402.fairydeco.global.common.dto;

import lombok.*;

@NoArgsConstructor
@Getter
public class StoryMessage {
    private String role;
    private String content;

    @Builder
    public StoryMessage(String role, String content){
        this.role = role;
        this.content = content;
    }

}
