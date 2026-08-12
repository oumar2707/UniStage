package gn.univ_labe.unistage.service;

import gn.univ_labe.unistage.dto.CandidatureDTO;
import gn.univ_labe.unistage.model.*;
import gn.univ_labe.unistage.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CandidatureService {

    @Autowired
    private CandidatureRepository candidatureRepository;

    @Autowired
    private EtudiantRepository etudiantRepository;

    @Autowired
    private OffreStageRepository offreRepository;

    @Autowired
    private EntrepriseRepository entrepriseRepository;

    @Transactional
    public CandidatureDTO postuler(Long offreId, String lettreMotivation, String cv, String studentEmail) {
        Etudiant etudiant = etudiantRepository.findByUtilisateurEmail(studentEmail)
                .orElseThrow(() -> new IllegalArgumentException("Profil étudiant introuvable"));

        OffreStage offre = offreRepository.findById(offreId)
                .orElseThrow(() -> new IllegalArgumentException("Offre de stage introuvable"));

        if (offre.getStatut() == StatutOffre.FERMEE) {
            throw new IllegalStateException("Cette offre de stage est fermée aux candidatures");
        }

        if (candidatureRepository.existsByEtudiantIdAndOffreStageId(etudiant.getId(), offre.getId())) {
            throw new IllegalStateException("Vous avez déjà postulé à cette offre de stage");
        }

        String finalCv = (cv != null && !cv.isBlank()) ? cv : etudiant.getCv();
        if (cv != null && !cv.isBlank()) {
            etudiant.setCv(cv);
            etudiantRepository.save(etudiant);
        }

        Candidature candidature = new Candidature(
                lettreMotivation,
                finalCv,
                StatutCandidature.EN_ATTENTE,
                etudiant,
                offre
        );

        return mapToDTO(candidatureRepository.save(candidature));
    }

    @Transactional
    public CandidatureDTO postuler(Long offreId, String lettreMotivation, String studentEmail) {
        return postuler(offreId, lettreMotivation, null, studentEmail);
    }

    public List<CandidatureDTO> getCandidaturesByEtudiant(String studentEmail) {
        Etudiant etudiant = etudiantRepository.findByUtilisateurEmail(studentEmail)
                .orElseThrow(() -> new IllegalArgumentException("Profil étudiant introuvable"));
        return candidatureRepository.findByEtudiantId(etudiant.getId()).stream().map(this::mapToDTO).toList();
    }

    public List<CandidatureDTO> getCandidaturesByEntreprise(String companyEmail) {
        Entreprise entreprise = entrepriseRepository.findByUtilisateurEmail(companyEmail)
                .orElseThrow(() -> new IllegalArgumentException("Profil entreprise introuvable"));
        return candidatureRepository.findByOffreStageEntrepriseId(entreprise.getId()).stream().map(this::mapToDTO).toList();
    }

    public List<CandidatureDTO> getCandidaturesByOffre(Long offreId, String companyEmail) {
        OffreStage offre = offreRepository.findById(offreId)
                .orElseThrow(() -> new IllegalArgumentException("Offre introuvable"));
        
        if (!offre.getEntreprise().getUtilisateur().getEmail().equals(companyEmail)) {
            throw new IllegalStateException("Vous n'avez pas accès aux candidatures de cette offre");
        }

        return candidatureRepository.findByOffreStageId(offreId).stream().map(this::mapToDTO).toList();
    }

    @Transactional
    public CandidatureDTO updateStatutCandidature(Long candidatureId, StatutCandidature nouveauStatut, String companyEmail) {
        Candidature candidature = candidatureRepository.findById(candidatureId)
                .orElseThrow(() -> new IllegalArgumentException("Candidature introuvable"));

        if (!candidature.getOffreStage().getEntreprise().getUtilisateur().getEmail().equals(companyEmail)) {
            throw new IllegalStateException("Vous n'êtes pas autorisé à modifier le statut de cette candidature");
        }

        candidature.setStatut(nouveauStatut);
        return mapToDTO(candidatureRepository.save(candidature));
    }

    public CandidatureDTO mapToDTO(Candidature c) {
        CandidatureDTO dto = new CandidatureDTO();
        dto.setId(c.getId());
        dto.setDateSoumission(c.getDateSoumission());
        dto.setLettreMotivation(c.getLettreMotivation());
        dto.setStatut(c.getStatut());

        String finalCv = (c.getCv() != null && !c.getCv().isBlank()) ? c.getCv() : (c.getEtudiant() != null ? c.getEtudiant().getCv() : null);
        dto.setCv(finalCv);

        if (c.getEtudiant() != null) {
            dto.setEtudiantId(c.getEtudiant().getId());
            dto.setMatricule(c.getEtudiant().getMatricule());
            dto.setFiliere(c.getEtudiant().getFiliere());
            dto.setNiveau(c.getEtudiant().getNiveau());
            dto.setTelephone(c.getEtudiant().getTelephone());
            if (c.getEtudiant().getUtilisateur() != null) {
                dto.setEtudiantNom(c.getEtudiant().getUtilisateur().getNom());
                dto.setEtudiantPrenom(c.getEtudiant().getUtilisateur().getPrenom());
                dto.setEtudiantEmail(c.getEtudiant().getUtilisateur().getEmail());
            }
        }

        if (c.getOffreStage() != null) {
            dto.setOffreStageId(c.getOffreStage().getId());
            dto.setOffreTitre(c.getOffreStage().getTitre());
            if (c.getOffreStage().getEntreprise() != null) {
                dto.setRaisonSocialeEntreprise(c.getOffreStage().getEntreprise().getRaisonSociale());
            }
        }

        return dto;
    }
}
