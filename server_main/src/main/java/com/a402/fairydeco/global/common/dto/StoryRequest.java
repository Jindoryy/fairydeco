package com.a402.fairydeco.global.common.dto;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class StoryRequest {

    private String model;
    private List<StoryMessage> messages;

    public StoryRequest(String model, String prompt) {
        this.model = model;
        this.messages = new ArrayList<>();
        this.messages.add(new StoryMessage("user", prompt));
    }
}
