import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OffreStage } from '../../models/offre.model';
import { StatusBadgeComponent } from '../status-badge/status-badge.component';

const AVATAR_COLORS = ['#1d4ed8', '#0f766e', '#7c3aed', '#b45309', '#be185d', '#0369a1'];

@Component({
  selector: 'app-offre-card',
  standalone: true,
  imports: [CommonModule, StatusBadgeComponent],
  template: `
    <article class="card offre-card">
      <div class="offre-top">
        <div class="company">
          <div class="company-avatar" [style.background]="avatarColor(offre.raisonSociale)">
            {{ initials(offre.raisonSociale) }}
          </div>
          <div class="company-text">
            <span class="company-name">{{ offre.raisonSociale || 'Entreprise' }}</span>
            @if (offre.secteurActivite) {
              <span class="company-sector">{{ offre.secteurActivite }}</span>
            }
          </div>
        </div>
        <app-status-badge [status]="offre.statut || 'OUVERTE'"></app-status-badge>
      </div>

      <h3 class="offre-title">{{ offre.titre }}</h3>
      <p class="offre-desc">{{ offre.description }}</p>

      <div class="offre-meta">
        <span><i class="fa-solid fa-location-dot"></i> {{ offre.lieu }}</span>
        @if (offre.dateDebut) {
          <span><i class="fa-regular fa-calendar"></i> Dès le {{ offre.dateDebut | date: 'd MMM yyyy' }}</span>
        }
      </div>

      <div class="skills-chips">
        @for (skill of getSkillsArray(offre.competencesRequises); track skill) {
          <span class="chip">{{ skill }}</span>
        }
      </div>

      @if (showPostulerBtn && offre.statut === 'OUVERTE') {
        <button (click)="onPostuler()" class="btn btn-primary btn-full">
          Postuler
        </button>
      }
    </article>
  `,
  styles: [`
    .offre-card {
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    .offre-card:hover {
      box-shadow: var(--shadow-md);
      border-color: #d1d5db;
    }
    .offre-top {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }
    .company {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      min-width: 0;
    }
    .company-avatar {
      width: 42px;
      height: 42px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      color: #ffffff;
      font-weight: 600;
      font-size: 0.95rem;
    }
    .company-text {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }
    .company-name {
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--text-main);
    }
    .company-sector {
      font-size: 0.8rem;
      color: var(--text-muted);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .offre-title {
      font-size: 1.15rem;
      margin: 0 0 0.5rem;
    }
    .offre-desc {
      font-size: 0.9rem;
      color: var(--text-muted);
      margin: 0 0 1rem;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      line-height: 1.55;
    }
    .offre-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem 1.1rem;
      font-size: 0.85rem;
      color: var(--text-main);
      margin-bottom: 1rem;
    }
    .offre-meta i {
      color: var(--text-muted);
      margin-right: 0.3rem;
    }
    .skills-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
      margin-bottom: 1.25rem;
      margin-top: auto;
    }
    .chip {
      background: var(--accent-soft);
      color: var(--accent-dark);
      font-size: 0.775rem;
      font-weight: 500;
      padding: 0.2rem 0.6rem;
      border-radius: 6px;
    }
    .btn-full {
      width: 100%;
    }
  `]
})
export class OffreCardComponent {
  @Input({ required: true }) offre!: OffreStage;
  @Input() showPostulerBtn = true;
  @Output() postuler = new EventEmitter<OffreStage>();

  initials(name?: string): string {
    if (!name) return '?';
    const words = name.replace(/\b(SARL|SA|SAS|Group)\b/gi, '').trim().split(/\s+/);
    return words.slice(0, 2).map(w => w.charAt(0).toUpperCase()).join('');
  }

  avatarColor(name?: string): string {
    if (!name) return AVATAR_COLORS[0];
    let hash = 0;
    for (const c of name) hash = (hash * 31 + c.charCodeAt(0)) | 0;
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
  }

  getSkillsArray(skillsString?: string): string[] {
    if (!skillsString) return [];
    return skillsString.split(',').map(s => s.trim()).filter(s => s.length > 0);
  }

  onPostuler() {
    this.postuler.emit(this.offre);
  }
}
