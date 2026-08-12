package gn.univ_labe.unistage.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "entreprises")
public class Entreprise {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String raisonSociale;

    @Column(nullable = false)
    private String secteurActivite;

    private String adresse;

    private String siteWeb;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutValidation statutValidation = StatutValidation.EN_ATTENTE;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "utilisateur_id", referencedColumnName = "id", nullable = false)
    private Utilisateur utilisateur;

    @JsonIgnore
    @OneToMany(mappedBy = "entreprise", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OffreStage> offres = new ArrayList<>();

    public Entreprise() {}

    public Entreprise(String raisonSociale, String secteurActivite, String adresse, String siteWeb, StatutValidation statutValidation, Utilisateur utilisateur) {
        this.raisonSociale = raisonSociale;
        this.secteurActivite = secteurActivite;
        this.adresse = adresse;
        this.siteWeb = siteWeb;
        this.statutValidation = statutValidation;
        this.utilisateur = utilisateur;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRaisonSociale() {
        return raisonSociale;
    }

    public void setRaisonSociale(String raisonSociale) {
        this.raisonSociale = raisonSociale;
    }

    public String getSecteurActivite() {
        return secteurActivite;
    }

    public void setSecteurActivite(String secteurActivite) {
        this.secteurActivite = secteurActivite;
    }

    public String getAdresse() {
        return adresse;
    }

    public void setAdresse(String adresse) {
        this.adresse = adresse;
    }

    public String getSiteWeb() {
        return siteWeb;
    }

    public void setSiteWeb(String siteWeb) {
        this.siteWeb = siteWeb;
    }

    public StatutValidation getStatutValidation() {
        return statutValidation;
    }

    public void setStatutValidation(StatutValidation statutValidation) {
        this.statutValidation = statutValidation;
    }

    public Utilisateur getUtilisateur() {
        return utilisateur;
    }

    public void setUtilisateur(Utilisateur utilisateur) {
        this.utilisateur = utilisateur;
    }

    public List<OffreStage> getOffres() {
        return offres;
    }

    public void setOffres(List<OffreStage> offres) {
        this.offres = offres;
    }
}
