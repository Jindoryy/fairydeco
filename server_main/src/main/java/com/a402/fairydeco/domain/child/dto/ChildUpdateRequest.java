package com.a402.fairydeco.domain.child.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ChildUpdateRequest {

    private Integer childId;
    private String childName;

}
