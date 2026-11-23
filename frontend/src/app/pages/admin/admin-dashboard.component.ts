import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageBannerComponent } from '../../components/page-banner/page-banner.component';
import { RevealDirective } from '../../directives/reveal.directive';
import { CountUpDirective } from '../../directives/count-up.directive';
import { AdminService, EntrepriseAdminDTO, EtudiantAdminDTO, GlobalStatsDTO } from '../../services/admin.service';
import { OffreService } from '../../services/offre.service';
import { OffreStage } from '../../models/offre.model';
import { StatusBadgeComponent } from '../../components/status-badge/status-badge.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, StatusBadgeComponent, PageBannerComponent, RevealDirective, CountUpDirective],
  template: `
    <div class="dashboard-page container">
      <app-page-banner
        image="/images/etudiants.jpg"
        eyebrow="Administration"
        title="Tableau de bord"
        subtitle="Suivi des comptes, des offres et des candidatures de la plateforme.">
      </app-page-banner>

      <!-- Overview Stats Cards -->
      @if (stats) {
        <div class="grid-4 stats-cards-row">
          <div class="card stat-card blue lift" appReveal>
            <div class="stat-icon"><i class="fa-solid fa-graduation-cap"></i></div>
            <div class="stat-info">
              <span class="stat-title">Étudiants</span>
              <span class="stat-value" [appCountUp]="stats.totalEtudiants"></span>
            </div>
          </div>
          <div class="card stat-card purple lift" appReveal [revealDelay]="80">
            <div class="stat-icon"><i class="fa-solid fa-building"></i></div>
            <div class="stat-info">
              <span class="stat-title">Entreprises</span>
              <span class="stat-value" [appCountUp]="stats.totalEntreprises"></span>
            </div>
          </div>
          <div class="card stat-card green lift" appReveal [revealDelay]="160">
            <div class="stat-icon"><i class="fa-solid fa-briefcase"></i></div>
            <div class="stat-info">
              <span class="stat-title">Offres Publiées</span>
              <span class="stat-value" [appCountUp]="stats.totalOffres"></span>
            </div>
          </div>
          <div class="card stat-card orange lift" appReveal [revealDelay]="240">
            <div class="stat-icon"><i class="fa-solid fa-file-signature"></i></div>
            <div class="stat-info">
              <span class="stat-title">Candidatures</span>
              <span class="stat-value" [appCountUp]="stats.totalCandidatures"></span>
            </div>
          </div>
        </div>
      }

      <!-- Navigation Tabs -->
      <div class="tabs-nav-container mt-3">
        <div class="tabs-nav">
          <button [class.active]="activeTab === 'etudiants'" (click)="activeTab = 'etudiants'" class="tab-btn">
            <i class="fa-solid fa-graduation-cap"></i> Étudiants ({{ etudiants.length }})
          </button>
          <button [class.active]="activeTab === 'entreprises'" (click)="activeTab = 'entreprises'" class="tab-btn">
            <i class="fa-solid fa-building"></i> Entreprises ({{ entreprises.length }})
          </button>
          <button [class.active]="activeTab === 'offres'" (click)="activeTab = 'offres'" class="tab-btn">
            <i class="fa-solid fa-list-check"></i> Offres ({{ offres.length }})
          </button>
        </div>
      </div>

      @if (alertMessage) {
        <div class="alert alert-success mt-3">
          <i class="fa-solid fa-circle-check"></i> {{ alertMessage }}
        </div>
      }

      <!-- TAB 1: GESTION TOTALE DES ÉTUDIANTS -->
      @if (activeTab === 'etudiants') {
        <div class="table-responsive-wrapper card mt-3">
          <div class="table-title-bar flex-between">
            <h3><i class="fa-solid fa-users"></i> Étudiants inscrits</h3>
            <span class="badge-count">{{ etudiants.length }} inscrit(s)</span>
          </div>
          @if (etudiants.length > 0) {
            <table class="data-table">
              <thead>
                <tr>
                  <th>Matricule</th>
                  <th>Nom & Prénom</th>
                  <th>E-mail</th>
                  <th>Filière & Niveau</th>
                  <th>Téléphone</th>
                  <th>CV</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (etu of etudiants; track etu.id) {
                  <tr>
                    <td><span class="matricule-tag">{{ etu.matricule || 'N/A' }}</span></td>
                    <td>
                      <strong>{{ etu.utilisateur ? (etu.utilisateur.prenom + ' ' + etu.utilisateur.nom) : 'Étudiant' }}</strong>
                    </td>
                    <td>{{ etu.utilisateur ? etu.utilisateur.email : 'N/A' }}</td>
                    <td>{{ etu.filiere }} ({{ etu.niveau }})</td>
                    <td>{{ etu.telephone || 'Non renseigné' }}</td>
                    <td>
                      @if (etu.cv) {
                        <a [href]="etu.cv" target="_blank" class="btn btn-outline btn-xs cv-btn">
                          <i class="fa-solid fa-file-pdf text-danger"></i> {{ etu.cv.length > 20 ? 'Consulter CV' : etu.cv }}
                        </a>
                      } @else {
                        <span class="text-muted">Non fourni</span>
                      }
                    </td>
                    <td>
                      <div class="action-flex">
                        <button (click)="onDeleteEtudiant(etu.id)" class="btn btn-danger btn-xs">
                          <i class="fa-solid fa-trash"></i> Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          } @else {
            <div class="empty-state p-4 text-center">
              <i class="fa-solid fa-user-slash empty-icon"></i>
              <p>Aucun étudiant inscrit pour le moment.</p>
            </div>
          }
        </div>
      }

      <!-- TAB 2: GESTION ET VALIDATION DES ENTREPRISES -->
      @if (activeTab === 'entreprises') {
        <div class="table-responsive-wrapper card mt-3">
          <div class="table-title-bar flex-between">
            <h3><i class="fa-solid fa-building"></i> Entreprises inscrites</h3>
            <span class="badge-count">{{ entreprises.length }} entreprise(s)</span>
          </div>
          <table class="data-table">
            <thead>
              <tr>
                <th>Entreprise / Contact</th>
                <th>Secteur d'activité</th>
                <th>Email</th>
                <th>Statut Validation</th>
                <th>Actions de Validation</th>
              </tr>
            </thead>
            <tbody>
              @for (ent of entreprises; track ent.id) {
                <tr>
                  <td>
                    <strong>{{ ent.raisonSociale }}</strong>
                    <div class="sub-cell"><i class="fa-solid fa-user"></i> {{ ent.utilisateur ? (ent.utilisateur.prenom + ' ' + ent.utilisateur.nom) : '' }}</div>
                  </td>
                  <td>{{ ent.secteurActivite }}</td>
                  <td>{{ ent.utilisateur ? ent.utilisateur.email : '' }}</td>
                  <td><app-status-badge [status]="ent.statutValidation"></app-status-badge></td>
                  <td>
                    <div class="action-flex">
                      <button
                        (click)="onValiderEntreprise(ent.id, 'VALIDE')"
                        [disabled]="ent.statutValidation === 'VALIDE'"
                        class="btn btn-success btn-xs"
                      >
                        <i class="fa-solid fa-check"></i> Valider
                      </button>
                      <button
                        (click)="onValiderEntreprise(ent.id, 'REFUSE')"
                        [disabled]="ent.statutValidation === 'REFUSE'"
                        class="btn btn-danger btn-xs"
                      >
                        <i class="fa-solid fa-ban"></i> Refuser
                      </button>
                      <button (click)="onDeleteEntreprise(ent.id)" class="btn btn-outline btn-xs text-danger">
                        <i class="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }

      <!-- TAB 3: MODÉRATION DES OFFRES DE STAGE -->
      @if (activeTab === 'offres') {
        <div class="grid-2 mt-3">
          @for (offre of offres; track offre.id) {
            <div class="card mod-card">
              <div class="flex-between">
                <span class="company-badge-name"><i class="fa-solid fa-building"></i> {{ offre.raisonSociale }}</span>
                <app-status-badge [status]="offre.statut || 'OUVERTE'"></app-status-badge>
              </div>
              <h3 class="offre-titre mt-1">{{ offre.titre }}</h3>
              <p class="offre-desc">{{ offre.description }}</p>
              <div class="flex-between card-footer-mod mt-2">
                <span><i class="fa-solid fa-location-dot"></i> Lieu: {{ offre.lieu }}</span>
                <button (click)="onDeleteOffreAdmin(offre.id!)" class="btn btn-danger btn-sm">
                  <i class="fa-solid fa-trash"></i> Supprimer l'offre
                </button>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .dashboard-page { padding: 2.5rem 1rem; }
    .page-header { margin-bottom: 1.5rem; }
    .page-tag { font-size: 0.8rem; font-weight: 700; color: var(--accent); text-transform: uppercase; }
    .sub-text { color: var(--text-muted); font-size: 0.95rem; }

    /* Stats Cards Row */
    .stats-cards-row { gap: 1.25rem; margin-bottom: 1rem; }
    .stat-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.25rem;
      border-radius: var(--radius-md);
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.05);
    }
    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.35rem;
      color: #ffffff;
    }
    .stat-card.blue .stat-icon { background: linear-gradient(135deg, #2563eb, #1d4ed8); }
    .stat-card.purple .stat-icon { background: linear-gradient(135deg, #8b5cf6, #6d28d9); }
    .stat-card.green .stat-icon { background: linear-gradient(135deg, #059669, #047857); }
    .stat-card.orange .stat-icon { background: linear-gradient(135deg, #ff7900, #ea580c); }

    .stat-info { display: flex; flex-direction: column; }
    .stat-title { font-size: 0.8rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; }
    .stat-value { font-family: 'Outfit', sans-serif; font-size: 1.65rem; font-weight: 800; color: var(--primary); }

    .tabs-nav-container {
      width: 100%;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      border-bottom: 2px solid var(--border-color);
    }
    .tabs-nav { display: flex; gap: 0.5rem; white-space: nowrap; width: max-content; }
    .tab-btn { padding: 0.75rem 1.25rem; background: none; border: none; font-size: 0.95rem; font-weight: 600; color: var(--text-muted); cursor: pointer; border-bottom: 3px solid transparent; }
    .tab-btn.active { color: var(--accent); border-bottom-color: var(--accent); }

    .table-title-bar {
      padding: 1rem 1.25rem;
      border-bottom: 1px solid var(--border-color);
      background: #f8fafc;
    }
    .table-title-bar h3 { font-size: 1.05rem; color: var(--primary); margin: 0; display: flex; align-items: center; gap: 0.5rem; }
    .badge-count { font-size: 0.8rem; font-weight: 700; background: #e2e8f0; color: #334155; padding: 0.2rem 0.6rem; border-radius: 20px; }

    .mt-3 { margin-top: 1.25rem; }
    .mt-1 { margin-top: 0.4rem; }
    .mt-2 { margin-top: 0.85rem; }
    .table-responsive-wrapper {
      padding: 0;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      width: 100%;
      display: block;
    }
    .data-table { width: 100%; min-width: 750px; border-collapse: collapse; text-align: left; font-size: 0.875rem; }
    .data-table th, .data-table td { padding: 0.75rem 0.9rem; border-bottom: 1px solid var(--border-color); }
    .data-table th { background: #f8fafc; color: var(--primary); font-weight: 700; }
    .sub-cell { font-size: 0.8rem; color: var(--text-muted); margin-top: 0.2rem; }
    .matricule-tag { font-family: monospace; font-weight: 700; background: #e0f2fe; color: #0369a1; padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.825rem; }
    .cv-btn { text-decoration: none; padding: 0.25rem 0.5rem; font-size: 0.775rem; }
    .text-danger { color: #dc2626 !important; }
    .text-muted { color: #94a3b8; font-size: 0.825rem; }

    .action-flex { display: flex; gap: 0.4rem; flex-wrap: wrap; }
    .btn-xs { padding: 0.3rem 0.65rem; font-size: 0.8rem; }
    .btn-sm { padding: 0.35rem 0.75rem; font-size: 0.825rem; }
    .company-badge-name { font-size: 0.8rem; font-weight: 700; color: var(--accent); text-transform: uppercase; }
    .offre-titre { font-size: 1.1rem; color: var(--primary); }
    .offre-desc { font-size: 0.9rem; color: var(--text-muted); margin-top: 0.5rem; }
    .card-footer-mod { border-top: 1px dashed var(--border-color); padding-top: 0.75rem; font-size: 0.85rem; }
    .empty-icon { font-size: 2.5rem; color: #cbd5e1; margin-bottom: 0.5rem; }

    @media (max-width: 768px) {
      .dashboard-page { padding: 1.5rem 0.75rem; }
      .card-footer-mod { flex-direction: column; align-items: flex-start; gap: 0.5rem; }
      .btn-sm { width: 100%; }
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  private adminService = inject(AdminService);
  private offreService = inject(OffreService);

  activeTab: 'etudiants' | 'entreprises' | 'offres' = 'etudiants';
  etudiants: EtudiantAdminDTO[] = [];
  entreprises: EntrepriseAdminDTO[] = [];
  offres: OffreStage[] = [];
  stats: GlobalStatsDTO | null = null;
  alertMessage: string | null = null;

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.adminService.getAllEtudiants().subscribe({
      next: (data) => this.etudiants = data || [],
      error: (err) => console.error('Erreur chargement étudiants:', err)
    });
    this.adminService.getAllEntreprises().subscribe({
      next: (data) => this.entreprises = data || [],
      error: (err) => console.error('Erreur chargement entreprises:', err)
    });
    this.offreService.getAllOffresAdmin().subscribe({
      next: (data) => this.offres = data || [],
      error: (err) => console.error('Erreur chargement offres:', err)
    });
    this.adminService.getStats().subscribe({
      next: (data) => this.stats = data,
      error: (err) => console.error('Erreur chargement stats:', err)
    });
  }

  onDeleteEtudiant(id: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet étudiant ainsi que son compte du système ?')) {
      this.adminService.deleteEtudiant(id).subscribe(() => {
        this.showAlert('Étudiant supprimé avec succès.');
        this.loadData();
      });
    }
  }

  onValiderEntreprise(id: number, statut: 'VALIDE' | 'REFUSE') {
    this.adminService.validerEntreprise(id, statut).subscribe(() => {
      this.showAlert(`Compte entreprise mis à jour avec le statut : ${statut}`);
      this.loadData();
    });
  }

  onDeleteEntreprise(id: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette entreprise ainsi que ses offres du système ?')) {
      this.adminService.deleteEntreprise(id).subscribe(() => {
        this.showAlert('Entreprise supprimée avec succès.');
        this.loadData();
      });
    }
  }

  onDeleteOffreAdmin(id: number) {
    if (confirm('Voulez-vous supprimer cette offre de stage du système ?')) {
      this.offreService.deleteOffreAdmin(id).subscribe(() => {
        this.showAlert('Offre de stage supprimée avec succès.');
        this.loadData();
      });
    }
  }

  private showAlert(msg: string) {
    this.alertMessage = msg;
    setTimeout(() => this.alertMessage = null, 4000);
  }
}
