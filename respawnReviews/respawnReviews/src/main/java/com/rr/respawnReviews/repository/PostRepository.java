package com.rr.respawnReviews.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.rr.respawnReviews.model.Post;



public interface PostRepository extends JpaRepository<Post, Long> {

  @Query(value = "SELECT * FROM posts WHERE type = :type AND game_id = :gameId", nativeQuery = true)
  List<Post> findByTypeAndGameId(@Param("type") String type, @Param("gameId") Long gameId);

  @Query(value = "SELECT * FROM posts WHERE user_id = :user_id", nativeQuery = true)
  List<Post> findByUser(@Param("user_id")Long id);

}
