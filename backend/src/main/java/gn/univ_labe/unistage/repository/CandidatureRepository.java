package gn.univ_labe.unistage.repository;

import gn.univ_labe.unistage.model.Candidature;
import gn.univ_labe.unistage.model.StatutCandidature;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CandidatureRepository extends JpaRepository<Candidature, Long> {
    
    // Custom Query Methods (Exigence CDC #10)
    List<Candidature> findByStatut(StatutCandidature statut);
    
    List<Candidature> findByEtudiantId(Long etudiantId);
    
    List<Candidature> findByEtudiantIdAndStatut(Long etudiantId, StatutCandidature statut);
    
    List<Candidature> findByOffreStageId(Long offreStageId);
    
    List<Candidature> findByOffreStageEntrepriseId(Long entrepriseId);
    
    Boolean existsByEtudiantIdAndOffreStageId(Long etudiantId, Long offreStageId);
}
