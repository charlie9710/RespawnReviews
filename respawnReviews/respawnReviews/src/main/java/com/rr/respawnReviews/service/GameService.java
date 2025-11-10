package com.rr.respawnReviews.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.rr.respawnReviews.model.Game;
import com.rr.respawnReviews.repository.GameRepository;

@Service
public class GameService {

  @Autowired
  private GameRepository gameRepository;

  public Game getGameById(Long id) {
    Game game = gameRepository.findById(id).orElse(null);
    if(game==null){
      return null;
    }
    return game;
  }

  public boolean existById(Long id) {
    return gameRepository.existsById(id);
  }

  public Game saveGame(Game game) {
    return gameRepository.save(game);
  }
}
