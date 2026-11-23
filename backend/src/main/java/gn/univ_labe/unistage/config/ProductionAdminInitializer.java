package gn.univ_labe.unistage.config;

import gn.univ_labe.unistage.model.RoleEnum;
import gn.univ_labe.unistage.model.Utilisateur;
import gn.univ_labe.unistage.repository.UtilisateurRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@Profile("!dev")
public class ProductionAdminInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(ProductionAdminInitializer.class);

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${app.admin.email:${ADMIN_EMAIL:}}")
    private String adminEmail;

    @Value("${app.admin.password:${ADMIN_PASSWORD:}}")
    private String adminPassword;

    @Override
    public void run(String... args) throws Exception {
        if (adminEmail == null || adminEmail.isBlank() || adminPassword == null || adminPassword.isBlank()) {
            log.info("Initialisation Admin Prod : ADMIN_EMAIL ou ADMIN_PASSWORD non défini. Aucun compte admin par défaut créé.");
            return;
        }

        Optional<Utilisateur> existing = utilisateurRepository.findByEmail(adminEmail.trim());
        if (existing.isPresent()) {
            log.info("Initialisation Admin Prod : Le compte administrateur '{}' existe déjà. Le mot de passe reste inchangé.", adminEmail.trim());
        } else {
            Utilisateur admin = new Utilisateur(
                    "Admin",
                    "UniStage",
                    adminEmail.trim(),
                    passwordEncoder.encode(adminPassword),
                    RoleEnum.ADMIN
            );
            utilisateurRepository.save(admin);
            log.info("Initialisation Admin Prod : Le compte administrateur '{}' a été créé avec succès.", adminEmail.trim());
        }
    }
}
