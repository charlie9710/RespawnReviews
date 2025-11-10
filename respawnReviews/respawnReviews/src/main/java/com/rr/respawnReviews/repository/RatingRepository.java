package com.rr.respawnReviews.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.rr.respawnReviews.model.Rating;

public interface RatingRepository extends JpaRepository<Rating, Long> {

    @Query(value = "SELECT AVG(score) FROM ratings WHERE game_id = :gameId", 
           nativeQuery = true)
    Double getAverageScoreByGameId(@Param("gameId") Long gameId);

    @Query(value = "SELECT * FROM ratings WHERE game_id = :gameId AND user_id = :userId", 
           nativeQuery = true)
    Rating FindByGameIdAndUserId(@Param("gameId") Long gameId, @Param("userId") Long userId);

}
