package com.rr.respawnReviews.dto;

import java.time.LocalDateTime;

public class CommentDto {
  private Long id;
  private String text;
  private LocalDateTime createdAt;
  private Long userId;
  private String username;
  private String imageUrl;

  
  


  
  public CommentDto(Long id, String text, LocalDateTime createdAt, Long userId, String username, String imageUrl) {
    this.id = id;
    this.text = text;
    this.createdAt = createdAt;
    this.userId = userId;
    this.username = username;
    this.imageUrl = imageUrl;
  }

  
  public CommentDto() {
  }


  public Long getId() {
    return id;
  }
  public void setId(Long id) {
    this.id = id;
  }
  public String getText() {
    return text;
  }
  public void setText(String text) {
    this.text = text;
  }
  public LocalDateTime getCreatedAt() {
    return createdAt;
  }
  public void setCreatedAt(LocalDateTime createdAt) {
    this.createdAt = createdAt;
  }
  public Long getUserId() {
    return userId;
  }
  public void setUserId(Long userId) {
    this.userId = userId;
  }
  public String getUsername() {
    return username;
  }
  public void setUsername(String username) {
    this.username = username;
  }
  public String getImageUrl() {
    return imageUrl;
  }
  public void setImageUrl(String imageUrl) {
    this.imageUrl = imageUrl;
  }

  
}
