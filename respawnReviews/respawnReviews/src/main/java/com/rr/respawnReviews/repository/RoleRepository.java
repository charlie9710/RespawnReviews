package com.rr.respawnReviews.repository;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.rr.respawnReviews.model.RoleEntity;
import com.rr.respawnReviews.model.RoleEnum;
public interface RoleRepository extends JpaRepository<RoleEntity, Integer>  {
  Optional<RoleEntity> findByRoleName(RoleEnum role);
}
