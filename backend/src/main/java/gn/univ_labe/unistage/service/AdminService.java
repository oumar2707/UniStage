package gn.univ_labe.unistage.service;

import gn.univ_labe.unistage.model.*;
import gn.univ_labe.unistage.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminService {

    @Autowired
    private EntrepriseRepository entrepriseRepository;

    @Autowired
    private EtudiantRepository etudiantRepository;

    @Autowired
    private OffreStageRepository offreRepository;

    @Autowired
    private CandidatureRepository candidatureRepository;

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    // --- GESTION DES ENTREPRISES ---
    public List<Entreprise> getAllEntreprises() {
        return entrepriseRepository.findAll();
    }

    public List<Entreprise> getEntreprisesByStatut(StatutValidation statut) {
        return entrepriseRepository.findByStatutValidation(statut);
    }

    @Transactional
    public Entreprise validerEntreprise(Long entrepriseId, StatutValidation statut) {
        Entreprise entreprise = entrepriseRepository.findById(entrepriseId)
                .orElseThrow(() -> new IllegalArgumentException("Entreprise non trouvée avec l'ID: " + entrepriseId));
        entreprise.setStatutValidation(statut);
        return entrepriseRepository.save(entreprise);
    }

    @Transactional
    public void deleteEntreprise(Long entrepriseId) {
        Entreprise entreprise = entrepriseRepository.findById(entrepriseId)
                .orElseThrow(() -> new IllegalArgumentException("Entreprise non trouvée"));
        entrepriseRepository.delete(entreprise);
    }

    // --- GESTION DES ÉTUDIANTS (ADMIN CONTROL) ---
    public List<Etudiant> getAllEtudiants() {
        return etudiantRepository.findAll();
    }

    public Etudiant getEtudiantById(Long etudiantId) {
        return etudiantRepository.findById(etudiantId)
                .orElseThrow(() -> new IllegalArgumentException("Étudiant non trouvé avec l'ID: " + etudiantId));
    }

    @Transactional
    public Etudiant updateEtudiant(Long etudiantId, Etudiant updatedInfo) {
        Etudiant etudiant = etudiantRepository.findById(etudiantId)
                .orElseThrow(() -> new IllegalArgumentException("Étudiant non trouvé avec l'ID: " + etudiantId));
        
        if (updatedInfo.getMatricule() != null && !updatedInfo.getMatricule().isBlank()) {
            etudiant.setMatricule(updatedInfo.getMatricule());
        }
        if (updatedInfo.getFiliere() != null && !updatedInfo.getFiliere().isBlank()) {
            etudiant.setFiliere(updatedInfo.getFiliere());
        }
        if (updatedInfo.getNiveau() != null && !updatedInfo.getNiveau().isBlank()) {
            etudiant.setNiveau(updatedInfo.getNiveau());
        }
        if (updatedInfo.getTelephone() != null) {
            etudiant.setTelephone(updatedInfo.getTelephone());
        }

        if (etudiant.getUtilisateur() != null && updatedInfo.getUtilisateur() != null) {
            Utilisateur user = etudiant.getUtilisateur();
            if (updatedInfo.getUtilisateur().getNom() != null) user.setNom(updatedInfo.getUtilisateur().getNom());
            if (updatedInfo.getUtilisateur().getPrenom() != null) user.setPrenom(updatedInfo.getUtilisateur().getPrenom());
            utilisateurRepository.save(user);
        }

        return etudiantRepository.save(etudiant);
    }

    @Transactional
    public void deleteEtudiant(Long etudiantId) {
        Etudiant etudiant = etudiantRepository.findById(etudiantId)
                .orElseThrow(() -> new IllegalArgumentException("Étudiant non trouvé avec l'ID: " + etudiantId));
        
        // Supprimer d'abord l'utilisateur associé s'il existe
        Utilisateur user = etudiant.getUtilisateur();
        etudiantRepository.delete(etudiant);
        if (user != null) {
            utilisateurRepository.delete(user);
        }
    }

    // --- STATISTIQUES GLOBALES ADMIN ---
    public Map<String, Object> getGlobalStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalEtudiants", etudiantRepository.count());
        stats.put("totalEntreprises", entrepriseRepository.count());
        stats.put("totalOffres", offreRepository.count());
        stats.put("totalCandidatures", candidatureRepository.count());
        stats.put("entreprisesValides", entrepriseRepository.findByStatutValidation(StatutValidation.VALIDE).size());
        stats.put("entreprisesEnAttente", entrepriseRepository.findByStatutValidation(StatutValidation.EN_ATTENTE).size());
        return stats;
    }
}
