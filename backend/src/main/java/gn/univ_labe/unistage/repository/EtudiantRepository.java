package gn.univ_labe.unistage.repository;

import gn.univ_labe.unistage.model.Etudiant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EtudiantRepository extends JpaRepository<Etudiant, Long> {
    Optional<Etudiant> findByUtilisateurId(Long utilisateurId);
    Optional<Etudiant> findByUtilisateurEmail(String email);
    Optional<Etudiant> findByMatricule(String matricule);
    Boolean existsByMatricule(String matricule);
}
