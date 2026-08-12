package gn.univ_labe.unistage.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "candidatures")
public class Candidature {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDateTime dateSoumission = LocalDateTime.now();

    @Column(nullable = false, columnDefinition = "TEXT")
    private String lettreMotivation;

    @Column(columnDefinition = "LONGTEXT")
    private String cv;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutCandidature statut = StatutCandidature.EN_ATTENTE;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "etudiant_id", nullable = false)
    private Etudiant etudiant;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "offre_stage_id", nullable = false)
    private OffreStage offreStage;

    public Candidature() {}

    public Candidature(String lettreMotivation, String cv, StatutCandidature statut, Etudiant etudiant, OffreStage offreStage) {
        this.lettreMotivation = lettreMotivation;
        this.cv = cv;
        this.statut = statut;
        this.etudiant = etudiant;
        this.offreStage = offreStage;
    }

    public Candidature(String lettreMotivation, StatutCandidature statut, Etudiant etudiant, OffreStage offreStage) {
        this(lettreMotivation, null, statut, etudiant, offreStage);
    }

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

    public String getCv() {
        return cv;
    }

    public void setCv(String cv) {
        this.cv = cv;
    }

    public StatutCandidature getStatut() {
        return statut;
    }

    public void setStatut(StatutCandidature statut) {
        this.statut = statut;
    }

    public Etudiant getEtudiant() {
        return etudiant;
    }

    public void setEtudiant(Etudiant etudiant) {
        this.etudiant = etudiant;
    }

    public OffreStage getOffreStage() {
        return offreStage;
    }

    public void setOffreStage(OffreStage offreStage) {
        this.offreStage = offreStage;
    }
}
