package gn.univ_labe.unistage.controller;

import gn.univ_labe.unistage.dto.OffreStageDTO;
import gn.univ_labe.unistage.service.OffreService;
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
public class OffreController {

    @Autowired
    private OffreService offreService;

    // === ENDPOINTS PUBLICS ===
    @GetMapping({"/offres/public", "/offres/publiques"})
    public ResponseEntity<List<OffreStageDTO>> getOffresPubliques(
            @RequestParam(required = false) String secteur,
            @RequestParam(required = false) String motCle) {
        return ResponseEntity.ok(offreService.getOffresPubliques(secteur, motCle));
    }

    @GetMapping({"/offres/public/{id}", "/offres/publiques/{id}"})
    public ResponseEntity<OffreStageDTO> getOffrePublicById(@PathVariable Long id) {
        return ResponseEntity.ok(offreService.getOffreById(id));
    }

    // === ENDPOINTS ENTREPRISE ===
    @GetMapping({"/entreprise/offres", "/offres/entreprise"})
    @PreAuthorize("hasRole('ENTREPRISE')")
    public ResponseEntity<List<OffreStageDTO>> getOffresEntreprise(Authentication authentication) {
        return ResponseEntity.ok(offreService.getOffresByEntrepriseEmail(authentication.getName()));
    }

    @PostMapping({"/entreprise/offres", "/offres"})
    @PreAuthorize("hasRole('ENTREPRISE')")
    public ResponseEntity<OffreStageDTO> createOffre(@Valid @RequestBody OffreStageDTO dto, Authentication authentication) {
        OffreStageDTO created = offreService.createOffre(dto, authentication.getName());
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/entreprise/offres/{id}")
    @PreAuthorize("hasRole('ENTREPRISE')")
    public ResponseEntity<OffreStageDTO> updateOffre(
            @PathVariable Long id,
            @Valid @RequestBody OffreStageDTO dto,
            Authentication authentication) {
        return ResponseEntity.ok(offreService.updateOffre(id, dto, authentication.getName()));
    }

    @DeleteMapping("/entreprise/offres/{id}")
    @PreAuthorize("hasRole('ENTREPRISE')")
    public ResponseEntity<Void> deleteOffreEntreprise(@PathVariable Long id, Authentication authentication) {
        offreService.deleteOffre(id, authentication.getName(), false);
        return ResponseEntity.noContent().build();
    }

    // === ENDPOINTS ADMIN ===
    @GetMapping("/admin/offres")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<OffreStageDTO>> getAllOffresAdmin() {
        return ResponseEntity.ok(offreService.getAllOffres());
    }

    @DeleteMapping("/admin/offres/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteOffreAdmin(@PathVariable Long id, Authentication authentication) {
        offreService.deleteOffre(id, authentication.getName(), true);
        return ResponseEntity.noContent().build();
    }
}
