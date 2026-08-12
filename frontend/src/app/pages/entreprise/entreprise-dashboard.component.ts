import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OffreService } from '../../services/offre.service';
import { CandidatureService } from '../../services/candidature.service';
import { OffreStage } from '../../models/offre.model';
import { Candidature } from '../../models/candidature.model';
import { StatusBadgeComponent } from '../../components/status-badge/status-badge.component';
import { CandidatureDetailModalComponent } from '../../components/candidature-detail-modal/candidature-detail-modal.component';

@Component({
  selector: 'app-entreprise-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, StatusBadgeComponent, CandidatureDetailModalComponent],
  template: `
    <div class="dashboard-page container">
      <div class="page-header flex-between">
        <div>
          <span class="page-tag"><i class="fa-solid fa-building"></i> Espace Partenaire</span>
          <h1>Tableau de Bord Entreprise</h1>
          <p class="sub-text">Gestion de vos offres de stage et traitement des candidatures reçues</p>
        </div>
        <a routerLink="/entreprise/offres/nouvelle" class="btn btn-primary btn-new-offre">
          <i class="fa-solid fa-plus"></i> Publier une Nouvelle Offre
        </a>
      </div>

      <!-- Navigation Tabs -->
      <div class="tabs-nav-container">
        <div class="tabs-nav">
          <button [class.active]="activeTab === 'offres'" (click)="activeTab = 'offres'" class="tab-btn">
            <i class="fa-solid fa-list-check"></i> Mes Offres de Stage ({{ offres.length }})
          </button>
          <button [class.active]="activeTab === 'candidatures'" (click)="activeTab = 'candidatures'" class="tab-btn">
            <i class="fa-solid fa-users"></i> Candidatures Reçues ({{ candidatures.length }})
          </button>
        </div>
      </div>

      @if (alertMessage) {
        <div class="alert alert-success mt-3">
          <i class="fa-solid fa-circle-check"></i> {{ alertMessage }}
        </div>
      }

      <!-- TAB 1: MES OFFRES -->
      @if (activeTab === 'offres') {
        @if (offres.length > 0) {
          <div class="grid-2 mt-3">
            @for (item of offres; track item.id) {
              <div class="offre-manage-card card">
                <div class="flex-between">
                  <h3 class="offre-titre">{{ item.titre }}</h3>
                  <app-status-badge [status]="item.statut || 'OUVERTE'"></app-status-badge>
                </div>

                <p class="offre-meta"><i class="fa-solid fa-location-dot"></i> {{ item.lieu }} | <i class="fa-regular fa-calendar"></i> Début: {{ item.dateDebut }}</p>
                <p class="offre-desc">{{ item.description }}</p>

                <div class="card-footer-actions flex-between">
                  <span class="cand-count"><i class="fa-solid fa-user-group"></i> {{ item.nombreCandidatures || 0 }} candidature(s)</span>
                  <button (click)="onDeleteOffre(item.id!)" class="btn btn-danger btn-sm">
                    <i class="fa-solid fa-trash"></i> Supprimer
                  </button>
                </div>
              </div>
            }
          </div>
        } @else {
          <div class="empty-box card mt-3">
            <i class="fa-solid fa-folder-plus empty-icon"></i>
            <h3>Aucune offre de stage publiée</h3>
            <p>Commencez à recruter les talents de l'Université de Labé en publiant votre première offre.</p>
            <a routerLink="/entreprise/offres/nouvelle" class="btn btn-primary mt-3">Créer une offre</a>
          </div>
        }
      }

      <!-- TAB 2: CANDIDATURES REÇUES -->
      @if (activeTab === 'candidatures') {
        @if (candidatures.length > 0) {
          <div class="candidatures-list mt-3">
            @for (cand of candidatures; track cand.id) {
              <div class="candidature-item card">
                <div class="candidature-header flex-between">
                  <div>
                    <span class="student-name">
                      <i class="fa-solid fa-user-graduate"></i> {{ cand.etudiantPrenom }} {{ cand.etudiantNom }} (Matricule: {{ cand.matricule }})
                    </span>
                    <h3 class="offre-applied">Postule pour : {{ cand.offreTitre }}</h3>
                    <p class="student-meta">
                      <span><i class="fa-solid fa-envelope"></i> {{ cand.etudiantEmail }}</span>
                      <span><i class="fa-solid fa-phone"></i> {{ cand.telephone || 'Non renseigné' }}</span>
                      <span><i class="fa-solid fa-book-bookmark"></i> {{ cand.filiere }} ({{ cand.niveau }})</span>
                    </p>
                  </div>
                  <app-status-badge [status]="cand.statut || 'EN_ATTENTE'"></app-status-badge>
                </div>

                <div class="lettre-box">
                  <p><strong><i class="fa-solid fa-pen-nib"></i> Lettre de motivation :</strong></p>
                  <p class="motivation-text">{{ cand.lettreMotivation }}</p>
                </div>

                <div class="candidature-actions flex-between mt-3">
                  <span class="date-submitted"><i class="fa-regular fa-clock"></i> Reçue le: {{ cand.dateSoumission | date:'dd/MM/yyyy HH:mm' }}</span>
                  <div class="action-buttons">
                    <button
                      (click)="openCandidatureModal(cand, 'cv')"
                      class="btn btn-primary btn-sm btn-consult-cv"
                      title="Afficher directement le CV de l'étudiant"
                    >
                      <i class="fa-solid fa-file-pdf"></i> Visualiser le CV
                    </button>
                    <button
                      (click)="openCandidatureModal(cand, 'lettre')"
                      class="btn btn-secondary btn-sm"
                      title="Consulter l'ensemble du dossier (Lettre, Profil)"
                    >
                      <i class="fa-solid fa-envelope-open-text"></i> Lettre & Dossier
                    </button>
                    <button
                      (click)="onUpdateStatut(cand.id!, 'ACCEPTEE')"
                      [disabled]="cand.statut === 'ACCEPTEE'"
                      class="btn btn-success btn-sm"
                    >
                      <i class="fa-solid fa-check"></i> Accepter
                    </button>
                    <button
                      (click)="onUpdateStatut(cand.id!, 'REJETEE')"
                      [disabled]="cand.statut === 'REJETEE'"
                      class="btn btn-danger btn-sm"
                    >
                      <i class="fa-solid fa-xmark"></i> Refuser
                    </button>
                  </div>
                </div>
              </div>
            }
          </div>
        } @else {
          <div class="empty-box card mt-3">
            <i class="fa-solid fa-inbox empty-icon"></i>
            <h3>Aucune candidature reçue pour le moment</h3>
            <p>Les candidatures soumises par les étudiants s'afficheront ici automatiquement.</p>
          </div>
        }
      }

      <!-- MODAL DE CONSULTATION DU DOSSIER DE CANDIDATURE (CV + LETTRE) -->
      @if (selectedCandidatureForView) {
        <app-candidature-detail-modal
          [candidature]="selectedCandidatureForView"
          [isEntreprise]="true"
          [initialTab]="initialModalTab"
          (close)="selectedCandidatureForView = null"
          (updateStatut)="onUpdateStatutFromModal($event)"
        ></app-candidature-detail-modal>
      }
    </div>
  `,
  styles: [`
    .dashboard-page { padding: 2.5rem 1rem; }
    .page-tag { font-size: 0.8rem; font-weight: 700; color: var(--accent); text-transform: uppercase; }
    .sub-text { color: var(--text-muted); font-size: 0.95rem; }
    .tabs-nav-container {
      width: 100%;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      border-bottom: 2px solid var(--border-color);
      margin-top: 1.25rem;
    }
    .tabs-nav { display: flex; gap: 0.5rem; white-space: nowrap; width: max-content; }
    .tab-btn { padding: 0.75rem 1.25rem; background: none; border: none; font-size: 0.95rem; font-weight: 600; color: var(--text-muted); cursor: pointer; border-bottom: 3px solid transparent; }
    .tab-btn.active { color: var(--accent); border-bottom-color: var(--accent); }
    .mt-3 { margin-top: 1.25rem; }
    .offre-manage-card { display: flex; flex-direction: column; height: 100%; }
    .offre-titre { font-size: 1.15rem; color: var(--primary); }
    .offre-meta { font-size: 0.85rem; color: var(--text-muted); margin: 0.4rem 0; }
    .offre-desc { font-size: 0.9rem; color: var(--text-main); margin-bottom: 1rem; }
    .card-footer-actions { margin-top: auto; padding-top: 0.75rem; border-top: 1px dashed var(--border-color); }
    .cand-count { font-size: 0.85rem; font-weight: 600; color: var(--primary); }
    .btn-sm { padding: 0.35rem 0.75rem; font-size: 0.825rem; }
    .btn-consult-cv {
      background: linear-gradient(135deg, var(--accent) 0%, #0284c7 100%);
      border: none;
      box-shadow: 0 4px 10px rgba(56, 189, 248, 0.25);
    }
    .candidature-item { border-left: 4px solid var(--accent); margin-bottom: 1.25rem; }
    .student-name { font-size: 0.9rem; font-weight: 700; color: var(--accent); }
    .offre-applied { font-size: 1.1rem; margin: 0.2rem 0; }
    .student-meta { display: flex; gap: 1rem; font-size: 0.85rem; color: var(--text-muted); flex-wrap: wrap; }
    .lettre-box { background: #f8fafc; padding: 0.85rem; border-radius: var(--radius-sm); margin-top: 0.85rem; }
    .motivation-text { font-size: 0.9rem; white-space: pre-line; color: #334155; }
    .action-buttons { display: flex; gap: 0.5rem; flex-wrap: wrap; }
    .empty-box { text-align: center; padding: 3.5rem 1rem; }
    .empty-icon { font-size: 3rem; color: #cbd5e1; margin-bottom: 1rem; }

    @media (max-width: 768px) {
      .dashboard-page { padding: 1.5rem 0.75rem; }
      .btn-new-offre { width: 100%; margin-top: 0.75rem; }
      .candidature-actions { flex-direction: column; align-items: flex-start; gap: 0.75rem; }
      .action-buttons { width: 100%; flex-direction: column; }
      .action-buttons .btn { width: 100%; }
    }
  `]
})
export class EntrepriseDashboardComponent implements OnInit {
  private offreService = inject(OffreService);
  private candidatureService = inject(CandidatureService);

  activeTab: 'offres' | 'candidatures' = 'offres';
  offres: OffreStage[] = [];
  candidatures: Candidature[] = [];
  selectedCandidatureForView: Candidature | null = null;
  initialModalTab: 'cv' | 'lettre' | 'profil' = 'cv';
  alertMessage: string | null = null;

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.offreService.getOffresEntreprise().subscribe(data => this.offres = data);
    this.candidatureService.getCandidaturesEntreprise().subscribe(data => this.candidatures = data);
  }

  openCandidatureModal(cand: Candidature, tab: 'cv' | 'lettre' | 'profil' = 'cv') {
    this.initialModalTab = tab;
    this.selectedCandidatureForView = cand;
  }

  onDeleteOffre(id: number) {
    if (confirm('Voulez-vous vraiment supprimer cette offre de stage ?')) {
      this.offreService.deleteOffreEntreprise(id).subscribe(() => {
        this.showAlert('Offre de stage supprimée.');
        this.loadData();
      });
    }
  }

  onUpdateStatut(id: number, statut: string) {
    this.candidatureService.updateStatutCandidature(id, statut).subscribe(() => {
      this.showAlert(`Statut de la candidature mis à jour à : ${statut}`);
      this.loadData();
    });
  }

  onUpdateStatutFromModal(event: { id: number; statut: string }) {
    this.onUpdateStatut(event.id, event.statut);
    this.selectedCandidatureForView = null;
  }

  private showAlert(msg: string) {
    this.alertMessage = msg;
    setTimeout(() => this.alertMessage = null, 4000);
  }
}

