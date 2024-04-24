package com.a402.fairydeco.domain.child.service;

import com.a402.fairydeco.domain.child.dto.ChildListResponse;
import com.a402.fairydeco.domain.child.dto.ChildNameListResponse;
import com.a402.fairydeco.domain.child.entity.Child;
import com.a402.fairydeco.domain.child.repository.ChildRepository;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ChildService {

    private final ChildRepository childRepository;

    public List<ChildListResponse> findChildList(Integer userId) {
        List<ChildListResponse> childListResponses = new ArrayList<>();
        List<Child> childList = childRepository.findByUserId(userId);

        for (Child child : childList) {
            childListResponses.add(ChildListResponse.builder()
                .childId(child.getId())
                .childName(child.getName())
                .childBirth(child.getBirth())
                .childGender(child.getGender())
                .build());
        }
        return childListResponses;
    }

    public List<ChildNameListResponse> findChildNameList(Integer userId) {

        List<ChildNameListResponse> childNameListResponses = new ArrayList<>();
        List<Child> childList = childRepository.findByUserId(userId);

        for (Child child : childList) {

            childNameListResponses.add(ChildNameListResponse.builder()
                .childId(child.getId())
                .childName(child.getName())
                .build());
        }
        return childNameListResponses;
    }
}
