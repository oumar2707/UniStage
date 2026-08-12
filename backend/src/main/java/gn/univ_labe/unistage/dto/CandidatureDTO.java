package gn.univ_labe.unistage.dto;

import gn.univ_labe.unistage.model.StatutCandidature;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

public class CandidatureDTO {

    private Long id;
    private LocalDateTime dateSoumission;

    @NotBlank(message = "La lettre de motivation est obligatoire")
    private String lettreMotivation;

    private StatutCandidature statut = StatutCandidature.EN_ATTENTE;

    // Etudiant details
    private Long etudiantId;
    private String etudiantNom;
    private String etudiantPrenom;
    private String etudiantEmail;
    private String matricule;
    private String filiere;
    private String niveau;
    private String telephone;
    private String cv;

    // Offre details
    private Long offreStageId;
    private String offreTitre;
    private String raisonSocialeEntreprise;

    public CandidatureDTO() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getDateSoumission() {
        return dateSoumission;
    }

    public void setDateSoumission(LocalDateTime dateSoumission) {
        this.dateSoumission = dateSoumission;
    }

    public String getLettreMotivation() {
        return lettreMotivation;
    }

    public void setLettreMotivation(String lettreMotivation) {
        this.lettreMotivation = lettreMotivation;
    }

    public StatutCandidature getStatut() {
        return statut;
    }

    public void setStatut(StatutCandidature statut) {
        this.statut = statut;
    }

    public Long getEtudiantId() {
        return etudiantId;
    }

    public void setEtudiantId(Long etudiantId) {
        this.etudiantId = etudiantId;
    }

    public String getEtudiantNom() {
        return etudiantNom;
    }

    public void setEtudiantNom(String etudiantNom) {
        this.etudiantNom = etudiantNom;
    }

    public String getEtudiantPrenom() {
        return etudiantPrenom;
    }

    public void setEtudiantPrenom(String etudiantPrenom) {
        this.etudiantPrenom = etudiantPrenom;
    }

    public String getEtudiantEmail() {
        return etudiantEmail;
    }

    public void setEtudiantEmail(String etudiantEmail) {
        this.etudiantEmail = etudiantEmail;
    }

    public String getMatricule() {
        return matricule;
    }

    public void setMatricule(String matricule) {
        this.matricule = matricule;
    }

    public String getFiliere() {
        return filiere;
    }

    public void setFiliere(String filiere) {
        this.filiere = filiere;
    }

    public String getNiveau() {
        return niveau;
    }

    public void setNiveau(String niveau) {
        this.niveau = niveau;
    }

    public String getTelephone() {
        return telephone;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }

    public String getCv() {
        return cv;
    }

    public void setCv(String cv) {
        this.cv = cv;
    }

    public Long getOffreStageId() {
        return offreStageId;
    }

    public void setOffreStageId(Long offreStageId) {
        this.offreStageId = offreStageId;
    }

    public String getOffreTitre() {
        return offreTitre;
    }

    public void setOffreTitre(String offreTitre) {
        this.offreTitre = offreTitre;
    }

    public String getRaisonSocialeEntreprise() {
        return raisonSocialeEntreprise;
    }

    public void setRaisonSocialeEntreprise(String raisonSocialeEntreprise) {
        this.raisonSocialeEntreprise = raisonSocialeEntreprise;
    }
}
