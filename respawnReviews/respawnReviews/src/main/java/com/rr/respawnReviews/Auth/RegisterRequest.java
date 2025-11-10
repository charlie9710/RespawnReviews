package com.rr.respawnReviews.Auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RegisterRequest {

  private String name;
  private Long phone_number;
  private String username;
  private String email;
  private String password;
  private String avatarUrl;  

}
