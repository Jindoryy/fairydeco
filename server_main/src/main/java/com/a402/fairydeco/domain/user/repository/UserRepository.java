package com.a402.fairydeco.domain.user.repository;

import com.a402.fairydeco.domain.user.entity.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Integer> {

    Optional<User> findByLoginId(String userLoginId);

}
