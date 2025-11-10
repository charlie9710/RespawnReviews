package com.rr.respawnReviews.service;

import java.time.LocalDate;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;

import com.rr.respawnReviews.exceptions.InvalidDataGameException;
import com.rr.respawnReviews.model.Game;
import com.rr.respawnReviews.model.Rating;
import com.rr.respawnReviews.model.User;
import com.rr.respawnReviews.repository.GameRepository;
import com.rr.respawnReviews.repository.RatingRepository;
import com.rr.respawnReviews.repository.UserRepository;

import io.micrometer.common.lang.Nullable;

@Service
public class RatingService {

  @Autowired
  private RatingRepository ratingRepository;

  @Autowired
  private GameRepository gameRepository;

  @Autowired
  private UserRepository userRepository;

  
  public Double getRatingByGame(Long id) throws DataAccessException {

      Double rating = ratingRepository.getAverageScoreByGameId(id);
      return rating != null ? rating : 0.0;

  }
  public Rating FindByGameIdAndUserId(Long gameId, Long userId) {
    return ratingRepository.FindByGameIdAndUserId(gameId, userId);
  }

  public Rating createRating(String gameName, Long userId, Double score, @Nullable Long gameId) {

    Game gameFinal = gameRepository.findByName(gameName);


    if(gameFinal==null){
      if(gameId!=null){
        Game newGame = new Game();
        newGame.setId(gameId);
        newGame.setName(gameName);
        newGame.setReleaseDate(LocalDate.now());
        gameFinal = gameRepository.save(newGame);
      }else{
        throw new InvalidDataGameException("No se proporciono el id del juego para ingresar su calificación.");
      }
    }
    Rating existingRating = FindByGameIdAndUserId(gameFinal.getId(), userId);

    Rating rating;
    if (existingRating != null) {

        existingRating.setScore(score);
        return ratingRepository.save(existingRating);
    } else {
        rating = new Rating ();
        Optional<User> user = userRepository.findById(userId);
        Game game = gameRepository.getReferenceById(gameId);
        rating.setGame(game);
        rating.setScore(score);
        rating.setUser(user.get());
        return ratingRepository.save(rating);
    }
  }
}
