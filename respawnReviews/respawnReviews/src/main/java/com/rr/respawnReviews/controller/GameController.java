package com.rr.respawnReviews.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

import com.rr.respawnReviews.exceptions.NoGameFoundException;
import com.rr.respawnReviews.model.Game;
import com.rr.respawnReviews.service.GameService;


@CrossOrigin(origins = "http://localhost:5173")
@RestController
public class GameController {
  @Autowired
  private GameService gameService;

  //Pendiente los controllers de game

  public ResponseEntity<?> getGameById(Long id) {
    try {
      Game game = gameService.getGameById(id);
      return ResponseEntity.ok(game);
    } catch (NoGameFoundException e) {
      return ResponseEntity.status(HttpStatus.NO_CONTENT).body(Map.of("Error", e.getMessage()));
    }catch (Exception e) {
      return ResponseEntity.noContent().build();
    }
  }

}
