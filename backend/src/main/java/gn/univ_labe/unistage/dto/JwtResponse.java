package gn.univ_labe.unistage.dto;

import gn.univ_labe.unistage.model.RoleEnum;

public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private Long id;
    private String nom;
    private String prenom;
    private String email;
    private RoleEnum role;
    private Long profileId; // ID de l'étudiant ou de l'entreprise si applicable

    public JwtResponse(String token, Long id, String nom, String prenom, String email, RoleEnum role, Long profileId) {
        this.token = token;
        this.id = id;
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.role = role;
        this.profileId = profileId;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
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

    public Long getProfileId() {
        return profileId;
    }

    public void setProfileId(Long profileId) {
        this.profileId = profileId;
    }
}
