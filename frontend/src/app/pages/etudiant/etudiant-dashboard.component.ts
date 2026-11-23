import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PageBannerComponent } from '../../components/page-banner/page-banner.component';
import { RevealDirective } from '../../directives/reveal.directive';
import { CandidatureService } from '../../services/candidature.service';
import { AuthService } from '../../services/auth.service';
import { Candidature } from '../../models/candidature.model';
import { StatusBadgeComponent } from '../../components/status-badge/status-badge.component';
import { CandidatureDetailModalComponent } from '../../components/candidature-detail-modal/candidature-detail-modal.component';

@Component({
  selector: 'app-etudiant-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, StatusBadgeComponent, CandidatureDetailModalComponent, PageBannerComponent, RevealDirective],
  template: `
    <div class="dashboard-page container">
      <app-page-banner
        image="/images/etudiants.jpg"
        eyebrow="Espace étudiant"
        [title]="'Bonjour ' + prenom"
        subtitle="Retrouvez ici vos candidatures et la réponse de chaque entreprise.">
        <a routerLink="/" class="btn btn-light"><i class="fa-solid fa-magnifying-glass"></i> Voir les offres</a>
      </app-page-banner>
      <h2 class="list-title">Mes candidatures</h2>

      @if (loading) {
        <div class="loading-spinner">
          <i class="fa-solid fa-spinner fa-spin"></i> Chargement de vos candidatures...
        </div>
      } @else {
        @if (candidatures.length > 0) {
          <div class="candidatures-list">
            @for (item of candidatures; track item.id; let i = $index) {
              <div class="candidature-card card lift" appReveal [revealDelay]="i * 80">
                <div class="candidature-header flex-between">
                  <div>
                    <span class="entreprise-name"><i class="fa-solid fa-building"></i> {{ item.raisonSocialeEntreprise }}</span>
                    <h3 class="offre-titre">{{ item.offreTitre }}</h3>
                    <span class="date-sub"><i class="fa-regular fa-clock"></i> Soumis le: {{ item.dateSoumission | date:'dd/MM/yyyy HH:mm' }}</span>
                  </div>
                  <app-status-badge [status]="item.statut || 'EN_ATTENTE'"></app-status-badge>
                </div>

                <div class="lettre-box">
                  <h4><i class="fa-solid fa-file-lines text-accent"></i> Lettre de motivation</h4>
                  <p>{{ item.lettreMotivation }}</p>
                </div>

                <div class="card-footer flex-between mt-3">
                  <span class="cv-status text-success">
                    <i class="fa-solid fa-paperclip"></i> CV transmis : {{ item.cv || 'cv_mamadou_saliou_barry.pdf' }}
                  </span>
                  <button (click)="selectedCandidatureForView = item" class="btn btn-secondary btn-sm">
                    <i class="fa-solid fa-eye"></i> Visualiser mon dossier (CV & Lettre)
                  </button>
                </div>
              </div>
            }
          </div>
        } @else {
          <div class="empty-box card">
            <i class="fa-solid fa-folder-open empty-icon"></i>
            <h3>Vous n'avez pas encore déposé de candidature</h3>
            <p>Consultez la liste des offres disponibles sur la page d'accueil et postulez dès maintenant !</p>
          </div>
        }
      }

      @if (selectedCandidatureForView) {
        <app-candidature-detail-modal
          [candidature]="selectedCandidatureForView"
          (close)="selectedCandidatureForView = null"
        ></app-candidature-detail-modal>
      }
    </div>
  `,
  styles: [`
    .dashboard-page {
      padding: 3rem 1rem;
    }
    .page-header {
      margin-bottom: 2rem;
    }
    .page-tag {
      font-size: 0.8rem;
      font-weight: 700;
      color: var(--accent);
      text-transform: uppercase;
    }
    .sub-text {
      color: var(--text-muted);
      font-size: 0.95rem;
    }
    .candidatures-list {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }
    .candidature-card {
      background: #ffffff;
      border-left: 4px solid var(--accent);
    }
    .entreprise-name {
      font-size: 0.825rem;
      font-weight: 700;
      color: var(--accent);
      text-transform: uppercase;
    }
    .offre-titre {
      font-size: 1.2rem;
      margin: 0.2rem 0;
    }
    .date-sub {
      font-size: 0.825rem;
      color: var(--text-muted);
    }
    .lettre-box {
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px dashed var(--border-color);
      background: #f8fafc;
      padding: 1rem;
      border-radius: var(--radius-sm);
    }
    .lettre-box h4 {
      font-size: 0.9rem;
      color: var(--primary);
      margin-bottom: 0.4rem;
    }
    .lettre-box p {
      font-size: 0.925rem;
      color: #334155;
      white-space: pre-line;
    }
    .text-accent { color: var(--accent); }
    .mt-3 { margin-top: 1rem; }
    .card-footer {
      padding-top: 0.75rem;
      border-top: 1px solid var(--border-color);
    }
    .cv-status {
      font-size: 0.85rem;
      font-weight: 600;
    }
    .btn-sm { padding: 0.35rem 0.75rem; font-size: 0.825rem; }
    .loading-spinner, .empty-box {
      text-align: center;
      padding: 3.5rem 1rem;
    }
    .empty-icon {
      font-size: 3rem;
      color: #cbd5e1;
      margin-bottom: 1rem;
    }
  `]
})
export class EtudiantDashboardComponent implements OnInit {
  private candidatureService = inject(CandidatureService);
  private authService = inject(AuthService);
  prenom = this.authService.currentUser()?.prenom ?? '';

  candidatures: Candidature[] = [];
  selectedCandidatureForView: Candidature | null = null;
  loading = true;

  ngOnInit() {
    this.candidatureService.getMesCandidaturesEtudiant().subscribe({
      next: (data) => {
        this.candidatures = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
