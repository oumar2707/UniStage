package gn.univ_labe.unistage.dto;

import gn.univ_labe.unistage.model.RoleEnum;
import java.time.LocalDateTime;

public class UserDTO {
    private Long id;
    private String nom;
    private String prenom;
    private String email;
    private RoleEnum role;
    private LocalDateTime createdAt;

    public UserDTO() {}

    public UserDTO(Long id, String nom, String prenom, String email, RoleEnum role, LocalDateTime createdAt) {
        this.id = id;
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.role = role;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getPrenom() {
        return prenom;
    }

    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public RoleEnum getRole() {
        return role;
    }

    public void setRole(RoleEnum role) {
        this.role = role;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
