package com.rr.respawnReviews.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.rr.respawnReviews.model.User;

public interface UserRepository extends JpaRepository<User, Long> {

  
  @Query("SELECT u FROM User u WHERE u.username = ?1")
  Optional<User> findUserByUsername(String username);

  @Query("SELECT u FROM User u WHERE u.id = ?1")
  Optional<User> findById(Long id);

  @Query("SELECT u FROM User u WHERE u.email = ?1")
  Optional<User> findByEmail(String email);

  boolean existsByUsername(String username);

}
