package gn.univ_labe.unistage.controller;

import gn.univ_labe.unistage.dto.StatutUpdateRequest;
import gn.univ_labe.unistage.model.Entreprise;
import gn.univ_labe.unistage.model.Etudiant;
import gn.univ_labe.unistage.model.StatutValidation;
import gn.univ_labe.unistage.service.AdminService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private AdminService adminService;

    // --- ENTREPRISES ---
    @GetMapping("/entreprises")
    public ResponseEntity<List<Entreprise>> getAllEntreprises(
            @RequestParam(required = false) String statut) {
        if (statut != null && !statut.isBlank()) {
            return ResponseEntity.ok(adminService.getEntreprisesByStatut(StatutValidation.valueOf(statut.toUpperCase())));
        }
        return ResponseEntity.ok(adminService.getAllEntreprises());
    }

    @PatchMapping("/entreprises/{id}/validation")
    public ResponseEntity<Entreprise> validerEntreprise(
            @PathVariable Long id,
            @Valid @RequestBody StatutUpdateRequest request) {
        StatutValidation nouveauStatut = StatutValidation.valueOf(request.getStatut().toUpperCase());
        return ResponseEntity.ok(adminService.validerEntreprise(id, nouveauStatut));
    }

    @DeleteMapping("/entreprises/{id}")
    public ResponseEntity<Void> deleteEntreprise(@PathVariable Long id) {
        adminService.deleteEntreprise(id);
        return ResponseEntity.noContent().build();
    }

    // --- ÉTUDIANTS (CONTRÔLE TOTAL ADMIN) ---
    @GetMapping("/etudiants")
    public ResponseEntity<List<Etudiant>> getAllEtudiants() {
        return ResponseEntity.ok(adminService.getAllEtudiants());
    }

    @GetMapping("/etudiants/{id}")
    public ResponseEntity<Etudiant> getEtudiantById(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.getEtudiantById(id));
    }

    @PutMapping("/etudiants/{id}")
    public ResponseEntity<Etudiant> updateEtudiant(@PathVariable Long id, @RequestBody Etudiant updatedInfo) {
        return ResponseEntity.ok(adminService.updateEtudiant(id, updatedInfo));
    }

    @DeleteMapping("/etudiants/{id}")
    public ResponseEntity<Void> deleteEtudiant(@PathVariable Long id) {
        adminService.deleteEtudiant(id);
        return ResponseEntity.noContent().build();
    }

    // --- STATISTIQUES ---
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        return ResponseEntity.ok(adminService.getGlobalStats());
    }
}
