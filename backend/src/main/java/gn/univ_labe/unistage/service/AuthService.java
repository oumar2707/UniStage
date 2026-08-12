package gn.univ_labe.unistage.service;

import gn.univ_labe.unistage.dto.*;
import gn.univ_labe.unistage.model.*;
import gn.univ_labe.unistage.repository.*;
import gn.univ_labe.unistage.security.CustomUserDetails;
import gn.univ_labe.unistage.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @Autowired
    private EtudiantRepository etudiantRepository;

    @Autowired
    private EntrepriseRepository entrepriseRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    public JwtResponse authenticateUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getMotDePasse()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        Long profileId = null;
        if (userDetails.getRole() == RoleEnum.ETUDIANT) {
            profileId = etudiantRepository.findByUtilisateurId(userDetails.getId())
                    .map(Etudiant::getId).orElse(null);
        } else if (userDetails.getRole() == RoleEnum.ENTREPRISE) {
            profileId = entrepriseRepository.findByUtilisateurId(userDetails.getId())
                    .map(Entreprise::getId).orElse(null);
        }

        return new JwtResponse(
                jwt,
                userDetails.getId(),
                userDetails.getNom(),
                userDetails.getPrenom(),
                userDetails.getUsername(),
                userDetails.getRole(),
                profileId
        );
    }

    @Transactional
    public UserDTO registerEtudiant(RegisterEtudiantRequest request) {
        if (utilisateurRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("L'adresse email est déjà utilisée.");
        }
        if (etudiantRepository.existsByMatricule(request.getMatricule())) {
            throw new IllegalArgumentException("Le matricule est déjà enregistré.");
        }

        Utilisateur user = new Utilisateur(
                request.getNom(),
                request.getPrenom(),
                request.getEmail(),
                passwordEncoder.encode(request.getMotDePasse()),
                RoleEnum.ETUDIANT
        );

        Etudiant etudiant = new Etudiant(
                request.getMatricule(),
                request.getFiliere(),
                request.getNiveau(),
                request.getTelephone(),
                request.getCv(),
                user
        );

        etudiantRepository.save(etudiant);

        return new UserDTO(user.getId(), user.getNom(), user.getPrenom(), user.getEmail(), user.getRole(), user.getCreatedAt());
    }

    @Transactional
    public UserDTO registerEntreprise(RegisterEntrepriseRequest request) {
        if (utilisateurRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("L'adresse email est déjà utilisée.");
        }

        Utilisateur user = new Utilisateur(
                request.getNom(),
                request.getPrenom(),
                request.getEmail(),
                passwordEncoder.encode(request.getMotDePasse()),
                RoleEnum.ENTREPRISE
        );

        Entreprise entreprise = new Entreprise(
                request.getRaisonSociale(),
                request.getSecteurActivite(),
                request.getAdresse(),
                request.getSiteWeb(),
                StatutValidation.VALIDE, // Auto-validé ou modérable par admin
                user
        );

        entrepriseRepository.save(entreprise);

        return new UserDTO(user.getId(), user.getNom(), user.getPrenom(), user.getEmail(), user.getRole(), user.getCreatedAt());
    }
}
