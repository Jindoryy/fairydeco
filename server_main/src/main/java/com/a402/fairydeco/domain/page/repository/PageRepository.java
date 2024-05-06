package com.a402.fairydeco.domain.page.repository;

import com.a402.fairydeco.domain.page.entity.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PageRepository extends JpaRepository<Page, Integer> {

}
