package com.a402.fairydeco.global.common.dto;

import lombok.*;

import java.util.List;

@NoArgsConstructor
@Getter
public class StoryResponse {
    private List<Choice> choices;

    @Builder
    StoryResponse(List<Choice> choices){
        this.choices = choices;
    }

    @Getter
    public static class Choice {
        private int index;
        private StoryMessage message;

        @Builder
        public Choice(int index, StoryMessage message){
            this.index = index;
            this.message = message;
        }

    }
}