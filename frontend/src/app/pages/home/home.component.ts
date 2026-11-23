import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RevealDirective } from '../../directives/reveal.directive';
import { CountUpDirective } from '../../directives/count-up.directive';
import { OffreService } from '../../services/offre.service';
import { CandidatureService } from '../../services/candidature.service';
import { AuthService } from '../../services/auth.service';
import { OffreStage } from '../../models/offre.model';
import { OffreCardComponent } from '../../components/offre-card/offre-card.component';
import { CandidatureModalComponent } from '../../components/candidature-modal/candidature-modal.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, OffreCardComponent, CandidatureModalComponent, RevealDirective, CountUpDirective],
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
        <p class="hero-eyebrow anim-fade-up">Université de Labé · Faculté des Sciences et Techniques</p>
        <h1 class="hero-title anim-fade-up" style="animation-delay: 100ms">Trouvez votre stage de fin d'études</h1>
        <p class="hero-subtitle anim-fade-up" style="animation-delay: 200ms">
          Les offres des entreprises partenaires réunies en un seul endroit.
          Consultez-les, postulez en ligne et suivez vos candidatures.
        </p>

        <div class="search-box anim-fade-up" style="animation-delay: 300ms">
          <div class="search-input-group">
            <i class="fa-solid fa-magnifying-glass search-icon"></i>
            <input
              type="text"
              [(ngModel)]="searchKeyword"
              (keyup.enter)="filterOffres()"
              placeholder="Mot-clé : Java, Angular, réseaux…"
              class="search-input"
              aria-label="Rechercher une offre"
            />
          </div>
          <div class="search-select-group">
            <i class="fa-solid fa-layer-group filter-icon"></i>
            <select [(ngModel)]="selectedSecteur" (change)="filterOffres()" class="search-select" aria-label="Secteur d'activité">
              <option value="">Tous les secteurs</option>
              @for (s of secteurs; track s) {
                <option [value]="s">{{ s }}</option>
              }
            </select>
          </div>
          <button (click)="filterOffres()" class="btn btn-primary btn-search">Rechercher</button>
        </div>

        <div class="stats-bar anim-fade-up" style="animation-delay: 400ms">
          <div class="stat-item">
            <span class="stat-num" [appCountUp]="stats.offres"></span>
            <span class="stat-label">offre{{ stats.offres > 1 ? 's' : '' }} ouverte{{ stats.offres > 1 ? 's' : '' }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-num" [appCountUp]="stats.entreprises"></span>
            <span class="stat-label">entreprise{{ stats.entreprises > 1 ? 's' : '' }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-num" [appCountUp]="secteurs.length"></span>
            <span class="stat-label">secteur{{ secteurs.length > 1 ? 's' : '' }}</span>
          </div>
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
          <h2>Offres de stage</h2>
          <p class="section-sub">
            {{ offres.length }} offre{{ offres.length > 1 ? 's' : '' }}
            {{ searchKeyword || selectedSecteur ? 'correspondant à votre recherche' : 'disponible' + (offres.length > 1 ? 's' : '') }}
          </p>
        </div>
        @if (searchKeyword || selectedSecteur) {
          <button (click)="resetFilters()" class="btn btn-secondary btn-sm">
            <i class="fa-solid fa-xmark"></i> Effacer les filtres
          </button>
        }
      </div>

      @if (loading) {
        <div class="loading-spinner">
          <i class="fa-solid fa-spinner fa-spin"></i> Chargement des offres…
          <p class="loading-hint">Le premier chargement peut prendre jusqu'à une minute.</p>
        </div>
      } @else {
        @if (offres.length > 0) {
          <div class="grid-3">
            @for (item of offres; track item.id; let i = $index) {
              <app-offre-card
                appReveal
                [revealDelay]="(i % 3) * 90"
                [offre]="item"
                (postuler)="onOpenPostulerModal($event)"
              ></app-offre-card>
            }
          </div>
        } @else {
          <div class="empty-state card">
            <i class="fa-solid fa-folder-open empty-icon"></i>
            <h3>Aucune offre ne correspond à votre recherche</h3>
            <p>Essayez un autre mot-clé ou un autre secteur.</p>
            <button (click)="resetFilters()" class="btn btn-secondary mt-3">Voir toutes les offres</button>
          </div>
        }
      }
    </main>

    <section class="section section-white">
      <div class="container">
        <div class="section-head" appReveal>
          <span class="eyebrow">Comment ça marche</span>
          <h2>Trois étapes jusqu'à votre stage</h2>
          <p>Un parcours simple, de la recherche d'offre jusqu'à la réponse de l'entreprise.</p>
        </div>
        <div class="steps">
          <div class="step lift" appReveal>
            <div class="step-icon"><i class="fa-solid fa-user-plus"></i></div>
            <h3>Créez votre compte</h3>
            <p>Inscrivez-vous avec votre matricule et ajoutez votre CV une seule fois.</p>
          </div>
          <div class="step lift" appReveal [revealDelay]="120">
            <div class="step-icon"><i class="fa-solid fa-paper-plane"></i></div>
            <h3>Postulez en ligne</h3>
            <p>Choisissez une offre et envoyez votre lettre de motivation en quelques clics.</p>
          </div>
          <div class="step lift" appReveal [revealDelay]="240">
            <div class="step-icon"><i class="fa-solid fa-bell"></i></div>
            <h3>Suivez la réponse</h3>
            <p>L'état de chaque candidature est mis à jour dès que l'entreprise l'a étudiée.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="feature">
          <div class="feature-media" appReveal>
            <img src="/images/etudiants.jpg" alt="Étudiants travaillant ensemble sur des ordinateurs" loading="lazy" width="1024" height="1024" />
            <div class="feature-badge"><i class="fa-solid fa-check"></i> Candidature envoyée</div>
          </div>
          <div class="feature-text" appReveal [revealDelay]="120">
            <span class="eyebrow">Pour les étudiants</span>
            <h2>Un seul endroit pour toutes vos candidatures</h2>
            <p>Fini les CV envoyés un peu partout : vos candidatures et leurs réponses sont regroupées dans votre espace.</p>
            <ul class="check-list">
              <li><i class="fa-solid fa-circle-check"></i> Offres vérifiées, publiées par des entreprises validées par l'université</li>
              <li><i class="fa-solid fa-circle-check"></i> Recherche par mot-clé et par secteur d'activité</li>
              <li><i class="fa-solid fa-circle-check"></i> Suivi en temps réel : en attente, acceptée ou refusée</li>
            </ul>
            @if (!isLoggedIn) {
              <a routerLink="/register" class="btn btn-primary">Créer mon compte étudiant</a>
            }
          </div>
        </div>

        <div class="feature feature-reverse">
          <div class="feature-media" appReveal>
            <img src="/images/entreprise.jpg" alt="Équipe en entreprise devant des postes de travail" loading="lazy" width="1024" height="1024" />
            <div class="feature-badge"><i class="fa-solid fa-user-check"></i> Nouveau candidat</div>
          </div>
          <div class="feature-text" appReveal [revealDelay]="120">
            <span class="eyebrow">Pour les entreprises</span>
            <h2>Recrutez les futurs diplômés de l'université</h2>
            <p>Publiez vos offres de stage et recevez directement les candidatures des étudiants de la FST.</p>
            <ul class="check-list">
              <li><i class="fa-solid fa-circle-check"></i> Publication d'une offre en quelques minutes</li>
              <li><i class="fa-solid fa-circle-check"></i> CV et lettres de motivation consultables en ligne</li>
              <li><i class="fa-solid fa-circle-check"></i> Réponse aux candidats en un clic</li>
            </ul>
            @if (!isLoggedIn) {
              <a routerLink="/register" class="btn btn-outline">Inscrire mon entreprise</a>
            }
          </div>
        </div>
      </div>
    </section>

    @if (!isLoggedIn) {
      <section class="section section-cta">
        <div class="container">
          <div class="cta-band" appReveal>
            <h2>Prêt à trouver votre stage ?</h2>
            <p>Créez votre compte en deux minutes et postulez dès aujourd'hui aux offres disponibles.</p>
            <div class="cta-actions">
              <a routerLink="/register" class="btn btn-light">Créer un compte</a>
              <a routerLink="/login" class="btn btn-ghost-light">Se connecter</a>
            </div>
          </div>
        </div>
      </section>
    }

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
      background: rgba(15, 27, 61, 0.8);
      z-index: 1;
    }
    .hero-content {
      position: relative;
      z-index: 2;
      width: 100%;
    }
    .hero-eyebrow {
      font-size: 0.85rem;
      font-weight: 500;
      color: #c7d2fe;
      margin: 0 0 0.75rem;
    }
    .hero-title {
      font-size: 2.75rem;
      color: #ffffff;
      margin: 0 auto 1rem;
      max-width: 760px;
    }
    .hero-subtitle {
      font-size: 1.075rem;
      color: #e5e7eb;
      max-width: 620px;
      margin: 0 auto 2rem;
      line-height: 1.6;
    }

    .stats-bar {
      display: flex;
      justify-content: center;
      gap: 2.5rem;
      margin-top: 1.75rem;
    }
    .stat-item {
      display: flex;
      align-items: baseline;
      gap: 0.4rem;
      color: #e5e7eb;
      font-size: 0.9rem;
    }
    .stat-num {
      font-family: 'Outfit', sans-serif;
      font-size: 1.35rem;
      font-weight: 700;
      color: #ffffff;
    }

    .search-box {
      background: #ffffff;
      border-radius: var(--radius-md);
      padding: 0.6rem;
      display: flex;
      gap: 0.6rem;
      max-width: 860px;
      margin: 0 auto;
      box-shadow: var(--shadow-lg);
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
    .search-input, .search-select { font-family: inherit; }
    .search-input:focus, .search-select:focus {
      outline: none;
      border-color: var(--accent);
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
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.35);
      border: none;
      padding: 0;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    .indicator-dot.active {
      background: #ffffff;
      width: 22px;
      border-radius: 8px;
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
      font-size: 1.05rem;
      color: var(--text-muted);
    }
    .loading-hint {
      font-size: 0.85rem;
      margin-top: 0.5rem;
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
      .hero-title { font-size: 1.9rem; }
      .hero-subtitle { font-size: 1rem; }
      .stats-bar { gap: 1.25rem; flex-wrap: wrap; }
      .stat-num { font-size: 1.15rem; }
    }
  `]
})
export class HomeComponent implements OnInit, OnDestroy {
  private offreService = inject(OffreService);
  private candidatureService = inject(CandidatureService);
  private authService = inject(AuthService);
  private router = inject(Router);

  offres: OffreStage[] = [];
  secteurs: string[] = [];
  stats = { offres: 0, entreprises: 0 };
  loading = true;
  searchKeyword = '';
  selectedSecteur = '';

  selectedOffreForPostuler: OffreStage | null = null;
  alertMessage: string | null = null;
  alertClass = 'alert alert-success';

  // Slideshow state
  slides: string[] = ['/images/etudiants.jpg', '/images/entreprise.jpg'];

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
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
        if (!this.searchKeyword && !this.selectedSecteur) {
          this.updateOverview(data);
        }
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

  private updateOverview(all: OffreStage[]) {
    const unique = (values: (string | undefined)[]) =>
      [...new Set(values.filter((v): v is string => !!v))].sort((a, b) => a.localeCompare(b, 'fr'));
    this.secteurs = unique(all.map(o => o.secteurActivite));
    this.stats = {
      offres: all.filter(o => o.statut === 'OUVERTE').length,
      entreprises: unique(all.map(o => o.raisonSociale)).length
    };
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
