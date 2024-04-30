package com.a402.fairydeco.domain.user.repository;

import com.a402.fairydeco.domain.child.entity.Child;
import com.a402.fairydeco.domain.user.entity.User;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.lang.NonNullApi;

public interface UserRepository extends JpaRepository<User, Integer> {

    Optional<User> findByLoginId(String userLoginId);
    Optional<User> findByName(String userName);

    List<Child> findChildListById(Integer Id);

}
