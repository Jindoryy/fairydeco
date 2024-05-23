package com.a402.fairydeco.domain.user.service;

import com.a402.fairydeco.domain.book.dto.MyPageBookDTO;
import com.a402.fairydeco.domain.book.repository.BookRepository;
import com.a402.fairydeco.domain.child.entity.Child;
import com.a402.fairydeco.domain.child.repository.ChildRepository;
import com.a402.fairydeco.domain.user.dto.MyPageResponse;
import com.a402.fairydeco.domain.user.dto.UserLoginIdRequest;
import com.a402.fairydeco.domain.user.dto.UserLoginRequest;
import com.a402.fairydeco.domain.user.dto.UserLoginResponse;
import com.a402.fairydeco.domain.user.dto.UserRegistRequest;
import com.a402.fairydeco.domain.user.entity.User;
import com.a402.fairydeco.domain.user.repository.UserRepository;
import com.a402.fairydeco.global.common.exception.CustomException;
import com.a402.fairydeco.global.common.exception.ErrorCode;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final ChildRepository childRepository;
    private final BookRepository bookRepository;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

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
            .password(bCryptPasswordEncoder.encode(userRegistRequest.getPassword())) //패스워드 암호화
            .name(userRegistRequest.getName())
            .build();

        userRepository.save(user);
    }

    public UserLoginResponse loginUser(UserLoginRequest userLoginRequest) {

        User user = userRepository.findByLoginId(userLoginRequest.getLoginId())
            .orElseThrow(() -> new CustomException(ErrorCode.NO_AUTHENTICATED_USER_FOUND));

        UserLoginResponse userLoginResponse;

        //패스워드 복호화 후 일치 검증
        if (bCryptPasswordEncoder.matches(userLoginRequest.getPassword(), user.getPassword())) {
            //로그인 성공
            userLoginResponse = UserLoginResponse.builder()
                .userId(user.getId())
                .build();
        } else {
            //로그인 실패
            throw new CustomException(ErrorCode.NO_AUTHENTICATED_USER_FOUND);
        }

        return userLoginResponse;
    }

    public MyPageResponse findMyPageList(Integer childId) {

        Child child = childRepository.findById(childId)
            .orElseThrow(() -> new CustomException(ErrorCode.CHILD_NOT_FOUND_ERROR));

        List<MyPageBookDTO> books = child.getBookList().stream()
            .map(book -> MyPageBookDTO.builder()
                .bookId(book.getId())
                .bookName(book.getName())
                .bookMaker(book.getMaker())
                .bookPictureUrl(book.getPictureUrl())
                .bookCoverUrl(book.getCoverUrl())
                .bookCreatedAt(LocalDate.from(book.getCreatedAt()))
                .bookComplete(book.getComplete())
                .build())
            .toList();

        return MyPageResponse.builder()
            .userLoginId(child.getUser().getLoginId())
            .userName(child.getUser().getName())
            .childId(child.getId())
            .childName(child.getName())
            .childBirth(child.getBirth())
            .childGender(child.getGender())
            .childProfileUrl(child.getProfileUrl())
            .bookList(books)
            .build();
    }
}
