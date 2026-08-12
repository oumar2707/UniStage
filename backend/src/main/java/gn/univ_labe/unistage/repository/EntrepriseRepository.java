package gn.univ_labe.unistage.repository;

import gn.univ_labe.unistage.model.Entreprise;
import gn.univ_labe.unistage.model.StatutValidation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EntrepriseRepository extends JpaRepository<Entreprise, Long> {
    Optional<Entreprise> findByUtilisateurId(Long utilisateurId);
    Optional<Entreprise> findByUtilisateurEmail(String email);
    
    // Custom Query Methods
    List<Entreprise> findByStatutValidation(StatutValidation statutValidation);
    List<Entreprise> findBySecteurActiviteContainingIgnoreCase(String secteurActivite);
}
