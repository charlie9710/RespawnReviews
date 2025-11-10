package com.rr.respawnReviews.service;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.rr.respawnReviews.model.User;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import io.jsonwebtoken.SignatureAlgorithm;



@Service
public class JwtService {
  @Value("${secret.key.jwt}")
  private String secret_key_jwt;
  @Autowired
  private UserDetailsServiceImpl userDetailsService;

  
  public String getToken(User user) {
    
    UserDetails userDetails = userDetailsService.loadUserByUsername(user.getUsername());
    SecretKey secretKey = Keys.hmacShaKeyFor(secret_key_jwt.getBytes(StandardCharsets.UTF_8));
    return Jwts.builder()
      .claim("id", user.getId())
      .claim("img","http://localhost:8080/uploads/"+ user.getAvatarUrl())
      .claim("roles", userDetails.getAuthorities())
      .setSubject(user.getUsername())
      .setIssuedAt(new Date(System.currentTimeMillis()))
      .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10))
      .signWith(secretKey, SignatureAlgorithm.HS256)
      .compact();
  }

  public String extractUsername(String token) {
    SecretKey secretKey = Keys.hmacShaKeyFor(secret_key_jwt.getBytes(StandardCharsets.UTF_8));
    return Jwts.parserBuilder()
      .setSigningKey(secretKey)
      .build()
      .parseClaimsJws(token)
      .getBody()
      .getSubject();
  }

  public boolean isTokenValid(String token, UserDetails userDetails) {
    final String username = extractUsername(token);
    return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
  }

  private boolean isTokenExpired(String token) {
    SecretKey secretKey = Keys.hmacShaKeyFor(secret_key_jwt.getBytes(StandardCharsets.UTF_8));
    Date expiration = Jwts.parserBuilder()
      .setSigningKey(secretKey)
      .build()
      .parseClaimsJws(token)
      .getBody()
      .getExpiration();
    return expiration.before(new Date());
  }

}
