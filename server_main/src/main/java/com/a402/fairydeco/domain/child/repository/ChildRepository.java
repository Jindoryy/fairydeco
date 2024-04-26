package com.a402.fairydeco.domain.child.repository;

import com.a402.fairydeco.domain.child.entity.Child;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChildRepository extends JpaRepository<Child, Integer> {

    List<Child> findByUserId(Integer userId);
}
