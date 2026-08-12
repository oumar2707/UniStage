import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OffreStage } from '../../models/offre.model';
import { StatusBadgeComponent } from '../status-badge/status-badge.component';

@Component({
  selector: 'app-offre-card',
  standalone: true,
  imports: [CommonModule, StatusBadgeComponent],
  template: `
    <article class="card offre-card">
      <div class="offre-header">
        <div class="company-avatar" [ngClass]="getCompanyClass(offre.raisonSociale)">
          <i [class]="getCompanyIcon(offre.raisonSociale)"></i>
        </div>
        <div class="offre-title-area">
          <div class="company-row">
            <span class="company-name">{{ offre.raisonSociale || 'Entreprise Partenaire' }}</span>
            <span class="verified-tag"><i class="fa-solid fa-circle-check"></i> Vérifié</span>
          </div>
          <h3 class="offre-title">{{ offre.titre }}</h3>
        </div>
        <app-status-badge [status]="offre.statut || 'OUVERTE'"></app-status-badge>
      </div>

      <p class="offre-desc">{{ offre.description }}</p>

      <div class="offre-meta">
        <span><i class="fa-solid fa-location-dot meta-icon"></i> {{ offre.lieu }}</span>
        @if (offre.secteurActivite) {
          <span><i class="fa-solid fa-layer-group meta-icon"></i> {{ offre.secteurActivite }}</span>
        }
        @if (offre.dateDebut) {
          <span><i class="fa-regular fa-calendar-days meta-icon"></i> Début: {{ offre.dateDebut }}</span>
        }
      </div>

      <div class="skills-chips">
        @for (skill of getSkillsArray(offre.competencesRequises); track skill) {
          <span class="chip"><i class="fa-solid fa-code"></i> {{ skill }}</span>
        }
      </div>

      <div class="offre-actions">
        @if (showPostulerBtn && offre.statut === 'OUVERTE') {
          <button (click)="onPostuler()" class="btn btn-primary btn-full">
            <i class="fa-solid fa-paper-plane"></i> Postuler à cette offre
          </button>
        }
      </div>
    </article>
  `,
  styles: [`
    .offre-card {
      display: flex;
      flex-direction: column;
      height: 100%;
      background: #ffffff;
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.25s ease, border-color 0.25s ease;
      box-shadow: 0 4px 12px rgba(15, 23, 42, 0.03);
    }
    .offre-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 15px 30px rgba(15, 23, 42, 0.1);
      border-color: #cbd5e1;
    }
    .offre-header {
      display: flex;
      align-items: flex-start;
      gap: 0.85rem;
      margin-bottom: 1rem;
    }
    .company-avatar {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.3rem;
      flex-shrink: 0;
      color: #ffffff;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    }
    .avatar-orange { background: linear-gradient(135deg, #ff7900 0%, #e65100 100%); }
    .avatar-kouma { background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%); }
    .avatar-nesten { background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); }
    .avatar-ansuten { background: linear-gradient(135deg, #059669 0%, #047857 100%); }
    .avatar-sylla { background: linear-gradient(135deg, #06b6d4 0%, #0e7490 100%); }
    .avatar-default { background: linear-gradient(135deg, #0b132b 0%, #1c2541 100%); }

    .offre-title-area {
      flex: 1;
    }
    .company-row {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.2rem;
    }
    .company-name {
      font-size: 0.8rem;
      font-weight: 800;
      color: var(--primary);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .verified-tag {
      font-size: 0.7rem;
      color: #059669;
      background: #ecfdf5;
      padding: 0.15rem 0.45rem;
      border-radius: 20px;
      font-weight: 700;
    }
    .offre-title {
      font-size: 1.1rem;
      color: var(--primary);
      margin: 0;
      line-height: 1.35;
    }
    .offre-desc {
      font-size: 0.9rem;
      color: var(--text-muted);
      margin-bottom: 1.25rem;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      line-height: 1.5;
    }
    .offre-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 0.85rem;
      font-size: 0.825rem;
      color: var(--text-main);
      margin-bottom: 1rem;
      padding-top: 0.75rem;
      border-top: 1px dashed var(--border-color);
    }
    .offre-meta span {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      font-weight: 500;
    }
    .meta-icon {
      color: var(--accent);
    }
    .skills-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 0.45rem;
      margin-bottom: 1.25rem;
      margin-top: auto;
    }
    .chip {
      background: #f1f5f9;
      color: #334155;
      font-size: 0.75rem;
      font-weight: 700;
      padding: 0.25rem 0.65rem;
      border-radius: 6px;
      display: flex;
      align-items: center;
      gap: 0.35rem;
      border: 1px solid #e2e8f0;
    }
    .offre-actions {
      margin-top: 0.5rem;
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

  getCompanyClass(raisonSociale?: string): string {
    if (!raisonSociale) return 'avatar-default';
    const name = raisonSociale.toLowerCase();
    if (name.includes('orange')) return 'avatar-orange';
    if (name.includes('kouma')) return 'avatar-kouma';
    if (name.includes('nesten')) return 'avatar-nesten';
    if (name.includes('ansuten')) return 'avatar-ansuten';
    if (name.includes('sylla')) return 'avatar-sylla';
    return 'avatar-default';
  }

  getCompanyIcon(raisonSociale?: string): string {
    if (!raisonSociale) return 'fa-solid fa-building';
    const name = raisonSociale.toLowerCase();
    if (name.includes('orange')) return 'fa-solid fa-tower-cell';
    if (name.includes('kouma')) return 'fa-solid fa-brain';
    if (name.includes('nesten')) return 'fa-solid fa-laptop-code';
    if (name.includes('ansuten')) return 'fa-solid fa-network-wired';
    if (name.includes('sylla')) return 'fa-solid fa-code';
    return 'fa-solid fa-building';
  }

  getSkillsArray(skillsString?: string): string[] {
    if (!skillsString) return [];
    return skillsString.split(',').map(s => s.trim()).filter(s => s.length > 0);
  }

  onPostuler() {
    this.postuler.emit(this.offre);
  }
}
