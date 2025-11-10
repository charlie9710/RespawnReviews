package com.rr.respawnReviews.model;

import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;


@Entity
@Table(name="roles")
public class RoleEntity {
  @Id
  @GeneratedValue(strategy= GenerationType.IDENTITY)
  private Integer id;

  @Column(name = "role_name")
  @Enumerated(EnumType.STRING)
  private RoleEnum roleName;

  public RoleEntity() {
  }

  public RoleEntity(Integer id, RoleEnum roleName) {
    this.id = id;
    this.roleName = roleName;
  }

  public Integer getId() {
    return id;
  }

  public void setId(Integer id) {
    this.id = id;
  }

  public RoleEnum getRoleName() {
    return roleName;
  }

  public void setRoleName(RoleEnum roleName) {
    this.roleName = roleName;
  }

  @ManyToMany(cascade = CascadeType.ALL, fetch = jakarta.persistence.FetchType.EAGER)
    @JoinTable(
      name = "role_permissions", joinColumns = @jakarta.persistence.JoinColumn(name = "role_id"),
      inverseJoinColumns = @jakarta.persistence.JoinColumn(name = "permission_id")
    )
  private Set<PermissionEntity> permissionsList = new HashSet<>();



  public Set<PermissionEntity> getPermissionsList() {
    return permissionsList;
  }

  

}
