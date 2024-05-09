package com.a402.fairydeco.domain.book.repository;

import com.a402.fairydeco.domain.book.dto.CompleteStatus;
import com.a402.fairydeco.domain.book.entity.Book;
import com.a402.fairydeco.domain.child.entity.Child;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookRepository extends JpaRepository<Book, Integer> {

    List<Book> findTop20ByCompleteAndIdLessThanOrderByIdDesc(CompleteStatus completeStatus, Integer bookId);

    List<Book> findTop20ByCompleteOrderByIdDesc(CompleteStatus completeStatus);

    List<Book> findByChildAndCompleteAndPictureUrlNotNullOrderByIdDesc(Child child, CompleteStatus completeStatus);

    List<Book> findByChildOrderByIdDesc(Child child);

    List<Book> findByChild(Child child);

}
