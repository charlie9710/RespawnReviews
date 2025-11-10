package com.rr.respawnReviews.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.rr.respawnReviews.model.Game;

public interface GameRepository extends JpaRepository<Game, Long>{

  @Query(value = "SELECT * FROM games WHERE name = :gameName", 
           nativeQuery = true)
    Game findByName(@Param("gameName") String gameName);

}
