package com.rr.respawnReviews.controller;

import java.util.List;
import java.util.Map;

import org.hibernate.exception.ConstraintViolationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rr.respawnReviews.dto.CommentDto;
import com.rr.respawnReviews.exceptions.NoCommentFoundException;
import com.rr.respawnReviews.model.Comment;
import com.rr.respawnReviews.service.CommentService;


@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/comment")
public class CommentController {

  @Autowired
  private CommentService commentService;


  @PostMapping
  private ResponseEntity<Comment> createPost(@RequestBody Comment comment){
    try {
      Comment comentario = commentService.createComment(comment);
      return ResponseEntity.ok(comentario);
    } catch (DataIntegrityViolationException e) {
      return ResponseEntity.badRequest().build();
    }catch (ConstraintViolationException e) {
      return ResponseEntity.badRequest().build();
    }

  }

  @GetMapping("/{id}")
  private ResponseEntity<?> getComments(@PathVariable Long id){

    try {
      List<CommentDto> comentarios = commentService.getComments(id);
      return ResponseEntity.ok(comentarios);
    } catch (NoCommentFoundException e) {
     return ResponseEntity.status(HttpStatus.NO_CONTENT).body(Map.of("error", "Invalid Google token"));
    } catch (Exception e) {
     return ResponseEntity.noContent().build();
    }

  }
}
