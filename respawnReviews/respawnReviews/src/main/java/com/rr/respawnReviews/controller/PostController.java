package com.rr.respawnReviews.controller;


import java.io.IOException;
import java.util.List;
import java.util.Map;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.rr.respawnReviews.dto.PostDto;
import com.rr.respawnReviews.exceptions.NoPostFoundException;
import com.rr.respawnReviews.model.Post;

import com.rr.respawnReviews.service.PostService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;



@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/posts")
@Tag(name = "Posts", description = "Operaciones relacionadas con posts")
public class PostController {
    @Autowired
    private PostService postService;

    @Operation(
    summary = "Crear un post",
    description = "Este endpoint permite crear un post de un videojuego, ya sea de análisis , reseña o curiosidad."
    )
    @PostMapping
    public ResponseEntity<?> createPost(
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam(value = "image", required = false) MultipartFile imageFile,
            @RequestParam("type") String type,
            @RequestParam("userId") Long userId,
            @RequestParam("gameId") Long gameId,
            @RequestParam(value = "gameName", required = false) String gameName,
            @RequestParam(value = "releaseDate", required = false) String gameRelease  
    ) {
        try {

            System.out.println(content);


            Post postFinal =postService.createPost(title, content, imageFile,type,userId,gameId,gameName,gameRelease);

            PostDto postDto = new PostDto(postFinal.getTitle(), postFinal.getContent(), postFinal.getImg(), postFinal.getId(),postFinal.getOwnerName(), postFinal.getCreatedAt());

            return ResponseEntity.ok(postDto);

        } catch (IOException e) {
            System.out.println("ES UN ERROR DE IO CUIDADO");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("Error", e.getMessage()));
        } catch (Exception e) {
            System.out.println("EL ERROR ES: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("Error", e.getMessage()));
        }
    }

    @Operation(
        summary = "Obtener un post",
        description = "Este endpoint permite obtener un post por su id."
    )
    @GetMapping("/{id}")
    public ResponseEntity<?> getPost(@PathVariable Long id){
        try {
            Post post = postService.getPostById(id);
            PostDto postDto = new PostDto(post.getTitle(), post.getContent(), post.getImg(), post.getId() ,post.getOwnerName(), post.getCreatedAt());
            return ResponseEntity.ok(postDto);
        } catch (NoPostFoundException e) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(Map.of("Error", e.getMessage()));
        }catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("Error", e.getMessage()));
        }
    }

    @Operation(
        summary = "Obtener un post con su tipo y juego",
        description = "Este endpoint permite obtener un post introduciendo su tipo y su id de juego."
    )
    @GetMapping("/{gameId}/{type}")
    public ResponseEntity<?> getAllPostsByType(@PathVariable String type, @PathVariable Long gameId){

        try {
            List<Post> posts = postService.getPostsByGameType(type, gameId);
            List<PostDto> postDtos = posts.stream()
                .map(post -> new PostDto(post.getTitle(), post.getContent(), post.getImg(),post.getId(),post.getOwnerName(), post.getCreatedAt() ))
                .toList();
            return ResponseEntity.ok(postDtos);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("Error", e.getMessage()));
        }

    }

    @Operation(
    summary = "Obtener todos los usuarios mediante el id de usuario.",
    description = "Este endpoint permite crear una reseña sobre un videojuego, incluyendo título, contenido y rating."
)
    @GetMapping("/user/{id}")
    public ResponseEntity<?> getAllPostByUser(@PathVariable Long id){
        try {
            List<Post> posts = postService.getPostsByUser(id);
            List<PostDto> finalPosts= posts.stream().map(post ->new PostDto(post.getTitle(), post.getContent(), post.getImg(),post.getId(),post.getOwnerName(), post.getCreatedAt(), post.getType(), post.getGame().getName() ))
            .toList();
            return ResponseEntity.ok(finalPosts);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("Error", e.getMessage()));
        }
    }

}
