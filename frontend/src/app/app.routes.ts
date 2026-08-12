import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { EtudiantDashboardComponent } from './pages/etudiant/etudiant-dashboard.component';
import { EntrepriseDashboardComponent } from './pages/entreprise/entreprise-dashboard.component';
import { NouvelleOffreComponent } from './pages/entreprise/nouvelle-offre.component';
import { AdminDashboardComponent } from './pages/admin/admin-dashboard.component';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'UniStage — Accueil Offres de Stage' },
  { path: 'login', component: LoginComponent, title: 'Connexion — UniStage' },
  { path: 'register', component: RegisterComponent, title: 'Inscription — UniStage' },

  // Route 1 Protégée par Guard : Espace Étudiant
  {
    path: 'etudiant',
    component: EtudiantDashboardComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: 'ETUDIANT' },
    title: 'Espace Étudiant — UniStage'
  },

  // Route 2 Protégée par Guard : Espace Entreprise & Création d'offre
  {
    path: 'entreprise',
    component: EntrepriseDashboardComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: 'ENTREPRISE' },
    title: 'Espace Entreprise — UniStage'
  },
  {
    path: 'entreprise/offres/nouvelle',
    component: NouvelleOffreComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: 'ENTREPRISE' },
    title: 'Nouvelle Offre de Stage — UniStage'
  },

  // Route 3 Protégée par Guard : Espace Admin
  {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: 'ADMIN' },
    title: 'Administration — UniStage'
  },

  { path: '**', redirectTo: '' }
];
