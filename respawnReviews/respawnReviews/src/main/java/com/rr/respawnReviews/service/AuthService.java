package com.rr.respawnReviews.service;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Collections;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.rr.respawnReviews.Auth.AuthResponse;
import com.rr.respawnReviews.Auth.LoginRequest;
import com.rr.respawnReviews.Auth.RegisterRequest;
import com.rr.respawnReviews.exceptions.InvalidTokenException;
import com.rr.respawnReviews.model.RoleEntity;
import com.rr.respawnReviews.model.RoleEnum;
import com.rr.respawnReviews.model.User;
import com.rr.respawnReviews.repository.RoleRepository;
import com.rr.respawnReviews.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {
  @Autowired
  private final UserRepository userRepository;

  @Autowired
  private final JwtService jwtService;

  @Autowired
  private final RoleRepository roleRepository;

  @Autowired
  private AuthenticationManager authenticationManager;

  @Autowired
  private PasswordEncoder passwordEncoder;

  @Value("${google.client.id}")
    private String googleClientId;



  public AuthResponse login(LoginRequest request) {
    Optional<User> user = userRepository.findUserByUsername(request.getUsername());
    Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );
    System.out.println("Authentication successful for user: " + auth.getName());

    return AuthResponse.builder()
        .token(jwtService.getToken(user.orElse(null)))
        .build();
  }

    public AuthResponse register(
            String username,
            String name,
            MultipartFile imageFile,
            String email,
            String password,
            String phone_number) {

        try {

            RegisterRequest request = new RegisterRequest();
            request.setUsername(username);
            request.setName(name);
            request.setEmail(email);
            request.setPassword(passwordEncoder.encode(password));

            if (phone_number != null && !phone_number.isBlank()) {
                request.setPhone_number(Long.valueOf(phone_number));
            }

            if (imageFile != null && !imageFile.isEmpty()) {
                String fileName = UUID.randomUUID() + "_" + imageFile.getOriginalFilename();
                Path uploadsDir = Paths.get("uploads");
                Files.createDirectories(uploadsDir);
                Path path = uploadsDir.resolve(fileName);
                Files.copy(imageFile.getInputStream(), path);
                request.setAvatarUrl(fileName);
            } else {
                request.setAvatarUrl("profile_img.jpg");
            }


            User user = new User();
            user.setName(request.getName());
            user.setPhone_number(request.getPhone_number());
            user.setUsername(request.getUsername());
            user.setEmail(request.getEmail());
            user.setPassword(request.getPassword());
            user.setAvatarUrl(request.getAvatarUrl());
            user.setEnabled(true);
            user.setAccountNoExpired(true);
            user.setAccountNoLocked(true);
            user.setCredentialNoExpired(true);

            RoleEntity roleUser = roleRepository.findByRoleName(RoleEnum.USER)
                    .orElseThrow(() -> new RuntimeException("Default role USER not found"));
            user.getRoles().add(roleUser);

            userRepository.save(user);

            return AuthResponse.builder()
                    .token(jwtService.getToken(user))
                    .build();

        } catch (DataIntegrityViolationException e) {
            throw e;
        } catch (Exception e) {
            
            throw new RuntimeException("Error durante el registro", e);
        }
    }

    public String googleLogin (Map<String, String> body){

        String idToken = body.get("token");
        GoogleIdToken.Payload payload = verifyGoogleToken(idToken);
        if (payload == null) {
            throw new InvalidTokenException("Google token verification failed");
        }

        String email = payload.getEmail();

        String baseName = payload.get("name").toString().replaceAll("\\s+", "");

        String randomSuffix = String.valueOf((int)(Math.random() * 1000));
        String randomSuffix2 =  String.valueOf((int)(Math.random() * 1000));
        String nickname = baseName + "_" + randomSuffix + randomSuffix2;

        while(userRepository.existsByUsername(nickname)) {
            randomSuffix = String.valueOf((int)(Math.random() * 1000));
            nickname = baseName + "_" + randomSuffix;
        }
        final String finalNickname = nickname;
        String randomPassword = UUID.randomUUID().toString();
            User user = userRepository.findByEmail(email)
            .orElseGet(() -> {
                User newUser = new User();
                newUser.setEmail(email);
                newUser.setName(baseName);
                newUser.setUsername(finalNickname);
                newUser.setPassword(passwordEncoder.encode(randomPassword));
                newUser.setAvatarUrl("profile_img.jpg");
                newUser.setProvider(User.AuthProvider.GOOGLE);
                newUser.setEnabled(true);
                newUser.setAccountNoExpired(true);
                newUser.setAccountNoLocked(true);
                newUser.setCredentialNoExpired(true);
                RoleEntity roleUser = roleRepository.findByRoleName(RoleEnum.USER)
                    .orElseThrow(() -> new RuntimeException("Default role USER not found"));
                newUser.getRoles().add(roleUser);
                return userRepository.save(newUser);
            });


        String jwt = jwtService.getToken(user);

        return jwt;
    }
    private GoogleIdToken.Payload verifyGoogleToken(String idTokenString) {
    try {
        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                new NetHttpTransport(),
                new GsonFactory()   
        )
        .setAudience(Collections.singletonList(googleClientId))
        .build();

        GoogleIdToken idToken = verifier.verify(idTokenString);
        return (idToken != null) ? idToken.getPayload() : null;

    } catch (Exception e) {
        e.printStackTrace();
        return null;
    }
  }
}
