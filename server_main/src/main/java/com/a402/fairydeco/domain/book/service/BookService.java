package com.a402.fairydeco.domain.book.service;


import com.a402.fairydeco.domain.book.dto.BookChildPictureListResponse;
import com.a402.fairydeco.domain.book.dto.BookDetailResponse;
import com.a402.fairydeco.domain.book.dto.BookLandingListResponse;
import com.a402.fairydeco.domain.book.dto.BookMainListResponse;
import com.a402.fairydeco.domain.book.dto.BookStoryDetailResponse;
import com.a402.fairydeco.domain.book.dto.BookTitleUpdateRequest;
import com.a402.fairydeco.domain.book.dto.BookTitleUpdateResponse;
import com.a402.fairydeco.domain.book.dto.CompleteStatus;
import com.a402.fairydeco.domain.book.entity.Book;
import com.a402.fairydeco.domain.book.repository.BookRepository;
import com.a402.fairydeco.domain.child.entity.Child;
import com.a402.fairydeco.domain.child.repository.ChildRepository;
import com.a402.fairydeco.domain.page.dto.PageAllListResponse;
import com.a402.fairydeco.domain.page.dto.PageListResponse;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;
    private final ChildRepository childRepository;

    public List<BookMainListResponse> findBookMainList(Integer bookId) {

        List<BookMainListResponse> bookMainListResponses = new ArrayList<>();

        if (bookId == 0) {
            List<Book> bookList = bookRepository.findTop20ByCompleteOrderByIdDesc(CompleteStatus.COMPLETE);

            for (Book book : bookList) {
                bookMainListResponses.add(buildBookMainListResponse(book));
            }
        } else {
            Book bookExist = bookRepository.findById(bookId)
                .orElseThrow(()-> new IllegalArgumentException("Book Not Found"));

            List<Book> bookList = bookRepository.findTop20ByCompleteAndIdLessThanOrderByIdDesc(CompleteStatus.COMPLETE, bookId);

            for (Book book : bookList) {
                bookMainListResponses.add(buildBookMainListResponse(book));
            }
        }

        return bookMainListResponses;
    }

    private BookMainListResponse buildBookMainListResponse(Book book) {
        return BookMainListResponse.builder()
            .bookId(book.getId())
            .bookName(book.getName())
            .bookMaker(book.getMaker())
            .bookCoverUrl(book.getCoverUrl())
            .build();
    }

    public List<BookLandingListResponse> findBookLandingList() {

        List<BookLandingListResponse> bookLandingListResponses = new ArrayList<>();
        List<Book> bookList = bookRepository.findTop20ByCompleteOrderByIdDesc(CompleteStatus.COMPLETE);

        for (Book book : bookList) {
            bookLandingListResponses.add(BookLandingListResponse.builder()
                .bookCoverUrl(book.getCoverUrl())
                .build());
        }

        return bookLandingListResponses;
    }

    public BookTitleUpdateResponse modifyBookTitle(BookTitleUpdateRequest bookTitleUpdateRequest) {

        Book book = bookRepository.findById(bookTitleUpdateRequest.getBookId())
            .orElseThrow(() -> new IllegalArgumentException("Book Not Found"));

        book.updateBookName(bookTitleUpdateRequest.getBookName());

        bookRepository.save(book);

        return BookTitleUpdateResponse.builder()
            .bookName(book.getName())
            .build();
    }

    public List<BookChildPictureListResponse> findBookChildPictureList(Integer childId) {

        Child child = childRepository.findById(childId)
            .orElseThrow(() -> new IllegalArgumentException("Child Not Found"));

        List<BookChildPictureListResponse> bookChildPictureListResponses = new ArrayList<>();
        List<Book> bookList = bookRepository.findByChildAndCompleteAndPictureUrlNotNull(child, CompleteStatus.COMPLETE);

        for (Book book : bookList) {
            bookChildPictureListResponses.add(BookChildPictureListResponse.builder()
                .bookId(book.getId())
                .bookPictureUrl(book.getPictureUrl())
                .build());
        }

        return bookChildPictureListResponses;
    }

    public BookStoryDetailResponse findBookStory(Integer bookId) {

        Book book = bookRepository.findById(bookId)
            .orElseThrow(() -> new IllegalArgumentException("Book Not Found"));

        List<PageListResponse> pageList = book.getPageList().stream()
            .map(page -> PageListResponse.builder()
                .pageId(page.getId())
                .pageStory(page.getStory())
                .build())
            .toList();

        return BookStoryDetailResponse.builder()
            .bookId(book.getId())
            .childId(book.getChild().getId())
            .bookName(book.getName())
            .pageList(pageList)
            .build();
    }

    public BookDetailResponse findBook(Integer bookId) {

        Book book = bookRepository.findById(bookId)
            .orElseThrow(() -> new IllegalArgumentException("Book Not Found"));

        List<Book> bookList = bookRepository.findByChildOrderByIdDesc(book.getChild());
        int currentIndex = bookList.indexOf(book);
        int nextBookIndex = currentIndex + 1;
        Integer bookNextId = null;
        if (nextBookIndex < bookList.size()) {
            bookNextId = bookList.get(nextBookIndex).getId();
        }
        System.out.println(bookNextId);

        List<PageAllListResponse> pageList = book.getPageList().stream()
            .map(page -> PageAllListResponse.builder()
                .pageId(page.getId())
                .pageStory(page.getStory())
                .pageimageUrl(page.getImageUrl())
                .build())
            .toList();

        return BookDetailResponse.builder()
            .bookId(book.getId())
            .childId(book.getChild().getId())
            .bookName(book.getName())
            .bookMaker(book.getMaker())
            .bookPictureUrl(book.getPictureUrl())
            .bookCoverUrl(book.getCoverUrl())
            .bookNextId(bookNextId)
            .pageList(pageList)
            .build();
    }
}
