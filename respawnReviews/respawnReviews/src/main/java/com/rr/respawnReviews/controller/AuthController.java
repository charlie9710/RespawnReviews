package com.rr.respawnReviews.controller;

import java.io.IOException;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.core.AuthenticationException;
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

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;


@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/auth")
@Tag(name = "Auth", description = "Operaciones relacionadas con autenticacion")
public class AuthController {

  @Autowired
  private AuthService authService;

  @Operation(
    summary = "Login",
    description = "Este endpoint permite autenticarse en el sistema."
  )
  @PostMapping("/login")
  public ResponseEntity<?> login(@RequestBody LoginRequest request) {

    try {
      AuthResponse response = authService.login(request);
      return ResponseEntity.ok(response);
    } catch (BadCredentialsException e) {
      return ResponseEntity.status(401).body(Map.of("Error", "Credenciales Inválidas"));
    } catch (DisabledException e) {
      return ResponseEntity.status(401).body(Map.of("Error", "Usuario desabilitado"));
    } catch (LockedException e) {
        return ResponseEntity.status(401).body(Map.of("Error", "Usuario bloqueado"));
    } catch (AuthenticationException e) {
        return ResponseEntity.status(401).body(Map.of("Error", "El usuaruo no existe"));
    }
  }
  @Operation(
    summary = "Register",
    description = "Este endpoint sirve para registrarse en el sistema."
  )
  @PostMapping("/register")
  public ResponseEntity<?> register(@RequestParam("username") String username,
            @RequestParam("name") String name,
            @RequestParam(value = "avatarUrl", required = false) MultipartFile imageFile,
            @RequestParam("email") String email,
            @RequestParam("password") String password,
            @RequestParam(value = "phone_number", required = false) String phone_number ) {

    try {
      AuthResponse response = authService.register(username,name,imageFile,email,password,phone_number);
      return ResponseEntity.ok(response);
    } catch (DataIntegrityViolationException e) {
      return ResponseEntity.status(409).body(e.getMessage());
    }catch(IOException e){
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al procesar el archivo" + e.getMessage());
    }
  }
  @Operation(
    summary = "Google Login",
    description = "Este endpoint permite autenticarse en el sistema con google."
  )
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
