package gn.univ_labe.unistage.service;

import gn.univ_labe.unistage.dto.OffreStageDTO;
import gn.univ_labe.unistage.model.*;
import gn.univ_labe.unistage.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class OffreService {

    @Autowired
    private OffreStageRepository offreRepository;

    @Autowired
    private EntrepriseRepository entrepriseRepository;

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    public List<OffreStageDTO> getOffresPubliques(String secteur, String motCle) {
        List<OffreStage> offres;
        if (secteur != null && !secteur.isBlank()) {
            offres = offreRepository.findByStatutAndEntrepriseSecteurActiviteContainingIgnoreCase(StatutOffre.OUVERTE, secteur);
        } else if (motCle != null && !motCle.isBlank()) {
            offres = offreRepository.findByTitreContainingIgnoreCaseOrDescriptionContainingIgnoreCase(motCle, motCle);
            offres = offres.stream().filter(o -> o.getStatut() == StatutOffre.OUVERTE).toList();
        } else {
            offres = offreRepository.findByStatut(StatutOffre.OUVERTE);
        }
        return offres.stream().map(this::mapToDTO).toList();
    }

    public List<OffreStageDTO> getAllOffres() {
        return offreRepository.findAll().stream().map(this::mapToDTO).toList();
    }

    public OffreStageDTO getOffreById(Long id) {
        OffreStage offre = offreRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Offre non trouvée avec l'ID: " + id));
        return mapToDTO(offre);
    }

    public List<OffreStageDTO> getOffresByEntrepriseEmail(String email) {
        Entreprise entreprise = entrepriseRepository.findByUtilisateurEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Entreprise non trouvée"));
        return offreRepository.findByEntrepriseId(entreprise.getId()).stream().map(this::mapToDTO).toList();
    }

    @Transactional
    public OffreStageDTO createOffre(OffreStageDTO dto, String userEmail) {
        Entreprise entreprise = entrepriseRepository.findByUtilisateurEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("Profil entreprise non trouvé"));

        OffreStage offre = new OffreStage(
                dto.getTitre(),
                dto.getDescription(),
                dto.getCompetencesRequises(),
                dto.getDateDebut(),
                dto.getDateFin(),
                dto.getLieu(),
                dto.getStatut() != null ? dto.getStatut() : StatutOffre.OUVERTE,
                entreprise
        );

        OffreStage saved = offreRepository.save(offre);
        return mapToDTO(saved);
    }

    @Transactional
    public OffreStageDTO updateOffre(Long id, OffreStageDTO dto, String userEmail) {
        OffreStage offre = offreRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Offre non trouvée"));

        // Vérification de propriété
        if (!offre.getEntreprise().getUtilisateur().getEmail().equals(userEmail)) {
            throw new IllegalStateException("Vous n'êtes pas autorisé à modifier cette offre");
        }

        offre.setTitre(dto.getTitre());
        offre.setDescription(dto.getDescription());
        offre.setCompetencesRequises(dto.getCompetencesRequises());
        offre.setDateDebut(dto.getDateDebut());
        offre.setDateFin(dto.getDateFin());
        offre.setLieu(dto.getLieu());
        if (dto.getStatut() != null) {
            offre.setStatut(dto.getStatut());
        }

        return mapToDTO(offreRepository.save(offre));
    }

    @Transactional
    public void deleteOffre(Long id, String userEmail, boolean isAdmin) {
        OffreStage offre = offreRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Offre non trouvée"));

        if (!isAdmin && !offre.getEntreprise().getUtilisateur().getEmail().equals(userEmail)) {
            throw new IllegalStateException("Vous n'êtes pas autorisé à supprimer cette offre");
        }

        offreRepository.delete(offre);
    }

    public OffreStageDTO mapToDTO(OffreStage offre) {
        OffreStageDTO dto = new OffreStageDTO();
        dto.setId(offre.getId());
        dto.setTitre(offre.getTitre());
        dto.setDescription(offre.getDescription());
        dto.setCompetencesRequises(offre.getCompetencesRequises());
        dto.setDateDebut(offre.getDateDebut());
        dto.setDateFin(offre.getDateFin());
        dto.setLieu(offre.getLieu());
        dto.setStatut(offre.getStatut());
        dto.setCreatedAt(offre.getCreatedAt());
        
        if (offre.getEntreprise() != null) {
            dto.setEntrepriseId(offre.getEntreprise().getId());
            dto.setRaisonSociale(offre.getEntreprise().getRaisonSociale());
            dto.setSecteurActivite(offre.getEntreprise().getSecteurActivite());
            if (offre.getEntreprise().getUtilisateur() != null) {
                dto.setEmailContact(offre.getEntreprise().getUtilisateur().getEmail());
            }
        }
        
        if (offre.getCandidatures() != null) {
            dto.setNombreCandidatures(offre.getCandidatures().size());
        }
        return dto;
    }
}
