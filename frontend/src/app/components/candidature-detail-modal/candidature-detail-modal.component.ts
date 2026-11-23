import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Candidature } from '../../models/candidature.model';
import { StatusBadgeComponent } from '../status-badge/status-badge.component';

@Component({
  selector: 'app-candidature-detail-modal',
  standalone: true,
  imports: [CommonModule, StatusBadgeComponent],
  template: `
    <div class="modal-backdrop" (click)="onClose()">
      <div class="modal-dialog card" (click)="$event.stopPropagation()">
        
        <!-- HEADER -->
        <div class="modal-header">
          <div class="student-profile-summary">
            <div class="avatar-box">
              <i class="fa-solid fa-user-graduate"></i>
            </div>
            <div>
              <div class="student-meta-top">
                <span class="badge-matricule"><i class="fa-solid fa-id-card"></i> {{ candidature.matricule || 'N/A' }}</span>
                <span class="badge-filiere"><i class="fa-solid fa-graduation-cap"></i> {{ candidature.filiere }} ({{ candidature.niveau }})</span>
              </div>
              <h2 class="student-fullname">{{ candidature.etudiantPrenom }} {{ candidature.etudiantNom }}</h2>
              <p class="applied-offre"><i class="fa-solid fa-briefcase"></i> Postule pour : <strong>{{ candidature.offreTitre }}</strong></p>
            </div>
          </div>
          <div class="header-right">
            <app-status-badge [status]="candidature.statut || 'EN_ATTENTE'"></app-status-badge>
            <button (click)="onClose()" class="btn-close">&times;</button>
          </div>
        </div>

        <!-- NAVIGATION TABS -->
        <div class="modal-tabs">
          <button
            [class.active]="activeSection === 'cv'"
            (click)="activeSection = 'cv'"
            class="modal-tab-btn"
          >
            <i class="fa-solid fa-file-pdf"></i> CV
          </button>
          <button
            [class.active]="activeSection === 'lettre'"
            (click)="activeSection = 'lettre'"
            class="modal-tab-btn"
          >
            <i class="fa-solid fa-envelope-open-text"></i> Lettre de motivation
          </button>
          <button
            [class.active]="activeSection === 'profil'"
            (click)="activeSection = 'profil'"
            class="modal-tab-btn"
          >
            <i class="fa-solid fa-user-gear"></i> Profil de l'étudiant
          </button>
        </div>

        <!-- BODY -->
        <div class="modal-body">
          
          <!-- TAB 1: CURRICULUM VITAE -->
          @if (activeSection === 'cv') {
            <div class="cv-section">
              <div class="section-actions flex-between mb-3">
                <div>
                  <h4 class="section-title"><i class="fa-solid fa-file-lines text-accent"></i> CV de l'étudiant</h4>
                  <p class="sub-text">Consultez, téléchargez ou imprimez le CV officiel transmis pour cette candidature</p>
                </div>
                <div class="cv-buttons">
                  <button (click)="visualizeOrDownloadCv('view')" class="btn btn-primary btn-sm me-2">
                    <i class="fa-solid fa-eye"></i> Ouvrir / Previsualiser le CV
                  </button>
                  <button (click)="visualizeOrDownloadCv('download')" class="btn btn-secondary btn-sm me-2">
                    <i class="fa-solid fa-download"></i> Télécharger
                  </button>
                  <button (click)="visualizeOrDownloadCv('print')" class="btn btn-secondary btn-sm">
                    <i class="fa-solid fa-print"></i> Imprimer
                  </button>
                </div>
              </div>

              @if (safeCvUrl) {
                <!-- PDF EMBED WITH SANITIZED RESOURCE URL -->
                <div class="pdf-container">
                  <iframe [src]="safeCvUrl" class="pdf-iframe" title="CV PDF Viewer"></iframe>
                </div>
              } @else if (isImageDataUrl(candidature.cv)) {
                <!-- IMAGE CV PREVIEW -->
                <div class="image-cv-container">
                  <img [src]="candidature.cv" class="cv-image-preview" alt="CV Étudiant" />
                </div>
              } @else {
                <!-- SYNTHETIC / FORMATTED CV PREVIEW SHEET -->
                <div class="cv-document-sheet">
                  <div class="sheet-header flex-between">
                    <div>
                      <h3>{{ candidature.etudiantPrenom }} {{ candidature.etudiantNom }}</h3>
                      <p class="sheet-sub">{{ candidature.filiere }} — {{ candidature.niveau }}</p>
                      <p class="sheet-sub"><i class="fa-solid fa-building-columns"></i> Université de Labé (République de Guinée)</p>
                    </div>
                    <div class="sheet-badge">
                      <span>CV OFFICIEL</span>
                    </div>
                  </div>

                  <hr class="sheet-divider" />

                  <div class="sheet-grid">
                    <div class="sheet-col">
                      <h4><i class="fa-solid fa-address-book"></i> Coordonnées & Contact</h4>
                      <ul>
                        <li><i class="fa-solid fa-envelope"></i> Email: {{ candidature.etudiantEmail || 'Non spécifié' }}</li>
                        <li><i class="fa-solid fa-phone"></i> Téléphone: {{ candidature.telephone || '+224 620 00 00 00' }}</li>
                        <li><i class="fa-solid fa-id-card"></i> Matricule: {{ candidature.matricule }}</li>
                        <li><i class="fa-solid fa-location-dot"></i> Université: Campus de Hafia, Labé</li>
                      </ul>
                    </div>

                    <div class="sheet-col">
                      <h4><i class="fa-solid fa-graduation-cap"></i> Formation</h4>
                      <div class="timeline-item">
                        <span class="timeline-date">2023 - 2026</span>
                        <strong>Diplôme de Licence en {{ candidature.filiere }}</strong>
                        <p>Université de Labé — Niveau {{ candidature.niveau }}</p>
                        <p class="timeline-desc">Spécialisation Génie Informatique, Développement Web, Réseaux & Systèmes.</p>
                      </div>
                    </div>
                  </div>

                  <div class="sheet-full mt-3">
                    <h4><i class="fa-solid fa-laptop-code"></i> Compétences</h4>
                    <div class="skills-tags">
                      <span class="skill-tag">Java / Spring Boot</span>
                      <span class="skill-tag">Angular / TypeScript</span>
                      <span class="skill-tag">Bases de données SQL / MySQL</span>
                      <span class="skill-tag">HTML5 / CSS3 / JavaScript</span>
                      <span class="skill-tag">Git & Versioning</span>
                      <span class="skill-tag">Réseaux & Télécoms</span>
                      <span class="skill-tag">Algorithmique & POO</span>
                    </div>
                  </div>

                  <div class="sheet-full mt-3">
                    <h4><i class="fa-solid fa-paperclip"></i> Fichier associé</h4>
                    <p class="file-ref-box">
                      <i class="fa-solid fa-file-pdf text-danger"></i>
                      <span>{{ candidature.cv || 'cv_' + candidature.etudiantNom?.toLowerCase() + '.pdf' }}</span>
                    </p>
                  </div>
                </div>
              }
            </div>
          }

          <!-- TAB 2: LETTRE DE MOTIVATION -->
          @if (activeSection === 'lettre') {
            <div class="lettre-section">
              <div class="section-actions flex-between mb-3">
                <div>
                  <h4 class="section-title"><i class="fa-solid fa-pen-fancy text-accent"></i> Lettre de motivation</h4>
                  <p class="sub-text">Rédigée et transmise le {{ candidature.dateSoumission | date:'dd/MM/yyyy à HH:mm' }}</p>
                </div>
              </div>

              <div class="lettre-paper">
                <div class="lettre-header flex-between">
                  <div class="sender-info">
                    <strong>De : {{ candidature.etudiantPrenom }} {{ candidature.etudiantNom }}</strong><br />
                    <span>Matricule: {{ candidature.matricule }} ({{ candidature.filiere }})</span>
                  </div>
                  <div class="recipient-info">
                    <strong>À l'attention de : {{ candidature.raisonSocialeEntreprise || 'L\'Entreprise Recruteuse' }}</strong><br />
                    <span>Objet : Candidature pour l'offre « {{ candidature.offreTitre }} »</span>
                  </div>
                </div>

                <hr class="lettre-divider" />

                <div class="lettre-body-content">
                  <p class="lettre-text">{{ candidature.lettreMotivation }}</p>
                </div>

                <div class="lettre-footer flex-between">
                  <span class="sign-tag"><i class="fa-solid fa-certificate text-accent"></i> Candidature transmise via UniStage</span>
                  <span class="date-tag">{{ candidature.dateSoumission | date:'dd MMMM yyyy' }}</span>
                </div>
              </div>
            </div>
          }

          <!-- TAB 3: INFORMATIONS ÉTUDIANT -->
          @if (activeSection === 'profil') {
            <div class="profil-section">
              <h4 class="section-title"><i class="fa-solid fa-id-badge text-accent"></i> Profil du candidat</h4>
              
              <div class="info-grid">
                <div class="info-card">
                  <i class="fa-solid fa-user icon"></i>
                  <div>
                    <span class="label">Nom & Prénom</span>
                    <p class="value">{{ candidature.etudiantNom }} {{ candidature.etudiantPrenom }}</p>
                  </div>
                </div>

                <div class="info-card">
                  <i class="fa-solid fa-fingerprint icon"></i>
                  <div>
                    <span class="label">Matricule Étudiant</span>
                    <p class="value">{{ candidature.matricule }}</p>
                  </div>
                </div>

                <div class="info-card">
                  <i class="fa-solid fa-graduation-cap icon"></i>
                  <div>
                    <span class="label">Filière / Spécialité</span>
                    <p class="value">{{ candidature.filiere }}</p>
                  </div>
                </div>

                <div class="info-card">
                  <i class="fa-solid fa-layer-group icon"></i>
                  <div>
                    <span class="label">Niveau d'Étude</span>
                    <p class="value">{{ candidature.niveau }}</p>
                  </div>
                </div>

                <div class="info-card">
                  <i class="fa-solid fa-envelope icon"></i>
                  <div>
                    <span class="label">Adresse Email</span>
                    <p class="value"><a [href]="'mailto:' + candidature.etudiantEmail">{{ candidature.etudiantEmail }}</a></p>
                  </div>
                </div>

                <div class="info-card">
                  <i class="fa-solid fa-phone icon"></i>
                  <div>
                    <span class="label">Numéro Téléphone</span>
                    <p class="value"><a [href]="'tel:' + candidature.telephone">{{ candidature.telephone || 'Non spécifié' }}</a></p>
                  </div>
                </div>
              </div>
            </div>
          }

        </div>

        <!-- FOOTER ACTIONS: SEULEMENT LES BOUTONS D'ACTION POUR L'ENTREPRISE -->
        <div class="modal-footer flex-between">
          @if (isEntreprise) {
            <span class="footer-hint">
              <i class="fa-solid fa-circle-info"></i> Examinez le CV et la lettre avant de prendre une décision.
            </span>
            <div class="footer-buttons">
              <button (click)="onClose()" class="btn btn-secondary">
                Fermer
              </button>
              <button
                (click)="onUpdateStatut('REJETEE')"
                [disabled]="candidature.statut === 'REJETEE'"
                class="btn btn-danger"
              >
                <i class="fa-solid fa-xmark"></i> Refuser
              </button>
              <button
                (click)="onUpdateStatut('ACCEPTEE')"
                [disabled]="candidature.statut === 'ACCEPTEE'"
                class="btn btn-success"
              >
                <i class="fa-solid fa-check"></i> Accepter
              </button>
            </div>
          } @else {
            <span class="footer-hint text-accent">
              <i class="fa-solid fa-graduation-cap"></i> Votre dossier de candidature transmis à l'entreprise.
            </span>
            <div class="footer-buttons">
              <button (click)="onClose()" class="btn btn-secondary">
                Fermer
              </button>
            </div>
          }
        </div>

      </div>
    </div>
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(15, 23, 42, 0.75);
      backdrop-filter: blur(6px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2100;
      padding: 1.5rem;
    }
    .modal-dialog {
      background: #ffffff;
      border-radius: var(--radius-lg);
      width: 100%;
      max-width: 920px;
      max-height: 92vh;
      display: flex;
      flex-direction: column;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35);
      overflow: hidden;
      animation: modalFadeIn 0.25s ease-out;
    }
    @keyframes modalFadeIn {
      from { opacity: 0; transform: translateY(15px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .modal-header {
      padding: 1.25rem 1.75rem;
      background: #0f172a;
      color: #ffffff;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .student-profile-summary {
      display: flex;
      align-items: center;
      gap: 1.25rem;
    }
    .avatar-box {
      width: 52px;
      height: 52px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--accent) 0%, #0284c7 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      color: #ffffff;
      box-shadow: 0 4px 12px rgba(56, 189, 248, 0.4);
    }
    .student-meta-top {
      display: flex;
      gap: 0.6rem;
      margin-bottom: 0.25rem;
    }
    .badge-matricule, .badge-filiere {
      font-size: 0.75rem;
      font-weight: 700;
      padding: 0.15rem 0.5rem;
      border-radius: 4px;
      text-transform: uppercase;
    }
    .badge-matricule { background: rgba(255, 255, 255, 0.15); color: #38bdf8; }
    .badge-filiere { background: rgba(255, 255, 255, 0.1); color: #e2e8f0; }
    .student-fullname {
      font-size: 1.35rem;
      font-weight: 700;
      color: #ffffff;
      margin: 0;
    }
    .applied-offre {
      font-size: 0.875rem;
      color: #cbd5e1;
      margin-top: 0.2rem;
    }
    .header-right {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .btn-close {
      background: none;
      border: none;
      color: #94a3b8;
      font-size: 2rem;
      cursor: pointer;
      line-height: 1;
      transition: color 0.2s;
    }
    .btn-close:hover { color: #ffffff; }

    /* Tabs */
    .modal-tabs {
      display: flex;
      background: #1e293b;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      padding: 0 1.5rem;
      gap: 0.5rem;
    }
    .modal-tab-btn {
      background: none;
      border: none;
      color: #94a3b8;
      padding: 0.85rem 1.25rem;
      font-size: 0.925rem;
      font-weight: 600;
      cursor: pointer;
      border-bottom: 3px solid transparent;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .modal-tab-btn:hover { color: #e2e8f0; }
    .modal-tab-btn.active {
      color: #38bdf8;
      border-bottom-color: #38bdf8;
      background: rgba(255, 255, 255, 0.05);
    }

    /* Body */
    .modal-body {
      padding: 1.75rem;
      overflow-y: auto;
      flex: 1;
      background: #f8fafc;
    }
    .section-title {
      font-size: 1.1rem;
      color: var(--primary);
      margin-bottom: 0.25rem;
    }
    .sub-text { font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0; }
    .text-accent { color: var(--accent); }
    .text-danger { color: var(--danger); }
    .mt-3 { margin-top: 1.25rem; }
    .mb-3 { margin-bottom: 1.25rem; }
    .me-2 { margin-right: 0.5rem; }

    .cv-buttons { display: flex; gap: 0.4rem; flex-wrap: wrap; }

    /* Synthetic CV Sheet */
    .cv-document-sheet {
      background: #ffffff;
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      padding: 2rem;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
    }
    .sheet-header h3 { font-size: 1.4rem; color: var(--primary); margin: 0; }
    .sheet-sub { font-size: 0.875rem; color: var(--text-muted); margin: 0.15rem 0; }
    .sheet-badge span {
      background: #0f172a;
      color: #38bdf8;
      font-size: 0.75rem;
      font-weight: 800;
      padding: 0.35rem 0.75rem;
      border-radius: 20px;
      letter-spacing: 1px;
    }
    .sheet-divider { margin: 1.25rem 0; border: none; border-top: 2px solid var(--accent); }
    .sheet-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
    .sheet-col h4, .sheet-full h4 {
      font-size: 0.95rem;
      color: var(--primary);
      margin-bottom: 0.75rem;
      border-bottom: 1px solid var(--border-color);
      padding-bottom: 0.4rem;
    }
    .sheet-col ul { list-style: none; padding: 0; margin: 0; }
    .sheet-col li { font-size: 0.875rem; color: #334155; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.6rem; }
    .timeline-item { background: #f8fafc; padding: 0.85rem; border-radius: var(--radius-sm); border-left: 3px solid var(--accent); }
    .timeline-date { font-size: 0.75rem; font-weight: 700; color: var(--accent); display: block; }
    .timeline-desc { font-size: 0.825rem; color: var(--text-muted); margin-top: 0.3rem; }
    .skills-tags { display: flex; flex-wrap: wrap; gap: 0.5rem; }
    .skill-tag {
      background: #e0f2fe;
      color: #0369a1;
      font-size: 0.825rem;
      font-weight: 600;
      padding: 0.35rem 0.75rem;
      border-radius: 20px;
    }
    .file-ref-box {
      background: #f1f5f9;
      padding: 0.75rem 1rem;
      border-radius: var(--radius-sm);
      font-size: 0.9rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }
    .pdf-iframe {
      width: 100%;
      height: 550px;
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      background: #ffffff;
    }
    .cv-image-preview {
      max-width: 100%;
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-md);
      border: 1px solid var(--border-color);
    }

    /* Lettre Paper */
    .lettre-paper {
      background: #ffffff;
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      padding: 2rem;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
    }
    .lettre-header { font-size: 0.9rem; color: #334155; }
    .lettre-divider { margin: 1.25rem 0; border: none; border-top: 1px dashed var(--border-color); }
    .lettre-body-content {
      background: #f8fafc;
      padding: 1.5rem;
      border-radius: var(--radius-sm);
      border-left: 4px solid var(--accent);
      margin-bottom: 1.5rem;
    }
    .lettre-text {
      font-size: 0.975rem;
      line-height: 1.7;
      color: #1e293b;
      white-space: pre-line;
    }
    .lettre-footer { font-size: 0.825rem; color: var(--text-muted); }

    /* Profil Info Grid */
    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1rem;
      margin-top: 1rem;
    }
    .info-card {
      background: #ffffff;
      border: 1px solid var(--border-color);
      padding: 1rem 1.25rem;
      border-radius: var(--radius-sm);
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .info-card .icon {
      font-size: 1.5rem;
      color: var(--accent);
      width: 40px;
      height: 40px;
      background: #f0f9ff;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .info-card .label { font-size: 0.775rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; }
    .info-card .value { font-size: 0.95rem; font-weight: 600; color: var(--primary); margin-top: 0.15rem; }

    /* Footer */
    .modal-footer {
      padding: 1.25rem 1.75rem;
      background: #ffffff;
      border-top: 1px solid var(--border-color);
    }
    .footer-hint { font-size: 0.85rem; color: var(--text-muted); }
    .footer-buttons { display: flex; gap: 0.75rem; }
    .btn-sm { padding: 0.4rem 0.85rem; font-size: 0.85rem; }

    @media (max-width: 768px) {
      .modal-dialog { max-height: 95vh; margin: 0.5rem; }
      .sheet-grid { grid-template-columns: 1fr; }
      .modal-footer { flex-direction: column; gap: 1rem; align-items: stretch; }
      .footer-buttons { flex-direction: column; }
      .footer-buttons .btn { width: 100%; }
    }
  `]
})
export class CandidatureDetailModalComponent {
  private sanitizer = inject(DomSanitizer);

  @Input({ required: true }) candidature!: Candidature;
  @Input() isEntreprise: boolean = false;
  @Input() initialTab: 'cv' | 'lettre' | 'profil' = 'cv';

  @Output() close = new EventEmitter<void>();
  @Output() updateStatut = new EventEmitter<{ id: number; statut: string }>();

  activeSection: 'cv' | 'lettre' | 'profil' = 'cv';

  ngOnInit() {
    if (this.initialTab) {
      this.activeSection = this.initialTab;
    }
  }

  get safeCvUrl(): SafeResourceUrl | null {
    if (!this.candidature?.cv) return null;
    const cv = this.candidature.cv.trim();
    if (cv.startsWith('data:application/pdf') || cv.startsWith('http://') || cv.startsWith('https://')) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(cv);
    }
    return null;
  }

  isImageDataUrl(cvStr?: string): boolean {
    if (!cvStr) return false;
    const cv = cvStr.trim();
    return cv.startsWith('data:image/');
  }

  onClose() {
    this.close.emit();
  }

  onUpdateStatut(statut: string) {
    if (this.candidature.id) {
      this.updateStatut.emit({ id: this.candidature.id, statut });
    }
  }

  visualizeOrDownloadCv(action: 'view' | 'download' | 'print') {
    const cvStr = this.candidature.cv ? this.candidature.cv.trim() : '';

    if (cvStr.startsWith('data:application/pdf;base64,')) {
      try {
        const base64Data = cvStr.split(',')[1];
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        const blobUrl = URL.createObjectURL(blob);

        if (action === 'download') {
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = `CV_${this.candidature.etudiantPrenom}_${this.candidature.etudiantNom}.pdf`;
          a.click();
        } else {
          const win = window.open(blobUrl, '_blank');
          if (action === 'print' && win) {
            setTimeout(() => win.print(), 800);
          }
        }
        return;
      } catch (e) {
        console.error('Erreur conversion PDF Base64:', e);
      }
    } else if (cvStr.startsWith('http://') || cvStr.startsWith('https://')) {
      window.open(cvStr, '_blank');
      return;
    }

    // Impression / Visualisation synthétique ultra-propre
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>CV - ${this.candidature.etudiantPrenom} ${this.candidature.etudiantNom}</title>
            <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #1e293b; max-width: 800px; margin: 0 auto; line-height: 1.6; }
              .header { border-bottom: 3px solid #0284c7; padding-bottom: 15px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-start; }
              .name { font-size: 26px; font-weight: bold; color: #0f172a; margin: 0; }
              .subtitle { font-size: 15px; color: #0284c7; font-weight: 600; margin-top: 4px; }
              .section-box { background: #f8fafc; border-left: 4px solid #0284c7; padding: 15px 20px; border-radius: 6px; margin-bottom: 20px; }
              .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
              .title { font-size: 16px; font-weight: bold; color: #0f172a; border-bottom: 1px solid #cbd5e1; padding-bottom: 6px; margin-bottom: 12px; }
              .item { margin-bottom: 8px; font-size: 14px; }
              .label { font-weight: bold; color: #64748b; }
              .skills-tag { display: inline-block; background: #e0f2fe; color: #0369a1; padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: 600; margin-right: 5px; margin-bottom: 5px; }
              .univ-seal { text-align: center; margin-top: 30px; font-size: 12px; color: #64748b; border-top: 1px dashed #cbd5e1; padding-top: 15px; }
            </style>
          </head>
          <body>
            <div class="header">
              <div>
                <h1 class="name">${this.candidature.etudiantPrenom} ${this.candidature.etudiantNom}</h1>
                <div class="subtitle">Université de Labé — ${this.candidature.filiere || 'Licence 3 Informatique'} (${this.candidature.niveau || 'L3'})</div>
              </div>
              <div style="text-align: right; font-size: 12px; color: #64748b;">
                <strong>Matricule :</strong> ${this.candidature.matricule || 'N/A'}<br/>
                <strong>République de Guinée</strong>
              </div>
            </div>

            <div class="grid">
              <div>
                <div class="title">Informations de Contact</div>
                <div class="item"><span class="label">Email :</span> ${this.candidature.etudiantEmail || 'Non spécifié'}</div>
                <div class="item"><span class="label">Téléphone :</span> ${this.candidature.telephone || '+224 620 00 00 00'}</div>
                <div class="item"><span class="label">Université :</span> Université de Labé (Campus Hafia)</div>
              </div>
              <div>
                <div class="title">Parcours Académique</div>
                <div class="item"><strong>Licence en ${this.candidature.filiere || 'Informatique'}</strong></div>
                <div class="item" style="color: #64748b;">Université de Labé — Niveau ${this.candidature.niveau || 'L3'}</div>
              </div>
            </div>

            <div class="title">Compétences Techniques & Spécialités</div>
            <div style="margin-bottom: 20px;">
              <span class="skills-tag">Java / Spring Boot</span>
              <span class="skills-tag">Angular / TypeScript</span>
              <span class="skills-tag">Bases de données SQL</span>
              <span class="skills-tag">Réseaux & Systèmes</span>
              <span class="skills-tag">Git & Génie Logiciel</span>
            </div>

            <div class="title">Fichier CV Référencé</div>
            <div class="section-box">
              ${this.candidature.cv || 'CV_etudiant.pdf'}
            </div>

            <div class="univ-seal">
              🎓 Document de Candidature officiel UniStage — Université de Labé
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      if (action === 'print') {
        setTimeout(() => printWindow.print(), 500);
      }
    }
  }
}
