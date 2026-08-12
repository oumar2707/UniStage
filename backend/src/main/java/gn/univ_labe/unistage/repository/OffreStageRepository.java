package gn.univ_labe.unistage.repository;

import gn.univ_labe.unistage.model.OffreStage;
import gn.univ_labe.unistage.model.StatutOffre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OffreStageRepository extends JpaRepository<OffreStage, Long> {
    
    // Custom Query Methods (Exigence CDC #10)
    List<OffreStage> findByStatut(StatutOffre statut);
    
    List<OffreStage> findByEntrepriseSecteurActiviteContainingIgnoreCase(String secteur);
    
    List<OffreStage> findByStatutAndEntrepriseSecteurActiviteContainingIgnoreCase(StatutOffre statut, String secteur);
    
    List<OffreStage> findByTitreContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String titre, String description);
    
    List<OffreStage> findByEntrepriseId(Long entrepriseId);
}
