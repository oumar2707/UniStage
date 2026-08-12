# 🎓 UniStage — Plateforme de Gestion et de Suivi des Stages

> **Université de Labé (République de Guinée)**  
> *Faculté des Sciences et Techniques (FST) — Département d'Informatique*  
> *Plateforme Web Full-Stack Enterprise (Angular 18 & Spring Boot 3.2 / Java 21 LTS / MySQL 8)*

---

[![Version](https://img.shields.io/badge/Version-1.0.0--RELEASE-blue.svg?style=for-the-badge&logo=appveyor)](https://univ-labe.edu.gn)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2.5-brightgreen.svg?style=for-the-badge&logo=springboot)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-21_LTS-orange.svg?style=for-the-badge&logo=openjdk)](https://www.oracle.com/java/)
[![Angular](https://img.shields.io/badge/Angular-18_Standalone-red.svg?style=for-the-badge&logo=angular)](https://angular.dev/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-blue.svg?style=for-the-badge&logo=mysql)](https://www.mysql.com/)
[![Security](https://img.shields.io/badge/Security-JWT_%2B_BCrypt-purple.svg?style=for-the-badge&logo=jsonwebtokens)](https://jwt.io/)

---

## 📑 Table des Matières

- [1. 📌 Présentation Générale](#1--présentation-générale)
- [2. 🌟 Fonctionnalités Clés par Rôle](#2--fonctionnalités-clés-par-rôle)
- [3. 🏗️ Architecture Technique](#3--architecture-technique)
- [4. 🗄️ Modélisation & Schéma de Base de Données](#4--modélisation--schéma-de-base-de-données)
- [5. 📡 Spécification des APIs REST](#5--spécification-des-apis-rest)
- [6. 👥 Comptes de Test & Seed Data](#6--comptes-de-test--seed-data)
- [7. ⚡ Guide d'Installation & Déploiement](#7--guide-dinstallation--déploiement)
- [8. 🛠️ Résolution des Problèmes Courants (Troubleshooting)](#8--résolution-des-problèmes-courants-troubleshooting)
- [9. 🏛️ Contact & Institution](#9--contact--institution)

---

## 1. 📌 Présentation Générale

**UniStage** est la solution web institutionnelle conçue pour numériser, automatiser et sécuriser l'ensemble du processus de gestion des stages de fin d'études au sein de l'**Université de Labé**.

La plateforme interconnecte de manière fluide et sécurisée les trois acteurs majeurs du cycle de stage :
1. **Les Étudiants** (Licence 3 Informatique) qui recherchent et candidatent aux offres de stage.
2. **Les Entreprises Partenaires** qui publient leurs besoins et recrutent leurs futurs talents.
3. **L'Administration Universitaire** qui supervise, valide les partenariats et contrôle la conformité.

---

## 2. 🌟 Fonctionnalités Clés par Rôle

### 🎓 Espace Étudiants
- **Recherche & Filtrage** : Consultation en temps réel des offres de stage ouvertes avec filtres multicritères (mots-clés, secteur d'activité, localisation).
- **Candidature Express** : Soumission simplifiée incluant lettre de motivation personnalisée et import de CV (PDF/Images).
- **Suivi de Candidatures** : Tableau de bord dédié permettant le suivi en temps réel du statut (`EN_ATTENTE`, `ACCEPTEE`, `REFUSEE`).
- **Consultation & Impression de CV** : Visionneuse native permettant la visualisation et l'impression professionnelle du CV direct depuis le navigateur.

### 🏢 Espace Entreprises Partenaires
- **Gestion des Offres** : Publication, modification, clôture et suppression d'offres de stage.
- **Gestion des Recrutements** : Réception des candidatures, examen des profils étudiants, évaluation des CVs et lettres de motivation.
- **Décision en 1 Clic** : Acceptation ou refus des candidatures avec mise à jour instantanée du statut côté étudiant.

### 🛡️ Espace Administration (Université de Labé)
- **Tableau de Bord Exécutif** : Indicateurs de performance et statistiques globales (nombre total d'offres, candidatures soumises, taux de placement).
- **Modération des Entreprises** : Validation ou suspension des comptes entreprises avant publication d'offres.
- **Gestion des Accès** : Vue d'ensemble sur les comptes étudiants, enseignants et recruteurs.

---

## 3. 🏗️ Architecture Technique

La plateforme repose sur une architecture découplée **RESTful Client-Serveur** garantissant modularité, haute disponibilité et sécurité.

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                        CLIENT / FRONT-END                               │
│  Angular 18+ (Standalone Components, RxJS, Reactive Forms, Control Flow) │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │  Requests HTTP / REST 
                                     │  Headers: Authorization Bearer <JWT>
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                       SERVEUR / BACK-END                                │
│  Spring Boot 3.2.5 (Java 21 LTS)                                         │
│  ├── Controller Layer    (Spring MVC / REST Controllers)                │
│  ├── Security Layer      (Spring Security, JJWT, BCrypt)                │
│  ├── Service Layer       (Business Logic & Transactions @Transactional)  │
│  └── Repository Layer    (Spring Data JPA / Hibernate ORM)              │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │  Driver JDBC / SQL
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    BASE DE DONNÉES / DATABASE                           │
│  MySQL 8.0 / H2 Memory Fallback                                         │
│  Database: `UniStage` (Port 3306)                                       │
└─────────────────────────────────────────────────────────────────────────┘
```

### Stack Technologique Détallée

| Composant | Technologie / Lib | Rôle / Description |
| :--- | :--- | :--- |
| **Language Backend** | Java 21 LTS | Fonctionnalités Java modernes (Pattern Matching, Records) |
| **Framework Backend** | Spring Boot 3.2.5 | Socle d'application entreprise & conteneur IoC |
| **Sécurité** | Spring Security + JJWT 0.12.5 | Authentification stateless sans session via jeton JWT |
| **ORM / Accès Données** | Spring Data JPA / Hibernate 6 | Mapping Objet-Relationnel et requêtes SQL optimisées |
| **Framework Frontend** | Angular 18 | Application Mono-page (SPA) performante avec Control Flow |
| **Base de Données** | MySQL 8.0 / H2 | Stockage persistant relationnel (avec fallback H2 local) |
| **Style & Design** | CSS3 Modern / Responsive | Layout adaptatif (Desktop, Tablette, Mobile) & Mode sombre |

---

## 4. 🗄️ Modélisation & Schéma de Base de Données

Le schéma relationnel est optimisé et normalisé sous la base de données **`UniStage`** :

```text
  ┌─────────────────┐             1..1             ┌─────────────────┐
  │   utilisateurs  │<────────────────────────────┤    etudiants    │
  ├─────────────────┤                              ├─────────────────┤
  │ id (PK)         │                              │ id (PK)         │
  │ nom, prenom     │                              │ matricule (UQ)  │
  │ email (UQ)      │                              │ filiere, niveau │
  │ mot_de_passe    │                              │ telephone, cv   │
  │ role (Enum)     │                              │ utilisateur_id  │
  └────────┬────────┘                              └────────┬────────┘
           │ 1..1                                           │ 1..N
           ▼                                                ▼
  ┌─────────────────┐             1..N             ┌─────────────────┐
  │   entreprises   │<────────────────────────────┤   candidatures  │
  ├─────────────────┤                              ├─────────────────┤
  │ id (PK)         │                              │ id (PK)         │
  │ raison_sociale  │                              │ date_soumission │
  │ secteur_activite│                              │ lettre_motiv    │
  │ site_web        │                              │ cv (LONGTEXT)   │
  │ statut_valid    │                              │ statut (Enum)   │
  └────────┬────────┘                              │ etudiant_id (FK)│
           │ 1..N                                  │ offre_id (FK)   │
           ▼                                       └─────────────────┘
  ┌─────────────────┐                                       ▲
  │  offres_stage   │                                       │
  ├─────────────────┤                                       │
  │ id (PK)         ├───────────────────────────────────────┘
  │ titre, desc     │ 1..N
  │ lieu, dates     │
  │ entreprise_id   │
  └─────────────────┘
```

---

## 5. 📡 Spécification des APIs REST

Tous les endpoints API sont préfixés par `/api`.

### 🔑 Authentification (`/api/auth`)
- `POST /api/auth/login` : Authentification et génération du jeton JWT.
- `POST /api/auth/register/etudiant` : Inscription d'un nouvel étudiant.
- `POST /api/auth/register/entreprise` : Inscription d'une entreprise partenaire.

### 📢 Offres de Stage (`/api/offres` & `/api/entreprise/offres`)
- `GET /api/offres/public` : Consultation publique des offres validées *(PermitAll)*.
- `GET /api/offres/public/{id}` : Détail d'une offre de stage *(PermitAll)*.
- `GET /api/entreprise/offres` : Offres créées par l'entreprise connectée *(Role: ENTREPRISE)*.
- `POST /api/entreprise/offres` : Création d'une nouvelle offre *(Role: ENTREPRISE)*.
- `PUT /api/entreprise/offres/{id}` : Mise à jour d'une offre *(Role: ENTREPRISE)*.
- `DELETE /api/entreprise/offres/{id}` : Suppression d'une offre *(Role: ENTREPRISE)*.

### 📝 Candidatures (`/api/etudiant/candidatures` & `/api/entreprise/candidatures`)
- `POST /api/etudiant/candidatures` : Soumission d'une candidature par un étudiant *(Role: ETUDIANT)*.
- `GET /api/etudiant/candidatures` : Liste des candidatures de l'étudiant connecté *(Role: ETUDIANT)*.
- `GET /api/entreprise/candidatures` : Liste des candidatures reçues par l'entreprise *(Role: ENTREPRISE)*.
- `PATCH /api/entreprise/candidatures/{id}/statut` : Validation ou rejet d'une candidature *(Role: ENTREPRISE)*.

### 🛡️ Administration (`/api/admin`)
- `GET /api/admin/stats` : Métriques globales de la plateforme *(Role: ADMIN)*.
- `GET /api/admin/entreprises` : Liste des entreprises et modération *(Role: ADMIN)*.
- `PATCH /api/admin/entreprises/{id}/valider` : Validation d'un compte entreprise *(Role: ADMIN)*.

---

## 6. 👥 Comptes de Test & Seed Data

La base de données est automatiquement alimentée au premier démarrage via `DataInitializer.java` :

| Rôle | Nom / Organisation | Email | Mot de passe | Description |
| :--- | :--- | :--- | :--- | :--- |
| 👑 **ADMIN** | Alpha Oumar DIALLO | `dialoalphoumar021@gmail.com` | `Aoddiallo` | Administrateur Principal FST |
| 🎓 **ÉTUDIANT** | Mamadou Saliou BARRY | `Saliou@gmail.com` | `Saliou123` | Étudiant L3 Informatique |
| 🎓 **ÉTUDIANT** | Mariama Siiré DIALLO | `Sire@gmail.com` | `Sire@gmail.com` | Étudiante L3 Informatique |
| 🏢 **ENTREPRISE** | Orange Guinée Labé | `contact@orange-guinee.gn` | `Entreprise123!` | Partenaire Télécom & IT |
| 🏢 **ENTREPRISE** | Kouma Academy | `contact@koumaacademy.com` | `Kouma2026!` | Partenaire Formation & IA |
| 🏢 **ENTREPRISE** | Nesten Group | `contact@nestengroup.com` | `Nesten2026!` | Partenaire Ingénierie |
| 🏢 **ENTREPRISE** | ANSUTEN Guinée | `contact@ansuten.gov.gn` | `Ansuten2026!` | Inclusions Numériques |
| 🏢 **ENTREPRISE** | Sylla Tech Labs | `contact@syllatech.gn` | `Sylla123!` | Développement Web & IA |

---

## 7. ⚡ Guide d'Installation & Déploiement

### Prérequis Système
- **Java JDK 21 LTS**
- **Node.js 18+ & npm 9+**
- **Maven 3.8+**
- **MySQL Server 8.0+** (Service démarré sur le port `3306`)

---

### A. Configuration & Lancement du Backend (Spring Boot)

1. **Cloner le projet** et naviguer dans le dossier backend :
   ```bash
   cd UniStage/backend
   ```

2. **Vérifier la configuration `application.properties`** :
   ```properties
   spring.datasource.url=jdbc:mysql://127.0.0.1:3306/UniStage?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
   spring.datasource.username=root
   spring.datasource.password=
   ```

3. **Compiler et exécuter le serveur** :
   ```bash
   mvn clean spring-boot:run
   ```
   *Le serveur démarre sur `http://localhost:8080`.*

---

### B. Configuration & Lancement du Frontend (Angular)

1. Naviguer dans le dossier frontend :
   ```bash
   cd UniStage/frontend
   ```

2. **Installer les dépendances** :
   ```bash
   npm install
   ```

3. **Lancer le serveur de développement** :
   ```bash
   npm start
   ```

4. **Accéder à l'application web** :
   Ouvrez votre navigateur sur **`http://localhost:4200`**.

---

## 8. 🛠️ Résolution des Problèmes Courants (Troubleshooting)

### 🔴 Erreur 1 : `Communications link failure` / `Connection refused` (MySQL)
- **Cause** : Le service MySQL n'est pas démarré ou l'adresse IPv6 `localhost` est bloquée sous Windows.
- **Solution** : 
  1. Assurez-vous que MySQL (XAMPP / WAMP / Laragon) est démarré.
  2. Dans `application.properties`, utilisez `127.0.0.1:3306` au lieu de `localhost:3306`.

### 🔴 Erreur 2 : `Port 8080 was already in use`
- **Cause** : Un autre processus Java tourne en arrière-plan.
- **Solution (PowerShell)** :
  ```powershell
  Get-Process -Name java | Stop-Process -Force
  ```

### 🔴 Erreur 3 : `401 Unauthorized` lors d'une action
- **Cause** : Vous tentez de postuler ou de créer une offre sans être connecté.
- **Solution** : Allez sur `http://localhost:4200/login` et connectez-vous avec l'un des comptes de test.

---

## 9. 🏛️ Contact & Institution

**Université de Labé (République de Guinée)**  
*Faculté des Sciences et Techniques (FST)*  

- 📍 **Localisation** : Campus Universitaire de Hafia, Préfecture de Labé, BP 210, Guinée  
- 📞 **Téléphone** : (+224) 629 00 58 07  
- ✉️ **Email Officiel** : contact@univ-labe.edu.gn  
- 🌐 **Site Web** : [https://www.univ-labe.edu.gn](https://www.univ-labe.edu.gn)

---

&copy; 2026 **Université de Labé** — Tous droits réservés.