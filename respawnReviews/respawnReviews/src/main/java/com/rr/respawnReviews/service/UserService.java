package com.rr.respawnReviews.service;


import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.rr.respawnReviews.exceptions.NoUserFoundException;
import com.rr.respawnReviews.model.User;
import com.rr.respawnReviews.repository.UserRepository;

import io.micrometer.common.lang.Nullable;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtService jwtService;

    public User findUser(Long id){

        Optional<User> userFound = userRepository.findById(id);
        if(userFound.isPresent()){
            return userRepository.findById(id).orElse(null);
        }else{
            throw new NoUserFoundException("No se encontro el usuario correspondiente.");
        }
    }

    public Map<String, String> updateUser ( Long id, @Nullable String username , @Nullable String name , @Nullable Long phoneNumber
    , @Nullable String email,  @Nullable String password , @Nullable MultipartFile avatarFile) throws IOException{
        Optional<User> userFound = userRepository.findById(id);

        if (userFound.isEmpty()) {
            throw new NoUserFoundException("No se encontro el usuario correspondiente.");
        }

        User existingUser = userFound.get();

        if (username != null && !username.isEmpty()) {
            Optional<User> userFoundName = userRepository.findUserByUsername(username);
            if (userFoundName.isPresent() && !userFoundName.get().getId().equals(id)) {
                throw new NoUserFoundException("No se encontro el usuario correspondiente.");
            }
            existingUser.setUsername(username);
        }

        if (name != null) existingUser.setName(name);
        if (phoneNumber != null) existingUser.setPhone_number(phoneNumber);
        if (email != null) existingUser.setEmail(email);
        if (password != null && !password.isEmpty()) existingUser.setPassword(passwordEncoder.encode(password));
        
        if (avatarFile != null && !avatarFile.isEmpty()) {
            String fileName = UUID.randomUUID() + "_" + avatarFile.getOriginalFilename();
            Path uploadsDir = Paths.get("uploads");
            Files.createDirectories(uploadsDir);
            Path path = uploadsDir.resolve(fileName);
            Files.copy(avatarFile.getInputStream(), path);

            Files.copy(avatarFile.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);

            existingUser.setAvatarUrl(fileName);
        }

        User savedUser = userRepository.save(existingUser);

        String token = jwtService.getToken(savedUser);

        Map<String, String> response = new HashMap<>();
        response.put("token", token);

        return response;
    }
    
    
}
