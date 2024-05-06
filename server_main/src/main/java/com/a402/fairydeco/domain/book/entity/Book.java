package com.a402.fairydeco.domain.book.entity;

import com.a402.fairydeco.domain.book.dto.CompleteStatus;
import com.a402.fairydeco.domain.book.dto.GenreStatus;
import com.a402.fairydeco.domain.child.entity.Child;
import com.a402.fairydeco.domain.page.entity.Page;
import com.a402.fairydeco.global.common.BaseEntity;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.List;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Table(name = "book")
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Book extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "book_id")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "child_id")
    private Child child;

    @Column(name = "book_name", nullable = false)
    private String name;

    @Column(name = "book_maker", nullable = false)
    private String maker;

    @Enumerated(EnumType.STRING)
    @Column(name = "book_genre", nullable = false)
    private GenreStatus genre;

    @Column(name = "book_prompt")
    private String prompt;

    @Column(name = "book_picture_url")
    private String pictureUrl;

    @Column(name = "book_picture_name")
    private String pictureName;

    @Enumerated(EnumType.STRING)
    @Column(name = "book_complete", nullable = false)
    private final CompleteStatus complete = CompleteStatus.STORY; //default 'STORY'

    @Column(name = "book_cover_url")
    private String coverUrl;

    @Column(name = "book_cover_name")
    private String coverName;

    @OneToMany(mappedBy = "book", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Page> pageList = new ArrayList<>();

    public void updateBookName(String name){
        this.name = name;
    }

}
