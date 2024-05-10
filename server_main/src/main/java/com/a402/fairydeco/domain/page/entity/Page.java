package com.a402.fairydeco.domain.page.entity;

import com.a402.fairydeco.domain.book.entity.Book;
import com.a402.fairydeco.global.common.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.DynamicUpdate;

@Table(name = "page")
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@DynamicUpdate
public class Page extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "page_id")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id")
    private Book book;

    @Column(name = "page_story", length = 1000)
    private String story;

    @Column(name = "page_image_url", length = 1000)
    private String imageUrl;

    @Column(name = "page_image_name")
    private String imageName;

    @Column(name = "page_voice_url", length = 1000)
    private String voiceUrl;

    @Column(name = "page_voice_duration")
    private int voiceDuration;

    public void updateStory(String story){
        this.story = story;
    }

}
