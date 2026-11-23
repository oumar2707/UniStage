# UniStage

Plateforme web de gestion des offres de stage de l'**Université de Labé** (Guinée), réalisée dans le cadre du Département d'Informatique de la Faculté des Sciences et Techniques.

![Java](https://img.shields.io/badge/Java-17-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-6DB33F)
![Angular](https://img.shields.io/badge/Angular-18-DD0031)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1)

**Démo :** _lien à venir_

> L'API est hébergée sur une offre gratuite qui se met en veille quand elle n'est pas utilisée. Au premier chargement, comptez environ une minute avant que les offres s'affichent.

## Aperçu

_Captures d'écran à venir._

<!--
| Accueil | Espace étudiant |
|---|---|
| ![Accueil](docs/screenshots/accueil.png) | ![Étudiant](docs/screenshots/etudiant.png) |

| Espace entreprise | Administration |
|---|---|
| ![Entreprise](docs/screenshots/entreprise.png) | ![Admin](docs/screenshots/admin.png) |
-->




## Contexte

UniStage centralise la recherche de stage, de la publication d'une offre jusqu'à la réponse à une candidature. La plateforme réunit trois types d'utilisateurs :

- **les étudiants**, qui consultent les offres et postulent ;
- **les entreprises partenaires**, qui publient des offres et traitent les candidatures ;
- **l'administration**, qui valide les entreprises et suit l'activité de la plateforme.

## Fonctionnalités

**Étudiant**
- recherche d'offres par mot-clé et par secteur ;
- candidature avec lettre de motivation et CV au format PDF ;
- suivi de l'état de ses candidatures (en attente, acceptée, refusée).

**Entreprise**
- inscription, puis validation du compte par l'administration ;
- création, modification et suppression d'offres ;
- consultation des candidatures reçues et réponse (acceptation ou refus).

**Administration**
- tableau de bord avec les chiffres clés (étudiants, entreprises, offres, candidatures) ;
- validation ou refus des entreprises ;
- gestion des comptes étudiants, des entreprises et des offres.

**Sécurité**
- authentification par jeton JWT, mots de passe hachés avec BCrypt ;
- droits d'accès par rôle, vérifiés côté API (Spring Security) et côté interface (guards Angular).

## Technologies

| | |
|---|---|
| Frontend | Angular 18 (composants standalone, signals, formulaires réactifs), TypeScript |
| Backend | Java 17, Spring Boot 3.2, Spring Security, Spring Data JPA (Hibernate), JJWT |
| Base de données | PostgreSQL 16 ; H2 en mémoire pour les tests |
| Outils | Maven, npm, Docker / Docker Compose, GitHub Actions |

## Architecture

```text
┌────────────────────┐   HTTP/JSON + JWT   ┌──────────────────────┐   JDBC   ┌──────────────┐
│  Angular (SPA)     │ ──────────────────► │  API Spring Boot     │ ───────► │  PostgreSQL  │
│  pages, services,  │                     │  controller          │          │              │
│  guards,           │ ◄────────────────── │  service             │ ◄─────── │              │
│  intercepteurs     │                     │  repository (JPA)    │          │              │
└────────────────────┘                     └──────────────────────┘          └──────────────┘
```

Le backend suit une organisation en couches classique : les contrôleurs REST exposent l'API sous `/api`, les services portent la logique métier et les repositories Spring Data accèdent à la base. Un filtre vérifie le jeton JWT à chaque requête.

**Modèle de données**

```text
utilisateurs ─┬─ etudiants ──────────────────── candidatures
              └─ entreprises ── offres_stage ──┘
```

Chaque utilisateur a un rôle (`ETUDIANT`, `ENTREPRISE` ou `ADMIN`). Une candidature relie un étudiant à une offre.

**Organisation du dépôt**

```text
backend/    API Spring Boot (config, controller, dto, model, repository, security, service)
frontend/   application Angular (pages, components, services, guards, interceptors)
docker-compose.yml
.env.example
```

## Installation locale

### Prérequis

- JDK 17 et Maven 3.9+
- Node.js 20+
- PostgreSQL 16, ou Docker

### Avec Docker

```bash
cp .env.example .env    # renseigner les valeurs
docker compose up --build
```

L'application est disponible sur http://localhost:4200 et l'API sur http://localhost:8080/api.

### Sans Docker

1. Créer une base PostgreSQL nommée `unistage`.

2. Lancer le backend avec le profil `dev` :

   ```bash
   cd backend
   export SPRING_DATASOURCE_USERNAME=postgres
   export SPRING_DATASOURCE_PASSWORD=<mot_de_passe>
   mvn spring-boot:run -Dspring-boot.run.profiles=dev
   ```

   Sous PowerShell : `$env:SPRING_DATASOURCE_PASSWORD="<mot_de_passe>"`.

3. Lancer le frontend :

   ```bash
   cd frontend
   npm install
   npm start
   ```

En profil `dev`, des données de test sont créées au démarrage :

| Rôle | E-mail | Mot de passe |
|---|---|---|
| Admin | admin@demo.local | AdminDev123! |
| Étudiant | etudiant1@demo.local | EtudiantDev123! |
| Entreprise | entreprise1@demo.local | EntrepriseDev123! |

### Tests

```bash
cd backend && mvn verify
cd frontend && npm run build
```

## Configuration

Le backend se configure par variables d'environnement. La liste complète se trouve dans [.env.example](.env.example).

| Variable | Description |
|---|---|
| `SPRING_PROFILES_ACTIVE` | `dev`, `prod`, ou `prod,demo` pour charger les données de démonstration |
| `SPRING_DATASOURCE_URL` | URL JDBC de la base |
| `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD` | identifiants de la base |
| `JWT_SECRET` | clé de signature des jetons (32 caractères minimum) |
| `JWT_EXPIRATION_MS` | durée de validité d'un jeton (24 h par défaut) |
| `CORS_ALLOWED_ORIGINS` | adresse(s) du frontend autorisée(s) |
| `PORT` | port HTTP (8080 par défaut) |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | compte administrateur créé au premier démarrage |

## API

Principales routes (préfixe `/api`). Une collection Postman est disponible dans [UniStage_Postman_Collection.json](UniStage_Postman_Collection.json).

| Route | Accès |
|---|---|
| `POST /auth/login`, `POST /auth/register/etudiant`, `POST /auth/register/entreprise` | public |
| `GET /offres/public`, `GET /offres/public/{id}` | public |
| `/etudiant/candidatures` | étudiant |
| `/entreprise/offres`, `/entreprise/candidatures` | entreprise |
| `/admin/stats`, `/admin/entreprises`, `/admin/etudiants`, `/admin/offres` | administrateur |

## Auteur

Alpha Oumar Diallo — Université de Labé
