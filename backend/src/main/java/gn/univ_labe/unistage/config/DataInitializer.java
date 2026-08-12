package gn.univ_labe.unistage.config;

import gn.univ_labe.unistage.model.*;
import gn.univ_labe.unistage.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Optional;

@Component
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

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        System.out.println(">>> [UniStage] Initialisation et synchronisation complète de la base MySQL...");

        // 1. COMPTE ADMIN (dialoalphoumar021@gmail.com / Aoddiallo)
        Optional<Utilisateur> existingAdmin = utilisateurRepository.findByEmail("dialoalphoumar021@gmail.com");
        Utilisateur adminUser;
        if (existingAdmin.isEmpty()) {
            adminUser = new Utilisateur("DIALLO", "Alpha Oumar", "dialoalphoumar021@gmail.com", passwordEncoder.encode("Aoddiallo"), RoleEnum.ADMIN);
            adminUser = utilisateurRepository.save(adminUser);
            System.out.println("   [+] Compte Admin créé : dialoalphoumar021@gmail.com");
        } else {
            adminUser = existingAdmin.get();
            adminUser.setMotDePasse(passwordEncoder.encode("Aoddiallo"));
            adminUser.setNom("DIALLO");
            adminUser.setPrenom("Alpha Oumar");
            utilisateurRepository.save(adminUser);
            System.out.println("   [✓] Compte Admin mis à jour : dialoalphoumar021@gmail.com");
        }

        // Nettoyage de l'ancien admin générique
        utilisateurRepository.findByEmail("admin@univ-labe.edu.gn").ifPresent(u -> utilisateurRepository.delete(u));

        // 2. ÉTUDIANT 1 : Mamadou Saliou BARRY (Saliou@gmail.com / Saliou123)
        Etudiant etudiantSaliou = syncEtudiant(
                "Saliou@gmail.com",
                "Saliou123",
                "BARRY",
                "Mamadou Saliou",
                "ETU-2026-001",
                "Licence 3 Informatique",
                "L3",
                "+224620112233",
                "cv_mamadou_saliou_barry.pdf"
        );

        // 3. ÉTUDIANT 2 : Mariama Siiré DIALLO (Sire@gmail.com / Sire@gmail.com)
        Etudiant etudiantSire = syncEtudiant(
                "Sire@gmail.com",
                "Sire@gmail.com",
                "DIALLO",
                "Mariama Siiré",
                "ETU-2026-002",
                "Licence 3 Informatique",
                "L3",
                "+224622445566",
                "cv_mariama_sire_diallo.pdf"
        );

        // 4. SYNCHRONISATION DES 5 ENTREPRISES RÉELLES
        Entreprise entrepriseKouma = syncEntreprise(
                "contact@koumaacademy.com",
                "Kouma2026!",
                "KOUMA",
                "Responsable Recrutement",
                "Kouma Academy",
                "Formation Tech & Intelligence Artificielle",
                "Nongo / Kipé, Conakry",
                "https://koumaacademy.com"
        );

        Entreprise entrepriseNesten = syncEntreprise(
                "contact@nestengroup.com",
                "Nesten2026!",
                "NESTEN",
                "Direction RH",
                "Nesten Group",
                "Ingénierie & Systèmes d'Information",
                "Centre-ville, Conakry / Labé",
                "https://nestengroup.com"
        );

        Entreprise entrepriseAnsuten = syncEntreprise(
                "contact@ansuten.gov.gn",
                "Ansuten2026!",
                "ANSUTEN",
                "Service Stages & Innovation",
                "ANSUTEN Guinée",
                "Télécommunications & Inclusion Numérique",
                "Kaloum, Conakry",
                "https://ansuten.gov.gn"
        );

        Entreprise entrepriseOrange = syncEntreprise(
                "contact@orange-guinee.gn",
                "Entreprise123!",
                "ORANGE",
                "Directeur Régional",
                "Orange Guinée Labé",
                "Télécommunications & Informatique",
                "Quartier Tata, Labé",
                "https://orange-guinee.gn"
        );

        Entreprise entrepriseSylla = syncEntreprise(
                "contact@syllatech.gn",
                "Sylla123!",
                "SYLLA",
                "Fondateur Tech",
                "Sylla Tech Labs",
                "Développement Web & IA",
                "Labé / Conakry",
                "https://syllatech.gn"
        );

        // 5. SYNCHRONISATION DES OFFRES DE STAGE POUR CHAQUE ENTREPRISE
        syncOffre(
                "Stagiaire Développeur Python & Intelligence Artificielle",
                "Kouma Academy recherche des étudiants motivés de l'Université de Labé pour participer à nos projets d'IA, de vision par ordinateur et de développement web.",
                "Python, FastAPI, TensorFlow, Git, Angular",
                LocalDate.now().plusDays(10),
                LocalDate.now().plusMonths(6),
                "Nongo, Conakry (Hybride)",
                entrepriseKouma
        );

        syncOffre(
                "Développeur Full-Stack Java / Spring Boot & Angular",
                "Nesten Group recrute des stagiaires pour le développement et la maintenance de solutions d'entreprise sous Spring Boot 3 et Angular 18.",
                "Java 21, Spring Boot, Angular 18, MySQL, REST API",
                LocalDate.now().plusDays(15),
                LocalDate.now().plusMonths(5),
                "Conakry / Labé",
                entrepriseNesten
        );

        syncOffre(
                "Assistant Administrateur Réseaux & Telecommunication",
                "Stage pratique au sein de l'ANSUTEN pour accompagner le déploiement des infrastructures réseaux universitaires et des centres d'inclusion numérique.",
                "Cisco, TCP/IP, Linux Debian, Sécurité Informatique",
                LocalDate.now().plusDays(20),
                LocalDate.now().plusMonths(6),
                "Kaloum, Conakry",
                entrepriseAnsuten
        );

        syncOffre(
                "Administrateur Réseaux & Sécurité Télécoms",
                "Stage de 3 mois au sein de l'équipe infrastructure réseaux et sécurité télécoms à la direction régionale d'Orange Guinée à Labé.",
                "Cisco, TCP/IP, Linux Debian/Ubuntu, Sécurité Réseau",
                LocalDate.now().plusDays(12),
                LocalDate.now().plusMonths(3),
                "Quartier Tata, Labé",
                entrepriseOrange
        );

        syncOffre(
                "Développeur Front-End Web & Mobile",
                "Conception d'interfaces utilisateurs modernes et réactives en Angular et TypeScript pour nos applications clients chez Sylla Tech Labs.",
                "Angular 18, TypeScript, HTML5/CSS3, Flexbox/Grid, REST",
                LocalDate.now().plusDays(5),
                LocalDate.now().plusMonths(4),
                "Labé (Centre)",
                entrepriseSylla
        );

        // 6. CANDIDATURES INITIALES
        if (candidatureRepository.count() == 0) {
            offreRepository.findAll().stream().findFirst().ifPresent(o -> {
                Candidature cand1 = new Candidature(
                        "Madame, Monsieur,\nÉtudiant en Licence 3 Informatique à l'Université de Labé, je pose ma candidature avec enthousiasme pour l'offre de stage.",
                        StatutCandidature.EN_ATTENTE,
                        etudiantSaliou,
                        o
                );
                candidatureRepository.save(cand1);
            });
        }

        System.out.println(">>> [UniStage] Toutes les entreprises et leurs offres ont été synchronisées avec succès !");
    }

    private Etudiant syncEtudiant(String email, String pass, String nom, String prenom, String matricule, String filiere, String niveau, String tel, String cv) {
        Optional<Utilisateur> optUser = utilisateurRepository.findByEmail(email);
        Utilisateur user;
        if (optUser.isEmpty()) {
            user = new Utilisateur(nom, prenom, email, passwordEncoder.encode(pass), RoleEnum.ETUDIANT);
            user = utilisateurRepository.save(user);
        } else {
            user = optUser.get();
            user.setMotDePasse(passwordEncoder.encode(pass));
            user.setNom(nom);
            user.setPrenom(prenom);
            user = utilisateurRepository.save(user);
        }

        Optional<Etudiant> optEtudiant = etudiantRepository.findByUtilisateurId(user.getId());
        if (optEtudiant.isEmpty()) {
            optEtudiant = etudiantRepository.findByMatricule(matricule);
        }

        if (optEtudiant.isEmpty()) {
            Etudiant etudiant = new Etudiant(matricule, filiere, niveau, tel, cv, user);
            return etudiantRepository.save(etudiant);
        } else {
            Etudiant etudiant = optEtudiant.get();
            etudiant.setMatricule(matricule);
            etudiant.setFiliere(filiere);
            etudiant.setNiveau(niveau);
            etudiant.setTelephone(tel);
            etudiant.setCv(cv);
            etudiant.setUtilisateur(user);
            return etudiantRepository.save(etudiant);
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
            user.setMotDePasse(passwordEncoder.encode(pass));
            utilisateurRepository.save(user);
        }

        final Utilisateur finalUser = user;
        Optional<Entreprise> existingEnt = entrepriseRepository.findByUtilisateurId(user.getId());
        if (existingEnt.isEmpty()) {
            Entreprise ent = new Entreprise(raisonSociale, secteur, adresse, siteWeb, StatutValidation.VALIDE, finalUser);
            return entrepriseRepository.save(ent);
        } else {
            Entreprise ent = existingEnt.get();
            ent.setRaisonSociale(raisonSociale);
            ent.setSecteurActivite(secteur);
            ent.setAdresse(adresse);
            ent.setSiteWeb(siteWeb);
            ent.setStatutValidation(StatutValidation.VALIDE);
            return entrepriseRepository.save(ent);
        }
    }

    private void syncOffre(String titre, String desc, String comp, LocalDate debut, LocalDate fin, String lieu, Entreprise entreprise) {
        boolean exists = offreRepository.findAll().stream()
                .anyMatch(o -> o.getTitre().equalsIgnoreCase(titre) && o.getEntreprise().getId().equals(entreprise.getId()));
        
        if (!exists) {
            OffreStage offre = new OffreStage(titre, desc, comp, debut, fin, lieu, StatutOffre.OUVERTE, entreprise);
            offreRepository.save(offre);
            System.out.println("   [+] Offre de stage créée : " + titre + " (" + entreprise.getRaisonSociale() + ")");
        }
    }
}
