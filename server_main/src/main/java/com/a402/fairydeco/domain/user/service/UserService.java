package com.a402.fairydeco.domain.user.service;

import com.a402.fairydeco.domain.child.dto.ChildListRequest;
import com.a402.fairydeco.domain.child.entity.Child;
import com.a402.fairydeco.domain.child.repository.ChildRepository;
import com.a402.fairydeco.domain.user.dto.UserLoginIdRequest;
import com.a402.fairydeco.domain.user.dto.UserRegistRequest;
import com.a402.fairydeco.domain.user.entity.User;
import com.a402.fairydeco.domain.user.repository.UserRepository;
import com.a402.fairydeco.global.common.exception.CustomException;
import com.a402.fairydeco.global.common.exception.ErrorCode;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final ChildRepository childRepository;

    public boolean isExistUserById(Integer userId) {
        Optional<User> userOptional = userRepository.findById(userId);

        if (userOptional.isPresent()) {
            return true;
        } else {
            return false;
        }
    }

    public String isDuplicateId(UserLoginIdRequest userLoginIdRequest) {
        Optional<User> userOptional = userRepository.findByLoginId(userLoginIdRequest.getLoginId());

        if (userOptional.isPresent()) {
            return "duplicate";
        } else {
            return "unique";
        }
    }

    public void registUser(UserRegistRequest userRegistRequest) {

        //아이디 중복 확인
        Optional<User> userOptional = userRepository.findByLoginId(userRegistRequest.getLoginId());
        if (userOptional.isPresent()) {
            throw new CustomException(ErrorCode.DUPLICATE_USER_LOGIN_ID);
        }

        User user = User.builder()
            .loginId(userRegistRequest.getLoginId())
            .password(userRegistRequest.getPassword())
            .name(userRegistRequest.getName())
            .birth(userRegistRequest.getBirth())
            .gender(userRegistRequest.getGender())
            .build();

        userRepository.save(user);

        List<Child> childList = new ArrayList<>();
        for (ChildListRequest childListRequest : userRegistRequest.getChildList()) {
            Child child = Child.builder()
                .user(user)
                .name(childListRequest.getChildName())
                .birth(childListRequest.getChildBirth())
                .gender(childListRequest.getChildGender())
                .build();
            childList.add(child);
        }

        childRepository.saveAll(childList);
    }
}
