package com.rr.respawnReviews.dto;

public class UserDto {
    private Long id;
    private String username;
    private String email;
    private String avatarUrl;
    private String name;
    private Long phone_number;

   

    public UserDto(String username, String email, String avatarUrl, String name, Long phone_number, Long id) {
        this.username = username;
        this.email = email;
        this.avatarUrl = avatarUrl;
        this.name = name;
        this.phone_number = phone_number;
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getPhone_number() {
        return phone_number;
    }

    public void setPhone_number(Long phone_number) {
        this.phone_number = phone_number;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }


}
