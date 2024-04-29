package com.a402.fairydeco.domain.book.service;


import com.a402.fairydeco.domain.book.dto.BookRegister;
import com.a402.fairydeco.domain.book.dto.BookStory;
import com.a402.fairydeco.domain.book.dto.GenreStatus;
import com.a402.fairydeco.domain.book.entity.Book;
import com.a402.fairydeco.domain.book.repository.BookRepository;
import com.a402.fairydeco.domain.child.repository.ChildRepository;
import com.a402.fairydeco.domain.page.dto.PageStory;
import com.a402.fairydeco.domain.page.entity.Page;
import com.a402.fairydeco.domain.page.repository.PageRepository;
import com.a402.fairydeco.global.common.dto.StoryRequest;
import com.a402.fairydeco.global.common.dto.StoryResponse;
import com.a402.fairydeco.global.common.exception.CustomException;
import com.a402.fairydeco.global.common.exception.ErrorCode;
import com.a402.fairydeco.global.util.FileUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.client.RestTemplate;
import com.a402.fairydeco.domain.book.dto.BookChildPictureListResponse;
import com.a402.fairydeco.domain.book.dto.BookDetailResponse;
import com.a402.fairydeco.domain.book.dto.BookLandingListResponse;
import com.a402.fairydeco.domain.book.dto.BookMainListResponse;
import com.a402.fairydeco.domain.book.dto.BookStoryDetailResponse;
import com.a402.fairydeco.domain.book.dto.BookTitleUpdateRequest;
import com.a402.fairydeco.domain.book.dto.BookTitleUpdateResponse;
import com.a402.fairydeco.domain.book.dto.CompleteStatus;
import com.a402.fairydeco.domain.child.entity.Child;
import com.a402.fairydeco.domain.page.dto.PageAllListResponse;
import com.a402.fairydeco.domain.page.dto.PageListResponse;
import java.util.ArrayList;
import java.util.List;
import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;
    private final PageRepository pageRepository;
    private final ChildRepository childRepository;

    @Value("${openai.model}")
    private String model;
    @Value("${openai.api.url}")
    private String apiURL;
    private final RestTemplate restTemplate;
    private final FileUtil fileUtil;

    @Transactional
    public BookStory register(BookRegister bookRegister) throws IOException {
        // 1. 들어온 내용을 바탕으로 동화 등록
        // 2. 프롬프트로 동화 스토리 생성
        // 3. 동화 스토리 save 후 return

        // 이미지가 만약 있을 경우 건희형이 만든 image to text 서비스 메서드 사용해서 한줄 스토리 받음

        String pictureName = "";
        String pictureUrl = "";
        Child child = childRepository.findById(bookRegister.getChildId()).orElseThrow(() -> new CustomException(ErrorCode.CHILD_NOT_FOUND_ERROR));
        String prompt = "<스토리 작성 프롬프트>\n" +
                "넌 지금부터 스토리텔링 전문가야. 많은 사람이 흥미를 느낄만한 글을 작성해 줘야 해. 이 프롬프트를 전송하면 아래의 단계를 진행해 줘.\n" +
                "\n" +
                "단계:\n" +
                "\n" +
                "1. 장르 선택" +
                "    리스트 (각 장르를 2개 이상 결합해도 돼): 각 장르를 설명하지마.\n" +
                "    로맨스: 사랑과 관계에 관한 이야기는 많은 사람들에게 호소력이 있습니다.\n" +
                "    모험: 긴장감과 활동적인 장면은 흥미롭고, 역동적인 시청 경험을 제공합니다.\n" +
                "    판타지: 마법과 다른 세계의 모험은 탈출 주의적인 경험을 제공합니다.\n" +
                "    미스터리: 미스터리를 좋아하고 해결하는 과정에서의 긴장감을 즐기는 관객에게 인기가 있습니다.\n" +
                "\n" +
                "2. 장르에 맞는 씬을 무조건 8개로 나누고 각 씬별 대본을 작성해 줘. 대본은 아래의 구조로 작성해 줘.\n" +
                "    **구조:**\n" +
                "    **큰 구조는 댄 하몬의 하몬 써클을 참고해서 작성해 줘. 글의 구조만 참고하는 거야.**\n" +
                "    **The Story Circle’s 8 Steps:**\n" +
                "    1. 한 마을에 아름다운 사과나무가 있었습니다. 그러나 사과를 따려고 해도 누구도 나무에 다가가지 못했습니다. 이유는 나무 옆에 무시무시한 용이 살고 있었기 때문이었습니다. 그러던 어느 날, 용감한 거북이가 나무에 사과를 따러 나타났습니다.  \n" +
                "    2. 거북이는 용의 존재를 알고도 두려움을 깨고 사과를 따러 나무에 올랐습니다. 용은 거북이를 본 순간 깜짝 놀랐지만, 거북이의 용기를 칭찬했습니다. 거북이는 용에게 친절한 인사를 건넸고, 용은 거북이에게 사과를 나누어 주었습니다.  \n" +
                "    3. 거북이와 용은 서로를 이해하고 친구가 되었습니다. 용은 거북이에게 나무의 비밀을 알려주었습니다. 그것은 사과가 나무에 달려있는 것이 아니라, 나무 안에 숨겨져 있었다는 것이었습니다. 거북이와 용은 함께 나무 속으로 들어가 비밀을 발견하기로 결심했습니다.  \n" +
                "    4. 거북이와 용은 나무 속으로 모험을 떠나기로 했습니다. 그들은 함께 어려운 장애물을 극복하고, 나무 속으로 더 깊이 들어갔습니다. 그들은 서로를 돕고 격려하며, 함께 하는 모험이 더욱 힘이 되었습니다.  \n" +
                "    5. 거북이와 용은 나무 속에서 비밀을 발견했습니다. 그것은 마음의 평화와 행복이었습니다. 사과를 찾는 것은 중요하지 않았습니다. 중요한 것은 서로를 이해하고 도와주는 우정이었습니다.  \n" +
                "    6. 거북이와 용은 나무 속에서 새로운 세계를 발견했습니다. 그들은 함께 모험을 떠나고, 서로를 돕는 우정을 맺었습니다. 이제 두 친구는 언제나 함께 할 것을 약속하며 새로운 모험을 기다리기로 했습니다.  \n" +
                "    7. 거북이와 용은 함께 한 모험이 우정을 깊이있게 만들었습니다. 그들은 서로를 믿고 의지하며, 언제나 함께 할 것을 다짐했습니다. 그들의 우정은 시간이 흐를수록 더욱 강해져 갔습니다.  \n" +
                "    8. 이야기를 통해 우리는 용감함과 우정의 소중함을 배웁니다. 거북이와 용은 용감함과 우정을 통해 모험을 떠나고, 서로를 이해하며 함께 성장합니다. 이야기는 우리에게 용감함과 우정이 가진 소중함을 상기시키며, 서로를 이해하고 도와주는 것의 중요성을 깨닫게 합니다.  \n" +
                "\n" +
                "\n" +
                "주의사항:\n" +
                "    *"+(LocalDate.now().getYear() - Integer.parseInt(child.getBirth().toString().substring(0,4)))+"살 "+child.getGender()+"자 아이에게 맞춰 동화처럼 반전이나 교훈을 주는 식으로 마무리 해줘.\n" +
                "    *각 씬의 대본은 8컷으로 300자 이상 구체적으로 작성해야해. 그리고 한글로 작성해야해.\n" +
                "    *소제목 없이 대본만 보여줘\n" +
                "    *각 대본의 끝에는 끝! 이 단어를 넣어줘\n================================================\n";
        Book savedBook;
        // 이미지 null이면 프롬프트로 그냥 더하고 
        // 이미지 있으면 이미지 따로저장 + 이미지분석으로 prompt 가져옴
        if (bookRegister.getBookPicture() != null) {
            // image to text 메서드
//             prompt =
            Book book = Book.builder()
                    .child(childRepository.findById(bookRegister.getChildId()).orElseThrow((() -> new CustomException(ErrorCode.BOOK_NOT_FOUND_ERROR))))
                    .maker(bookRegister.getBookMaker())
                    .genre(GenreStatus.valueOf(bookRegister.getBookGenre()))
                    .prompt(prompt)
//                    .pictureUrl(fileUtil.uploadFile(bookRegister.getBookPicture()))
//                    .pictureName(bookRegister.getBookPicture().getOriginalFilename())
                    .build();
            savedBook = bookRepository.save(book);
        } else {
            prompt += bookRegister.getBookPrompt();
            Book book = Book.builder()
                    .child(childRepository.findById(bookRegister.getChildId()).orElseThrow(() -> new CustomException(ErrorCode.CHILD_NOT_FOUND_ERROR)))
                    .name(bookRegister.getBookMaker()+"의 이야기")
                    .maker(bookRegister.getBookMaker())
                    .genre(GenreStatus.valueOf(bookRegister.getBookGenre()))
                    .prompt(bookRegister.getBookPrompt())
                    .build();
            savedBook = bookRepository.save(book);
        }
        // 동화 ai로 제작
        prompt += "장르는 " + savedBook.getGenre() + ", 주인공은 " + savedBook.getMaker() + ", 스토리는 " + savedBook.getPrompt();
        // 스토리 생성
        StoryRequest request = new StoryRequest(model, prompt);
        StoryResponse storyResponse = restTemplate.postForObject(apiURL, request, StoryResponse.class);
        String story = storyResponse.getChoices().get(0).getMessage().getContent();

        String[] bookStories = story.split("끝!"); // 8개로 나눔
        Page[] pages = new Page[8];
        PageStory[] pageStories = new PageStory[8];
        for(int i = 0;i<bookStories.length;i++){
            System.out.println(bookStories[i]);
        }
        // 먼저 만들어진 story를 8개로 나눈후에
        for (int i = 0; i < bookStories.length; i++) {
            Page page = Page.builder()
                    .book(bookRepository.findById(savedBook.getId()).orElseThrow(() -> new CustomException(ErrorCode.BOOK_NOT_FOUND_ERROR)))
                    .story(bookStories[i].trim()) //공백제거
                    .build();
            pages[i] = pageRepository.save(page);
            // pages를 save하면서 동시에 pageStory형태로 builder
            pageStories[i] = PageStory.builder()
                    .pageId(pages[i].getId())
                    .pageStory(pages[i].getStory())
                    .build();
        }
        // 이제 return 데이터 builder 진행
        BookStory bookStory = BookStory.builder()
                .bookId(savedBook.getId())
                .bookName(savedBook.getName())
                .pageStory(pageStories)
                .build();
        return bookStory;
    }

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
