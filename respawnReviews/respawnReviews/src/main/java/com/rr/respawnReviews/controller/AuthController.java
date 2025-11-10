package com.rr.respawnReviews.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.authentication.BadCredentialsException;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.rr.respawnReviews.Auth.AuthResponse;
import com.rr.respawnReviews.Auth.LoginRequest;
import com.rr.respawnReviews.exceptions.InvalidTokenException;


import com.rr.respawnReviews.service.AuthService;


@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

  @Autowired
  private AuthService authService;


  @PostMapping("/login")
  public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {

    try {
      AuthResponse response = authService.login(request);
      return ResponseEntity.ok(response);
    } catch (BadCredentialsException e) {
      return ResponseEntity.status(401).build();
    }
  }
  
  @PostMapping("/register")
  public ResponseEntity<AuthResponse> register(@RequestParam("username") String username,
            @RequestParam("name") String name,
            @RequestParam(value = "avatarUrl", required = false) MultipartFile imageFile,
            @RequestParam("email") String email,
            @RequestParam("password") String password,
            @RequestParam(value = "phone_number", required = false) String phone_number ) {

    try {
      AuthResponse response = authService.register(username,name,imageFile,email,password,phone_number);
      return ResponseEntity.ok(response);
    } catch (DataIntegrityViolationException e) {
      return ResponseEntity.status(409).build();
    }
  }
  @PostMapping("/google")
  public ResponseEntity<?> googleLogin(@RequestBody Map<String, String> body) {
     
     try {
        String jwt = authService.googleLogin(body);
        return ResponseEntity.ok(Map.of("token", jwt));

    } catch (InvalidTokenException e) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "Invalid Google token"));

    } catch (DataIntegrityViolationException e) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("error", "User already exists or invalid data"));

    } catch (DataAccessException e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Database error"));

    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Unexpected server error"));
    }
  }
}
