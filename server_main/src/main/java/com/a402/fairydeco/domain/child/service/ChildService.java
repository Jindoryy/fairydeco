package com.a402.fairydeco.domain.child.service;

import com.a402.fairydeco.domain.book.dto.ProfileStatus;
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
import java.util.Random;
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
                .childProfileUrl(child.getProfileUrl())
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
                .childProfileUrl(child.getProfileUrl())
                .build());
        }

        return childNameListResponses;
    }

    public List<ChildListResponse> saveChild(ChildAddRequest childAddRequest) {

        User user = getUserById(childAddRequest.getUserId());

        String profileUrl = getProfileUrl();

        Child child = Child.builder()
            .user(user)
            .name(childAddRequest.getChildName())
            .birth(childAddRequest.getChildBirth())
            .gender(childAddRequest.getChildGender())
            .profileUrl(profileUrl)
            .build();

        childRepository.save(child);

        return findChildList(childAddRequest.getUserId());
    }

    private static String getProfileUrl() {

        String[] profileList = {
            "https://fairydeco.s3.ap-northeast-2.amazonaws.com/shark.jpeg",
            "https://fairydeco.s3.ap-northeast-2.amazonaws.com/sloth.jpeg",
            "https://fairydeco.s3.ap-northeast-2.amazonaws.com/chicken.jpeg",
            "https://fairydeco.s3.ap-northeast-2.amazonaws.com/turtle.jpeg",
            "https://fairydeco.s3.ap-northeast-2.amazonaws.com/rabbit.jpeg",
            "https://fairydeco.s3.ap-northeast-2.amazonaws.com/cheetah.jpeg",
        };

        Random random = new Random();
        return profileList[random.nextInt(profileList.length)];
    }

    public List<ChildListResponse> modifyChild(ChildUpdateRequest childUpdateRequest) {

        Child child = childRepository.findById(childUpdateRequest.getChildId())
            .orElseThrow(() -> new IllegalArgumentException("Child Not Found"));

        try {
            ProfileStatus.valueOf(childUpdateRequest.getProfileName());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("PROFILE NAME NOT FOUND");
        }

        child.setName(childUpdateRequest.getChildName());

        String profileUrl = "https://fairydeco.s3.ap-northeast-2.amazonaws.com/" +childUpdateRequest.getProfileName() + ".jpeg";
        child.setProfileUrl(profileUrl);

        childRepository.save(child);

        return findChildList(child.getUser().getId());
    }

}
