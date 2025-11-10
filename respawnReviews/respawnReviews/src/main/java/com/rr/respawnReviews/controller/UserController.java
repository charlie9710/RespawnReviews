package com.rr.respawnReviews.controller;

import java.io.IOException;

import java.util.Map;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;



import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.rr.respawnReviews.dto.UserDto;
import com.rr.respawnReviews.exceptions.NoUserFoundException;
import com.rr.respawnReviews.model.User;

import com.rr.respawnReviews.service.UserService;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/users")
public class UserController {



    @Autowired
    private UserService userService;




    @GetMapping("/{id}")
    public ResponseEntity<?> GetUser(@PathVariable Long id){

        try {
            User user = userService.findUser(id);
            UserDto newUser = new UserDto(user.getUsername(),user.getEmail(),user.getAvatarUrl(),user.getName(),user.getPhone_number(),user.getId());
            return ResponseEntity.ok(newUser);
        }catch (NoUserFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("Error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Map<String,String>> updateUser(
            @PathVariable Long id,
            @RequestParam(value = "username", required = false) String username,
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "phone_number", required = false) Long phoneNumber,
            @RequestParam(value = "email", required = false) String email,
            @RequestParam(value = "password", required = false) String password,
            @RequestParam(value = "avatar", required = false) MultipartFile avatarFile
    ) {

        try {

            Map<String, String> response = userService.updateUser(id, username, name, phoneNumber, email, password, avatarFile);

            return ResponseEntity.ok(response);

        }catch (NoUserFoundException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("Error", e.getMessage())); 
        }
         catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}