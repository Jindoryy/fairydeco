package com.a402.fairydeco.domain.user.service;

import com.a402.fairydeco.domain.user.dto.UserLoginIdRequest;
import com.a402.fairydeco.domain.user.entity.User;
import com.a402.fairydeco.domain.user.repository.UserRepository;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

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
}
