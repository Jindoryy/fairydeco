package com.a402.fairydeco.domain.book.service;


import com.a402.fairydeco.domain.book.dto.*;
import com.a402.fairydeco.domain.book.entity.Book;
import com.a402.fairydeco.domain.book.repository.BookRepository;
import com.a402.fairydeco.domain.child.entity.Child;
import com.a402.fairydeco.domain.child.repository.ChildRepository;
import com.a402.fairydeco.domain.page.dto.PageAllListResponse;
import com.a402.fairydeco.domain.page.dto.PageListResponse;
import java.time.LocalDate;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

@Service
@Transactional
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;
    private final ChildRepository childRepository;

    @Value("${EXPRESS_SERVER_URL}")
    private String EXPRESS_SERVER_URL;

    public BookMainListResponse findBookMainList(Integer childId) {

        Child child = childRepository.findById(childId)
            .orElseThrow(() -> new IllegalArgumentException("Child Not Found"));

        Child adminChild = childRepository.findById(0)
            .orElseThrow(() -> new IllegalArgumentException("Admin Child Not Found"));

        int age = LocalDate.now().getYear() - child.getBirth().getYear() + 1;
        RecommendAge recommendAge = (age <= 5) ? RecommendAge.Y : RecommendAge.O;

        List<mainBookListDTO> sampleBookList = getMainBookList(recommendAge, adminChild);
        List<mainBookListDTO> recentBookList = getRecentBookList(recommendAge, adminChild);

        return BookMainListResponse.builder()
            .sampleBookList(sampleBookList)
            .recentBookList(recentBookList)
            .build();
    }

    private List<mainBookListDTO> getMainBookList(RecommendAge recommendAge, Child adminChild) {
        return bookRepository.findByCompleteAndRecommendAgeAndChildOrderByIdDesc(
                CompleteStatus.COMPLETE, recommendAge, adminChild)
            .stream()
            .map(book -> mainBookListDTO.builder()
                .bookId(book.getId())
                .bookName(book.getName())
                .bookMaker(book.getMaker())
                .bookCoverUrl(book.getCoverUrl())
                .build())
            .toList();
    }

    private List<mainBookListDTO> getRecentBookList(RecommendAge recommendAge, Child adminChild) {
        return bookRepository.findTop15ByCompleteAndRecommendAgeAndChildNotOrderByIdDesc(
                CompleteStatus.COMPLETE, recommendAge, adminChild)
            .stream()
            .map(book -> mainBookListDTO.builder()
                .bookId(book.getId())
                .bookName(book.getName())
                .bookMaker(book.getMaker())
                .bookCoverUrl(book.getCoverUrl())
                .build())
            .toList();
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
        List<Book> bookList = bookRepository.findByChildAndCompleteAndPictureUrlNotNullOrderByIdDesc(child, CompleteStatus.COMPLETE);

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
                .userId(book.getChild().getUser().getId())
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

    public Boolean createBookImage(BookCreateRequestDto request) {
        Optional<Book> optionalBook = bookRepository.findById(request.getBookId());
        if (!optionalBook.isPresent()) {
            return false;
        } else {
            try {
                // 기능 진행1: stories/book-creation으로 POST 요청 보내기
                String url = EXPRESS_SERVER_URL;
                RestTemplate restTemplate = new RestTemplate();

                try {
                    ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);
                    // 응답이 정상이면 true 반환
                    if (response.getStatusCode() == HttpStatus.OK) {
                        // 기능 진행2: 정상 응답이 오면 true 반환
                        return true;
                    } else {
                        // 기능 진행3: 에러 처리
                        System.out.println("Error: " + response.getStatusCodeValue());
                        return false;
                    }
                } catch (final HttpClientErrorException e) {
                    System.out.println(e.getStatusCode());
                    System.out.println(e.getResponseBodyAsString());
                }

            } catch (Exception e) {
                // 기능 진행3: 에러 처리
                e.printStackTrace();
                return false;
            }
        }
        return false;
    }

    public Book getBookById(Integer bookId) {
        Optional<Book> book = bookRepository.findById(bookId);
        return book.orElseThrow(() -> new RuntimeException("Book not found"));
    }
}
