import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { OffreService } from '../../services/offre.service';
import { CandidatureService } from '../../services/candidature.service';
import { AuthService } from '../../services/auth.service';
import { OffreStage } from '../../models/offre.model';
import { OffreCardComponent } from '../../components/offre-card/offre-card.component';
import { CandidatureModalComponent } from '../../components/candidature-modal/candidature-modal.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, OffreCardComponent, CandidatureModalComponent],
  template: `
    <!-- Hero Section avec Diaporama d'Images en Arrière-plan (Slider HD) -->
    <section class="hero-section">
      <!-- Arrière-plans en carrousel avec fondu enchaîné -->
      <div class="slideshow-container">
        @for (slide of slides; track $index) {
          <div
            class="slide-layer"
            [class.active]="currentSlide() === $index"
            [style.background-image]="'url(' + slide + ')'"
          ></div>
        }
      </div>

      <!-- Masque de contraste ultra-lisible -->
      <div class="hero-bg-overlay"></div>

      <div class="container hero-content">
        <h1 class="hero-title">
          Découvrez vos Offres de Stage de Fin d'Études
        </h1>
        <p class="hero-subtitle">
          Plateforme officielle de gestion des offres de stage pour l'Université de Labé. Postulez en un clic auprès de nos entreprises partenaires réelles (Kouma Academy, Nesten Group, ANSUTEN, Orange Guinée, Sylla Tech Labs).
        </p>

        <!-- Stats Quick Overview Bar -->
        <div class="stats-bar">
          <div class="stat-item">
            <span class="stat-num">5</span>
            <span class="stat-label">Entreprises Partenaires</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-num">100%</span>
            <span class="stat-label">Stages Valides L3</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-num">Labé & Regional</span>
            <span class="stat-label">Guinée</span>
          </div>
        </div>

        <!-- Search & Filter Bar -->
        <div class="search-box">
          <div class="search-input-group">
            <i class="fa-solid fa-magnifying-glass search-icon"></i>
            <input
              type="text"
              [(ngModel)]="searchKeyword"
              (keyup.enter)="filterOffres()"
              placeholder="Rechercher (Java, Python, Angular, Réseaux, Cisco)..."
              class="search-input"
            />
          </div>
          <div class="search-select-group">
            <i class="fa-solid fa-layer-group filter-icon"></i>
            <select [(ngModel)]="selectedSecteur" (change)="filterOffres()" class="search-select">
              <option value="">Tous les secteurs d'activité</option>
              <option value="Formation Tech & Intelligence Artificielle">Kouma Academy (IA & Tech)</option>
              <option value="Ingénierie & Systèmes d'Information">Nesten Group (Ingénierie Web)</option>
              <option value="Télécommunications & Inclusion Numérique">ANSUTEN (Télécoms & Numérique)</option>
              <option value="Télécommunications & Informatique">Orange Guinée (Réseaux & IT)</option>
              <option value="Développement Web & IA">Sylla Tech Labs (Front-End & Mobile)</option>
            </select>
          </div>
          <button (click)="filterOffres()" class="btn btn-primary btn-search">
            <i class="fa-solid fa-bolt"></i> Rechercher
          </button>
        </div>

        <!-- Indicateurs de Carrousel Flottants -->
        <div class="carousel-indicators">
          @for (slide of slides; track $index) {
            <button
              class="indicator-dot"
              [class.active]="currentSlide() === $index"
              (click)="setSlide($index)"
              [attr.aria-label]="'Slide ' + ($index + 1)"
            ></button>
          }
        </div>
      </div>
    </section>

    <!-- Main Content: Offers List -->
    <main class="main-container container">
      @if (alertMessage) {
        <div [class]="alertClass" class="alert">
          <i class="fa-solid fa-circle-info"></i> {{ alertMessage }}
        </div>
      }

      <div class="section-header flex-between">
        <div>
          <h2>Offres de Stage Ouvertes</h2>
          <p class="section-sub">{{ offres.length }} opportunité(s) disponible(s) en ce moment</p>
        </div>
        @if (searchKeyword || selectedSecteur) {
          <button (click)="resetFilters()" class="btn btn-secondary btn-sm">
            <i class="fa-solid fa-rotate-left"></i> Réinitialiser les filtres
          </button>
        }
      </div>

      @if (loading) {
        <div class="loading-spinner">
          <i class="fa-solid fa-spinner fa-spin"></i> Chargement des offres de stage...
        </div>
      } @else {
        @if (offres.length > 0) {
          <div class="grid-3">
            @for (item of offres; track item.id) {
              <app-offre-card
                [offre]="item"
                (postuler)="onOpenPostulerModal($event)"
              ></app-offre-card>
            }
          </div>
        } @else {
          <div class="empty-state card">
            <i class="fa-solid fa-folder-open empty-icon"></i>
            <h3>Aucune offre de stage ne correspond à vos critères</h3>
            <p>Essayez de modifier vos termes de recherche ou de réinitialiser les filtres.</p>
            <button (click)="resetFilters()" class="btn btn-secondary mt-3">Voir toutes les offres</button>
          </div>
        }
      }
    </main>

    <!-- Modal Formulaire Candidature -->
    @if (selectedOffreForPostuler) {
      <app-candidature-modal
        [offre]="selectedOffreForPostuler"
        (close)="selectedOffreForPostuler = null"
        (submitted)="onSendCandidature($event)"
      ></app-candidature-modal>
    }
  `,
  styles: [`
    .hero-section {
      position: relative;
      color: #ffffff;
      padding: 5rem 0 4.5rem;
      text-align: center;
      overflow: hidden;
      min-height: 480px;
      display: flex;
      align-items: center;
    }
    .slideshow-container {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 0;
    }
    .slide-layer {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-size: cover;
      background-position: center center;
      background-repeat: no-repeat;
      opacity: 0;
      transform: scale(1.02);
      transition: opacity 1.4s ease-in-out, transform 7s ease-out;
    }
    .slide-layer.active {
      opacity: 1;
      transform: scale(1.08);
    }
    .hero-bg-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, rgba(11, 19, 43, 0.78) 0%, rgba(28, 37, 65, 0.72) 50%, rgba(15, 23, 42, 0.82) 100%);
      z-index: 1;
    }
    .hero-content {
      position: relative;
      z-index: 2;
      width: 100%;
    }
    .hero-title {
      font-size: 2.85rem;
      color: #ffffff;
      margin-bottom: 1rem;
      max-width: 850px;
      margin-left: auto;
      margin-right: auto;
      text-shadow: 0 2px 14px rgba(0, 0, 0, 0.6);
    }
    .hero-subtitle {
      font-size: 1.1rem;
      color: #f1f5f9;
      max-width: 760px;
      margin: 0 auto 2.25rem;
      line-height: 1.6;
      text-shadow: 0 1px 8px rgba(0, 0, 0, 0.6);
    }

    /* Stats Bar */
    .stats-bar {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 2rem;
      margin-bottom: 2.5rem;
      background: rgba(11, 19, 43, 0.65);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      padding: 0.85rem 2rem;
      border-radius: 50px;
      width: max-content;
      margin-left: auto;
      margin-right: auto;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
    }
    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .stat-num {
      font-family: 'Outfit', sans-serif;
      font-size: 1.5rem;
      font-weight: 800;
      color: #38bdf8;
    }
    .stat-label {
      font-size: 0.775rem;
      color: #e2e8f0;
      font-weight: 700;
      text-transform: uppercase;
    }
    .stat-divider {
      width: 1px;
      height: 28px;
      background: rgba(255, 255, 255, 0.25);
    }

    /* Search Box */
    .search-box {
      background: #ffffff;
      border-radius: var(--radius-md);
      padding: 0.75rem;
      display: flex;
      gap: 0.75rem;
      max-width: 950px;
      margin: 0 auto 1.5rem;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.45);
    }
    .search-input-group, .search-select-group {
      position: relative;
      flex: 1;
      display: flex;
      align-items: center;
    }
    .search-icon, .filter-icon {
      position: absolute;
      left: 1.15rem;
      color: var(--text-muted);
    }
    .search-input, .search-select {
      width: 100%;
      padding: 0.85rem 1rem 0.85rem 2.75rem;
      border: 1px solid var(--border-color);
      border-radius: var(--radius-sm);
      font-size: 0.95rem;
      color: var(--primary);
      background: #f8fafc;
    }
    .search-input:focus, .search-select:focus {
      background: #ffffff;
    }
    .btn-search {
      padding: 0 2rem;
      white-space: nowrap;
    }

    /* Carousel Indicators */
    .carousel-indicators {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.6rem;
      margin-top: 1rem;
    }
    .indicator-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.35);
      border: none;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    .indicator-dot.active {
      background: #38bdf8;
      width: 32px;
      border-radius: 10px;
      box-shadow: 0 0 10px rgba(56, 189, 248, 0.6);
    }

    /* Main Section */
    .main-container {
      padding-top: 3.5rem;
      padding-bottom: 4.5rem;
    }
    .section-header {
      margin-bottom: 2rem;
    }
    .section-sub {
      color: var(--text-muted);
      font-size: 0.95rem;
    }
    .loading-spinner {
      text-align: center;
      padding: 4rem 0;
      font-size: 1.1rem;
      color: var(--text-muted);
    }
    .empty-state {
      text-align: center;
      padding: 4rem 1rem;
    }
    .empty-icon {
      font-size: 3.5rem;
      color: #cbd5e1;
      margin-bottom: 1rem;
    }
    .mt-3 { margin-top: 1.25rem; }

    @media (max-width: 768px) {
      .hero-section { padding: 3.5rem 0 3rem; }
      .search-box { flex-direction: column; }
      .hero-title { font-size: 2rem; }
      .stats-bar {
        flex-direction: column;
        gap: 0.75rem;
        border-radius: var(--radius-md);
        width: 100%;
      }
      .stat-divider { display: none; }
    }
  `]
})
export class HomeComponent implements OnInit, OnDestroy {
  private offreService = inject(OffreService);
  private candidatureService = inject(CandidatureService);
  private authService = inject(AuthService);
  private router = inject(Router);

  offres: OffreStage[] = [];
  loading = true;
  searchKeyword = '';
  selectedSecteur = '';

  selectedOffreForPostuler: OffreStage | null = null;
  alertMessage: string | null = null;
  alertClass = 'alert alert-success';

  // Slideshow state
  slides: string[] = ['/hero-bg-1.png', '/hero-bg-2.png', '/hero-bg-3.png'];
  currentSlide = signal(0);
  private slideInterval: any;

  ngOnInit() {
    this.loadOffres();
    this.startSlideshow();
  }

  ngOnDestroy() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }

  startSlideshow() {
    this.slideInterval = setInterval(() => {
      this.currentSlide.update(c => (c + 1) % this.slides.length);
    }, 5000);
  }

  setSlide(index: number) {
    this.currentSlide.set(index);
  }

  loadOffres() {
    this.loading = true;
    this.offreService.getOffresPubliques(this.selectedSecteur, this.searchKeyword).subscribe({
      next: (data) => {
        this.offres = data;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.showAlert(err.message || 'Impossible de charger les offres', 'alert alert-danger');
      }
    });
  }

  filterOffres() {
    this.loadOffres();
  }

  resetFilters() {
    this.searchKeyword = '';
    this.selectedSecteur = '';
    this.loadOffres();
  }

  onOpenPostulerModal(offre: OffreStage) {
    if (!this.authService.isLoggedIn()) {
      this.showAlert('Veuillez vous connecter en tant qu\'étudiant pour postuler.', 'alert alert-danger');
      this.router.navigate(['/login']);
      return;
    }

    if (this.authService.getUserRole() !== 'ETUDIANT') {
      this.showAlert('Seuls les étudiants finissants enregistrés peuvent déposer une candidature.', 'alert alert-danger');
      return;
    }

    this.selectedOffreForPostuler = offre;
  }

  onSendCandidature(payload: { lettreMotivation: string; cv?: string }) {
    if (!this.selectedOffreForPostuler || !this.selectedOffreForPostuler.id) return;

    this.candidatureService.postuler(this.selectedOffreForPostuler.id, payload.lettreMotivation, payload.cv).subscribe({
      next: () => {
        this.selectedOffreForPostuler = null;
        this.showAlert('Votre candidature a été soumise avec succès ! L\'entreprise pourra consulter votre CV et votre lettre de motivation.', 'alert alert-success');
      },
      error: (err) => {
        this.selectedOffreForPostuler = null;
        this.showAlert(err.message, 'alert alert-danger');
      }
    });
  }

  private showAlert(msg: string, cssClass: string) {
    this.alertMessage = msg;
    this.alertClass = cssClass;
    setTimeout(() => {
      this.alertMessage = null;
    }, 6000);
  }
}
