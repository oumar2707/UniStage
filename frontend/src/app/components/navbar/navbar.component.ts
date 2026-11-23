import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header class="navbar-header">
      <div class="container flex-navbar">
        <a routerLink="/" class="brand" (click)="closeMobileMenu()">
          <div class="logo-icon"><i class="fa-solid fa-graduation-cap"></i></div>
          <div class="brand-text">
            <span class="brand-title">UniStage <span>Labé</span></span>
            <span class="brand-sub">Université de Labé</span>
          </div>
        </a>

        <!-- Mobile Hamburger Toggle -->
        <button class="mobile-toggle" (click)="toggleMobileMenu()" aria-label="Toggle navigation">
          <i [class]="menuOpen() ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'"></i>
        </button>

        <nav class="nav-links" [class.mobile-open]="menuOpen()">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" (click)="closeMobileMenu()">
            <i class="fa-solid fa-house"></i> Offres de stage
          </a>

          @if (authService.currentUser(); as user) {
            @switch (user.role) {
              @case ('ETUDIANT') {
                <a routerLink="/etudiant" routerLinkActive="active" (click)="closeMobileMenu()">
                  <i class="fa-solid fa-graduation-cap"></i> Mon espace
                </a>
              }
              @case ('ENTREPRISE') {
                <a routerLink="/entreprise" routerLinkActive="active" (click)="closeMobileMenu()">
                  <i class="fa-solid fa-building"></i> Mon espace
                </a>
              }
              @case ('ADMIN') {
                <a routerLink="/admin" routerLinkActive="active" (click)="closeMobileMenu()">
                  <i class="fa-solid fa-user-shield"></i> Administration
                </a>
              }
            }

            <div class="user-profile-menu">
              <div class="user-info">
                <span class="user-name">
                  <i class="fa-solid fa-circle-user avatar-icon"></i> {{ user.prenom }} {{ user.nom }}
                </span>
                <span class="user-role-badge" [ngClass]="user.role.toLowerCase()">{{ user.role }}</span>
              </div>
              <button (click)="logout()" class="btn btn-outline btn-sm">
                <i class="fa-solid fa-right-from-bracket"></i> Déconnexion
              </button>
            </div>
          } @else {
            <div class="auth-buttons">
              <a routerLink="/login" class="btn btn-secondary" (click)="closeMobileMenu()">Connexion</a>
              <a routerLink="/register" class="btn btn-primary" (click)="closeMobileMenu()">Inscription</a>
            </div>
          }
        </nav>
      </div>
    </header>
  `,
  styles: [`
    .navbar-header {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-bottom: 1px solid var(--border-color);
      box-shadow: 0 4px 20px rgba(15, 23, 42, 0.05);
      position: sticky;
      top: 0;
      z-index: 1000;
      padding: 0.75rem 0;
    }
    .flex-navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      color: var(--primary);
    }
    .logo-icon {
      width: 44px;
      height: 44px;
      background: var(--accent);
      color: #ffffff;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      flex-shrink: 0;
    }
    .brand-text {
      display: flex;
      flex-direction: column;
    }
    .brand-title {
      font-family: 'Outfit', sans-serif;
      font-size: 1.3rem;
      font-weight: 700;
      color: var(--primary);
      line-height: 1.1;
    }
    .brand-title span {
      color: var(--accent);
    }
    .brand-sub {
      font-size: 0.7rem;
      color: var(--text-muted);
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .mobile-toggle {
      display: none;
      background: none;
      border: none;
      font-size: 1.5rem;
      color: var(--primary);
      cursor: pointer;
      padding: 0.5rem;
    }
    .nav-links {
      display: flex;
      align-items: center;
      gap: 1.25rem;
    }
    .nav-links a {
      color: var(--text-main);
      font-weight: 600;
      font-size: 0.925rem;
      display: flex;
      align-items: center;
      gap: 0.45rem;
      padding: 0.5rem 0.85rem;
      border-radius: var(--radius-sm);
      white-space: nowrap;
      transition: all 0.2s ease;
    }
    .nav-links a.active, .nav-links a:hover {
      color: var(--accent);
      background: var(--accent-soft);
    }
    .nav-links a.btn-primary, .nav-links a.btn-primary:hover {
      color: #ffffff;
      background: var(--accent);
    }
    .nav-links a.btn-primary:hover {
      background: var(--accent-dark);
    }
    .user-profile-menu {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding-left: 1rem;
      border-left: 1px solid var(--border-color);
    }
    .user-info {
      display: flex;
      flex-direction: column;
    }
    .user-name {
      font-size: 0.875rem;
      font-weight: 700;
      color: var(--primary);
      display: flex;
      align-items: center;
      gap: 0.35rem;
    }
    .avatar-icon {
      color: var(--accent);
    }
    .user-role-badge {
      font-size: 0.675rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 0.1rem 0.4rem;
      border-radius: 4px;
      width: max-content;
      margin-top: 0.1rem;
    }
    .user-role-badge.admin { background: #fee2e2; color: #991b1b; }
    .user-role-badge.etudiant { background: #dbeafe; color: #1e40af; }
    .user-role-badge.entreprise { background: #fef3c7; color: #92400e; }

    .btn-sm {
      padding: 0.4rem 0.85rem;
      font-size: 0.825rem;
    }
    .auth-buttons {
      display: flex;
      gap: 0.65rem;
    }

    /* Responsive Mobile & Tablet Header Menu */
    @media (max-width: 900px) {
      .mobile-toggle {
        display: block;
      }
      .nav-links {
        display: none;
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        background: #ffffff;
        flex-direction: column;
        align-items: stretch;
        padding: 1.25rem 1.5rem;
        box-shadow: 0 15px 30px rgba(0, 0, 0, 0.12);
        border-bottom: 1px solid var(--border-color);
        gap: 0.85rem;
      }
      .nav-links.mobile-open {
        display: flex;
      }
      .user-profile-menu {
        flex-direction: column;
        align-items: stretch;
        padding-left: 0;
        border-left: none;
        border-top: 1px solid var(--border-color);
        padding-top: 1rem;
      }
      .auth-buttons {
        flex-direction: column;
      }
      .auth-buttons .btn {
        width: 100%;
      }
    }
  `]
})
export class NavbarComponent {
  authService = inject(AuthService);
  private router = inject(Router);

  menuOpen = signal(false);

  toggleMobileMenu() {
    this.menuOpen.update(v => !v);
  }

  closeMobileMenu() {
    this.menuOpen.set(false);
  }

  logout() {
    this.closeMobileMenu();
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
