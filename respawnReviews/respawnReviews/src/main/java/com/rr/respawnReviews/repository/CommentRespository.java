package com.rr.respawnReviews.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.rr.respawnReviews.model.Comment;

public interface CommentRespository extends JpaRepository<Comment, Long> {


  @Query(value= "SELECT * FROM comment where post_id=:post_id", nativeQuery=true)
  List<Comment> findByPost(@Param("post_id")Long id);

}
