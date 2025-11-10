package com.rr.respawnReviews.service;

import java.util.List;


import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;

import com.rr.respawnReviews.dto.CommentDto;
import com.rr.respawnReviews.exceptions.NoCommentFoundException;
import com.rr.respawnReviews.model.Comment;
import com.rr.respawnReviews.repository.CommentRespository;

@Service
public class CommentService {

  @Autowired
  private CommentRespository commentRespository;

  public Comment createComment (Comment comment){
    Comment newComment = commentRespository.save(comment);
    return newComment;
  }

  public List<CommentDto> getComments (Long id){

    List<Comment> comments = commentRespository.findByPost(id);
    if(comments.isEmpty()){
      throw new NoCommentFoundException("No hay comentarios actualmente");
    }
    List <CommentDto> comentariosFinales = comments.stream().map(c -> {
      return new CommentDto(
                    c.getId(),
                    c.getText(),
                    c.getCreatedAt(),
                    c.getUser().getId(),
                    c.getUser().getUsername(),
                    c.getUser().getAvatarUrl()
                );
    }).toList();
    return comentariosFinales;

  }
}
