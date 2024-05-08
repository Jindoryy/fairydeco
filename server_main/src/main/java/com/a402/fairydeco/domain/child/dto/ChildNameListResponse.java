package com.a402.fairydeco.domain.child.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChildNameListResponse {

    private Integer childId;
    private String childName;
    private String childProfileUrl;

}
