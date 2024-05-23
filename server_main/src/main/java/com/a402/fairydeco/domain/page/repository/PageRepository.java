package com.a402.fairydeco.domain.page.repository;

import com.a402.fairydeco.domain.page.entity.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface PageRepository extends JpaRepository<Page, Integer> {

    @Query(value = "SELECT * FROM page WHERE page_image_url IS NOT NULL ORDER BY RAND() LIMIT 1", nativeQuery = true)
    Page findRandomPageWithImage();

}
