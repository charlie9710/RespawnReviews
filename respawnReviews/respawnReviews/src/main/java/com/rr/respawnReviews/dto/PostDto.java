package com.rr.respawnReviews.dto;

import java.time.LocalDateTime;

public class PostDto {
  private String title;
  private String content;
  private String img;
  private Long id;
  private String userName;
  private LocalDateTime fechaCreacion;

  private String type;

  private String gameName;


  public PostDto(String title, String content, String img, Long id, String userName, LocalDateTime fechaCreacion) {
    this.title = title;
    this.content = content;
    this.img = img;
    this.id = id;
    this.userName = userName;
    this.fechaCreacion = fechaCreacion;
  }

  
  public PostDto(String title, String content, String img, Long id, String userName, LocalDateTime fechaCreacion,
      String type, String gameName) {
    this.title = title;
    this.content = content;
    this.img = img;
    this.id = id;
    this.userName = userName;
    this.fechaCreacion = fechaCreacion;
    this.type = type;
    this.gameName = gameName;
  }


  public PostDto() {
  }

  
  
  public String getTitle() {
    return title;
  }
  public void setTitle(String title) {
    this.title = title;
  }
  public String getContent() {
    return content;
  }
  public void setContent(String content) {
    this.content = content;
  }
  public String getImg() {
    return img;
  }
  public void setImg(String img) {
    this.img = img;
  }
  public Long getId() {
    return id;
  }
  public void setId(Long id) {
    this.id = id;
  }
 
  public LocalDateTime getFechaCreacion() {
    return fechaCreacion;
  }
  public void setFechaCreacion(LocalDateTime fechaCreacion) {
    this.fechaCreacion = fechaCreacion;
  }
  public String getUserName() {
    return userName;
  }
  public void setUserName(String userName) {
    this.userName = userName;
  }
  public String getType() {
    return type;
  }
  public void setType(String type) {
    this.type = type;
  }
  public String getGameName() {
    return gameName;
  }
  public void setGameName(String gameName) {
    this.gameName = gameName;
  }

  

  
}
