package com.rr.respawnReviews.controller;





import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.rr.respawnReviews.dto.RatingDto;
import com.rr.respawnReviews.model.Rating;


import com.rr.respawnReviews.service.RatingService;


@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/rating")
public class RatingController {

  @Autowired
  private RatingService ratingService;


  @GetMapping("/game/{id}")
  public ResponseEntity<Double> getRatingByGame(@PathVariable Long id) {

    try {
      Double rating = ratingService.getRatingByGame(id);
      return ResponseEntity.ok(rating);
    } catch (DataAccessException e) {
      return ResponseEntity.notFound().build();
    }
  }

  @GetMapping("/gameuser/{gameId}")
  public ResponseEntity<RatingDto> getRatingByGameIdAndUser(@PathVariable Long gameId, @RequestParam Long userId) {
    Rating rating = ratingService.FindByGameIdAndUserId(gameId, userId);
    if (rating != null) {
      RatingDto finalRating = new RatingDto(rating.getScore());
      return ResponseEntity.ok(finalRating);
    } else {
      return ResponseEntity.notFound().build();
    }
  }

  @PostMapping
  public ResponseEntity<?> createRating(@RequestParam String gameName, @RequestParam Long userId,
   @RequestParam Double score,
  @RequestParam(value = "gameId", required = false) Long gameId){

    try {
      Rating rating = ratingService.createRating( gameName,  userId, score, gameId);

      RatingDto finalRating = new RatingDto(rating.getScore());

      return ResponseEntity.ok(finalRating);
    } catch (Exception e) {
      return ResponseEntity.notFound().build();
    }
  }

}
