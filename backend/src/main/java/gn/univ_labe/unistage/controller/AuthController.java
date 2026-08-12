package gn.univ_labe.unistage.controller;

import gn.univ_labe.unistage.dto.*;
import gn.univ_labe.unistage.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<JwtResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        JwtResponse jwtResponse = authService.authenticateUser(loginRequest);
        return ResponseEntity.ok(jwtResponse);
    }

    @PostMapping("/register/etudiant")
    public ResponseEntity<UserDTO> registerEtudiant(@Valid @RequestBody RegisterEtudiantRequest request) {
        UserDTO user = authService.registerEtudiant(request);
        return new ResponseEntity<>(user, HttpStatus.CREATED);
    }

    @PostMapping("/register/entreprise")
    public ResponseEntity<UserDTO> registerEntreprise(@Valid @RequestBody RegisterEntrepriseRequest request) {
        UserDTO user = authService.registerEntreprise(request);
        return new ResponseEntity<>(user, HttpStatus.CREATED);
    }
}
