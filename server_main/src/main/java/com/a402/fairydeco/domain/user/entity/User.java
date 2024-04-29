package com.a402.fairydeco.domain.user.entity;

import com.a402.fairydeco.domain.user.dto.GenderStatus;
import com.a402.fairydeco.global.common.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.criteria.CriteriaBuilder.In;
import java.time.LocalDate;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

@Table(name = "user")
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class User extends BaseEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "user_id")
  private Integer id;

  @Column(name = "user_login_id", nullable = false, unique = true)
  private String loginId;

  @Column(name = "user_password", nullable = false)
  private String password;

  @Column(name = "user_name", nullable = false)
  private String name;

  @Column(name = "user_birth")
  private LocalDate birth;

  @Enumerated(EnumType.STRING)
  @Column(name = "user_gender")
  private GenderStatus gender;

  @Column(name = "user_voice_time")
  @ColumnDefault("0")
  @Builder.Default
  private Integer voiceTime = 0;

  public void setVoiceTime(Integer voiceTime) { this.voiceTime = voiceTime; }
}
