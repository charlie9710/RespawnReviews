package com.rr.respawnReviews.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.rr.respawnReviews.model.PermissionEntity;

public interface PermissionRepository extends JpaRepository<PermissionEntity, Integer> {

  Optional<PermissionEntity> findByName(String name);

}
