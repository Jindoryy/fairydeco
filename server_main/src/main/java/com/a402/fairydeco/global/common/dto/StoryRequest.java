package com.a402.fairydeco.global.common.dto;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Getter
@NoArgsConstructor
public class StoryRequest {

    private String model;
    private List<StoryMessage> messages;

    @Builder
    public StoryRequest(String model, String prompt) {
        this.model = model;
        this.messages = new ArrayList<>();
        this.messages.add(new StoryMessage("user", prompt));
    }
}
