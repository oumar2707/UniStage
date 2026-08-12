package gn.univ_labe.unistage.controller;

import gn.univ_labe.unistage.dto.CandidatureDTO;
import gn.univ_labe.unistage.dto.StatutUpdateRequest;
import gn.univ_labe.unistage.model.StatutCandidature;
import gn.univ_labe.unistage.service.CandidatureService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class CandidatureController {

    @Autowired
    private CandidatureService candidatureService;

    // === ENDPOINTS ÉTUDIANT ===
    @PostMapping("/etudiant/candidatures")
    @PreAuthorize("hasRole('ETUDIANT')")
    public ResponseEntity<CandidatureDTO> postuler(
            @RequestParam Long offreId,
            @RequestBody @Valid CandidatureDTO dto,
            Authentication authentication) {
        CandidatureDTO created = candidatureService.postuler(offreId, dto.getLettreMotivation(), dto.getCv(), authentication.getName());
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping("/etudiant/candidatures")
    @PreAuthorize("hasRole('ETUDIANT')")
    public ResponseEntity<List<CandidatureDTO>> getMesCandidaturesEtudiant(Authentication authentication) {
        return ResponseEntity.ok(candidatureService.getCandidaturesByEtudiant(authentication.getName()));
    }

    // === ENDPOINTS ENTREPRISE ===
    @GetMapping("/entreprise/candidatures")
    @PreAuthorize("hasRole('ENTREPRISE')")
    public ResponseEntity<List<CandidatureDTO>> getCandidaturesEntreprise(Authentication authentication) {
        return ResponseEntity.ok(candidatureService.getCandidaturesByEntreprise(authentication.getName()));
    }

    @GetMapping("/entreprise/offres/{offreId}/candidatures")
    @PreAuthorize("hasRole('ENTREPRISE')")
    public ResponseEntity<List<CandidatureDTO>> getCandidaturesByOffre(
            @PathVariable Long offreId,
            Authentication authentication) {
        return ResponseEntity.ok(candidatureService.getCandidaturesByOffre(offreId, authentication.getName()));
    }

    @PatchMapping("/entreprise/candidatures/{id}/statut")
    @PreAuthorize("hasRole('ENTREPRISE')")
    public ResponseEntity<CandidatureDTO> updateStatutCandidature(
            @PathVariable Long id,
            @Valid @RequestBody StatutUpdateRequest request,
            Authentication authentication) {
        StatutCandidature nouveauStatut = StatutCandidature.valueOf(request.getStatut().toUpperCase());
        return ResponseEntity.ok(candidatureService.updateStatutCandidature(id, nouveauStatut, authentication.getName()));
    }
}
