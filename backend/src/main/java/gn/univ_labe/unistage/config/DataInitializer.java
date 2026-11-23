package gn.univ_labe.unistage.config;

import gn.univ_labe.unistage.model.*;
import gn.univ_labe.unistage.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Optional;

@Component
@Profile({"dev", "demo"})
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @Autowired
    private EtudiantRepository etudiantRepository;

    @Autowired
    private EntrepriseRepository entrepriseRepository;

    @Autowired
    private OffreStageRepository offreRepository;

    @Autowired
    private CandidatureRepository candidatureRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${app.demo.admin-password:AdminDev123!}")
    private String adminPassword;

    @Value("${app.demo.etudiant-password:EtudiantDev123!}")
    private String etudiantPassword;

    @Value("${app.demo.entreprise-password:EntrepriseDev123!}")
    private String entreprisePassword;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        System.out.println(">>> [UniStage] Initialisation des données de démo (Profil DEV)...");

        // 1. COMPTE ADMIN DE DÉMO
        String adminEmail = "admin@demo.local";
        Optional<Utilisateur> existingAdmin = utilisateurRepository.findByEmail(adminEmail);
        if (existingAdmin.isEmpty()) {
            Utilisateur adminUser = new Utilisateur("Admin", "Démo", adminEmail, passwordEncoder.encode(adminPassword), RoleEnum.ADMIN);
            utilisateurRepository.save(adminUser);
            System.out.println("   [+] Compte Admin démo créé : " + adminEmail);
        }

        // 2. ÉTUDIANTS DE DÉMO
        Etudiant etudiant1 = syncEtudiant(
                "etudiant1@demo.local",
                etudiantPassword,
                "Diallo",
                "Alpha",
                "ETU-2026-001",
                "Licence 3 Informatique",
                "L3",
                "+224620000001",
                "cv_etudiant1_demo.pdf"
        );

        Etudiant etudiant2 = syncEtudiant(
                "etudiant2@demo.local",
                etudiantPassword,
                "Barry",
                "Mariama",
                "ETU-2026-002",
                "Licence 3 Informatique",
                "L3",
                "+224620000002",
                "cv_etudiant2_demo.pdf"
        );

        // 3. ENTREPRISES DE DÉMO
        Entreprise entreprise1 = syncEntreprise(
                "entreprise1@demo.local",
                entreprisePassword,
                "Directeur Technique",
                "Responsable Recrutement",
                "TechGuinée SARL",
                "Informatique & Télécommunications",
                "Centre-ville, Labé",
                "https://entreprise1.demo.local"
        );

        Entreprise entreprise2 = syncEntreprise(
                "entreprise2@demo.local",
                entreprisePassword,
                "Fondateur",
                "RH",
                "Labé Solutions Tech",
                "Développement Web & IA",
                "Quartier Tata, Labé",
                "https://entreprise2.demo.local"
        );

        // 4. OFFRES DE STAGE DE DÉMO
        syncOffre(
                "Stagiaire Développeur Full-Stack Java / Spring Boot & Angular",
                "TechGuinée SARL recherche un stagiaire motivé de l'Université de Labé pour participer au développement et à l'évolution de nos plateformes web.",
                "Java 17, Spring Boot, Angular, PostgreSQL, Git",
                LocalDate.now().plusDays(10),
                LocalDate.now().plusMonths(6),
                "Labé (Hybride)",
                entreprise1
        );

        syncOffre(
                "Stagiaire Développeur Front-End Web",
                "Labé Solutions Tech propose un stage pratique pour concevoir des interfaces réactives et modernes en Angular.",
                "Angular, TypeScript, HTML5/CSS3, REST API",
                LocalDate.now().plusDays(15),
                LocalDate.now().plusMonths(4),
                "Labé (Présentiel)",
                entreprise2
        );

        // 5. CANDIDATURE DE DÉMO
        if (candidatureRepository.count() == 0) {
            offreRepository.findAll().stream().findFirst().ifPresent(offre -> {
                Candidature candidature = new Candidature(
                        "Madame, Monsieur,\nActuellement étudiant en Licence 3 Informatique à l'Université de Labé, je vous soumets ma candidature pour ce stage.",
                        "cv_etudiant1_demo.pdf",
                        StatutCandidature.EN_ATTENTE,
                        etudiant1,
                        offre
                );
                candidatureRepository.save(candidature);
            });
        }

        System.out.println(">>> [UniStage] Données de démonstration initialisées avec succès !");
    }

    private Etudiant syncEtudiant(String email, String pass, String nom, String prenom, String matricule, String filiere, String niveau, String tel, String cv) {
        Optional<Utilisateur> optUser = utilisateurRepository.findByEmail(email);
        Utilisateur user;
        if (optUser.isEmpty()) {
            user = new Utilisateur(nom, prenom, email, passwordEncoder.encode(pass), RoleEnum.ETUDIANT);
            user = utilisateurRepository.save(user);
        } else {
            user = optUser.get();
        }

        Optional<Etudiant> optEtudiant = etudiantRepository.findByUtilisateurId(user.getId());
        if (optEtudiant.isEmpty()) {
            optEtudiant = etudiantRepository.findByMatricule(matricule);
        }

        if (optEtudiant.isEmpty()) {
            Etudiant etudiant = new Etudiant(matricule, filiere, niveau, tel, cv, user);
            return etudiantRepository.save(etudiant);
        } else {
            return optEtudiant.get();
        }
    }

    private Entreprise syncEntreprise(String email, String pass, String nom, String prenom, String raisonSociale, String secteur, String adresse, String siteWeb) {
        Optional<Utilisateur> existingUser = utilisateurRepository.findByEmail(email);
        Utilisateur user;
        if (existingUser.isEmpty()) {
            user = new Utilisateur(nom, prenom, email, passwordEncoder.encode(pass), RoleEnum.ENTREPRISE);
            user = utilisateurRepository.save(user);
        } else {
            user = existingUser.get();
        }

        final Utilisateur finalUser = user;
        Optional<Entreprise> existingEnt = entrepriseRepository.findByUtilisateurId(user.getId());
        if (existingEnt.isEmpty()) {
            Entreprise ent = new Entreprise(raisonSociale, secteur, adresse, siteWeb, StatutValidation.VALIDE, finalUser);
            return entrepriseRepository.save(ent);
        } else {
            return existingEnt.get();
        }
    }

    private void syncOffre(String titre, String desc, String comp, LocalDate debut, LocalDate fin, String lieu, Entreprise entreprise) {
        boolean exists = offreRepository.findAll().stream()
                .anyMatch(o -> o.getTitre().equalsIgnoreCase(titre) && o.getEntreprise().getId().equals(entreprise.getId()));

        if (!exists) {
            OffreStage offre = new OffreStage(titre, desc, comp, debut, fin, lieu, StatutOffre.OUVERTE, entreprise);
            offreRepository.save(offre);
            System.out.println("   [+] Offre de démo créée : " + titre);
        }
    }
}
