package com.a402.fairydeco.domain.child.service;

import com.a402.fairydeco.domain.child.dto.ChildAddRequest;
import com.a402.fairydeco.domain.child.dto.ChildListResponse;
import com.a402.fairydeco.domain.child.dto.ChildNameListResponse;
import com.a402.fairydeco.domain.child.dto.ChildUpdateRequest;
import com.a402.fairydeco.domain.child.entity.Child;
import com.a402.fairydeco.domain.child.repository.ChildRepository;
import com.a402.fairydeco.domain.user.entity.User;
import com.a402.fairydeco.domain.user.repository.UserRepository;
import com.a402.fairydeco.global.common.exception.CustomException;
import com.a402.fairydeco.global.common.exception.ErrorCode;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ChildService {

    private final ChildRepository childRepository;
    private final UserRepository userRepository;

    private User getUserById(Integer userId) {
        return userRepository.findById(userId)
            .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND_ERROR));
    }

    public List<ChildListResponse> findChildList(Integer userId) {

        User user = getUserById(userId);

        List<ChildListResponse> childListResponses = new ArrayList<>();
        List<Child> childList = childRepository.findByUserId(userId);

        if (childList.isEmpty()) {
            throw new IllegalArgumentException("Child List Not Found");
        }

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

        User user = getUserById(userId);

        List<ChildNameListResponse> childNameListResponses = new ArrayList<>();
        List<Child> childList = childRepository.findByUserId(userId);

        if (childList.isEmpty()) {
            throw new IllegalArgumentException("Child List Not Found");
        }

        for (Child child : childList) {
            childNameListResponses.add(ChildNameListResponse.builder()
                .childId(child.getId())
                .childName(child.getName())
                .build());
        }

        return childNameListResponses;
    }

    public List<ChildListResponse> saveChild(ChildAddRequest childAddRequest) {

        User user = getUserById(childAddRequest.getUserId());

        Child child = Child.builder()
            .user(user)
            .name(childAddRequest.getChildName())
            .birth(childAddRequest.getChildBirth())
            .gender(childAddRequest.getChildGender())
            .build();

        childRepository.save(child);

        return findChildList(childAddRequest.getUserId());
    }

    public void modifyChildName(ChildUpdateRequest childUpdateRequest) {

        Child child = childRepository.findById(childUpdateRequest.getChildId())
            .orElseThrow(() -> new IllegalArgumentException("Child Not Found"));

        child.setName(childUpdateRequest.getChildName());

        childRepository.save(child);
    }
}
