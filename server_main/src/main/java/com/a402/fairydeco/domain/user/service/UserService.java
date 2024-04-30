package com.a402.fairydeco.domain.user.service;

import com.a402.fairydeco.domain.book.dto.MyPageBookDTO;
import com.a402.fairydeco.domain.book.entity.Book;
import com.a402.fairydeco.domain.book.repository.BookRepository;
import com.a402.fairydeco.domain.child.dto.ChildListRequest;
import com.a402.fairydeco.domain.child.dto.ChildListResponse;
import com.a402.fairydeco.domain.child.dto.MyPageChildListDTO;
import com.a402.fairydeco.domain.child.entity.Child;
import com.a402.fairydeco.domain.child.repository.ChildRepository;
import com.a402.fairydeco.domain.user.dto.MyPageResponse;
import com.a402.fairydeco.domain.user.dto.UserIdRequest;
import com.a402.fairydeco.domain.user.dto.UserLoginIdRequest;
import com.a402.fairydeco.domain.user.dto.UserLoginRequest;
import com.a402.fairydeco.domain.user.dto.UserLoginResponse;
import com.a402.fairydeco.domain.user.dto.UserRegistRequest;
import com.a402.fairydeco.domain.user.dto.MyPageUserDTO;
import com.a402.fairydeco.domain.user.entity.User;
import com.a402.fairydeco.domain.user.repository.UserRepository;
import com.a402.fairydeco.global.common.exception.CustomException;
import com.a402.fairydeco.global.common.exception.ErrorCode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
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

    public MyPageResponse findMyPageList(UserIdRequest userIdRequest) {

        User user = userRepository.findById(userIdRequest.getUserId())
            .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND_ERROR));

        List<Child> children = childRepository.findByUserId(userIdRequest.getUserId());

        MyPageUserDTO userResponse = MyPageUserDTO.builder()
            .userLoginId(user.getLoginId())
            .userName(user.getName())
            .userBirth(user.getBirth())
            .userGender(user.getGender())
            .build();

        List<MyPageChildListDTO> childList = children.stream()
            .map(child -> {
                List<Book> books = bookRepository.findByChild(child);

                List<MyPageBookDTO> bookList = books.stream()
                    .map(book -> MyPageBookDTO.builder()
                        .bookId(book.getId())
                        .bookName(book.getName())
                        .bookMaker(book.getMaker())
                        .bookPictureUrl(book.getPictureUrl())
                        .bookCoverUrl(book.getCoverUrl())
                        .bookCreatedAt(LocalDate.from(book.getCreatedAt()))
                        .bookComplete(book.getComplete())
                        .build())
                    .collect(Collectors.toList());

                return MyPageChildListDTO.builder()
                    .childId(child.getId())
                    .childName(child.getName())
                    .childBirth(child.getBirth())
                    .childGender(child.getGender())
                    .bookList(bookList)
                    .build();

            }).toList();

        return MyPageResponse.builder()
            .user(userResponse)
            .childList(childList)
            .build();
    }
}
