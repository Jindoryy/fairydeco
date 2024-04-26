package com.a402.fairydeco.global.common.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StoryResponse {
    private List<Choice> choices;


    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Choice {
        private int index;
        private StoryMessage message;

    }
}