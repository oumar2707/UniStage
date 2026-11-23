import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OffreStage } from '../../models/offre.model';

@Component({
  selector: 'app-candidature-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="modal-backdrop" (click)="onClose()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <div>
            <span class="modal-sub"><i class="fa-solid fa-graduation-cap"></i> Université de Labé — Postuler</span>
            <h2 class="modal-title">{{ offre.titre }}</h2>
          </div>
          <button (click)="onClose()" class="close-btn">&times;</button>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="modal-body">
            <div class="offre-summary">
              <p><strong><i class="fa-solid fa-building"></i> Entreprise :</strong> {{ offre.raisonSociale }}</p>
              <p><strong><i class="fa-solid fa-location-dot"></i> Lieu :</strong> {{ offre.lieu }}</p>
            </div>

            <!-- CHAMP CV JOINT -->
            <div class="form-group mb-3">
              <label class="form-label" for="cvInput">
                <i class="fa-solid fa-file-pdf text-accent"></i> CV <span class="badge-tag">Recommandé</span>
              </label>
              
              <div class="cv-upload-zone">
                <input
                  type="file"
                  id="cvInput"
                  (change)="onFileSelected($event)"
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.txt"
                  class="file-input-hidden"
                  #fileInput
                />
                
                @if (selectedFileName) {
                  <div class="file-preview-card">
                    <i class="fa-solid fa-file-pdf file-icon"></i>
                    <div class="file-info">
                      <span class="file-name">{{ selectedFileName }}</span>
                      <span class="file-status text-success"><i class="fa-solid fa-circle-check"></i> CV prêt à être transmis</span>
                    </div>
                    <button type="button" (click)="removeFile()" class="btn-remove-file" title="Changer de CV">
                      <i class="fa-solid fa-xmark"></i>
                    </button>
                  </div>
                } @else {
                  <div class="upload-dropzone" (click)="fileInput.click()">
                    <i class="fa-solid fa-cloud-arrow-up upload-icon"></i>
                    <div>
                      <strong>Cliquez ici pour joindre votre CV (PDF, DOCX)</strong>
                      <p class="sub-text">Ou votre CV par défaut enregistré sur votre profil sera transmis.</p>
                    </div>
                  </div>
                }
              </div>
            </div>

            <!-- CHAMP LETTRE DE MOTIVATION -->
            <div class="form-group">
              <label class="form-label" for="lettreMotivation">
                <i class="fa-solid fa-pen-nib text-accent"></i> Lettre de motivation <span class="required">*</span>
              </label>
              <textarea
                id="lettreMotivation"
                formControlName="lettreMotivation"
                rows="6"
                class="form-control"
                placeholder="Exposez vos motivations pour ce stage à l'entreprise..."
              ></textarea>

              @if (form.get('lettreMotivation')?.touched && form.get('lettreMotivation')?.errors?.['required']) {
                <p class="form-error"><i class="fa-solid fa-triangle-exclamation"></i> La lettre de motivation est obligatoire.</p>
              }
              @if (form.get('lettreMotivation')?.touched && form.get('lettreMotivation')?.errors?.['minlength']) {
                <p class="form-error"><i class="fa-solid fa-triangle-exclamation"></i> Veuillez saisir au moins 30 caractères.</p>
              }
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" (click)="onClose()" class="btn btn-secondary">Annuler</button>
            <button type="submit" [disabled]="form.invalid || submitting" class="btn btn-primary">
              @if (submitting) {
                <i class="fa-solid fa-spinner fa-spin"></i> Envoi en cours...
              } @else {
                <i class="fa-solid fa-paper-plane"></i> Transmettre ma candidature
              }
            </button>
          </div>
        </form>
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
      background: rgba(15, 23, 42, 0.65);
      backdrop-filter: blur(5px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2000;
      padding: 1rem;
    }
    .modal-content {
      background: #ffffff;
      border-radius: var(--radius-md);
      width: 100%;
      max-width: 650px;
      box-shadow: var(--shadow-lg);
      overflow: hidden;
      animation: modalSlide 0.25s ease-out;
    }
    @keyframes modalSlide {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    .modal-header {
      padding: 1.25rem 1.5rem;
      background: #f8fafc;
      border-bottom: 1px solid var(--border-color);
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .modal-sub {
      font-size: 0.775rem;
      font-weight: 700;
      color: var(--accent);
      text-transform: uppercase;
    }
    .modal-title {
      font-size: 1.25rem;
      color: var(--primary);
      margin-top: 0.2rem;
    }
    .close-btn {
      background: none;
      border: none;
      font-size: 1.75rem;
      color: var(--text-muted);
      cursor: pointer;
      line-height: 1;
    }
    .modal-body {
      padding: 1.5rem;
    }
    .offre-summary {
      background: #f1f5f9;
      padding: 0.85rem 1rem;
      border-radius: var(--radius-sm);
      margin-bottom: 1.25rem;
      font-size: 0.9rem;
      border-left: 3px solid var(--accent);
    }
    .text-accent { color: var(--accent); }
    .mb-3 { margin-bottom: 1.25rem; }
    .badge-tag {
      background: #e0f2fe;
      color: #0369a1;
      font-size: 0.7rem;
      font-weight: 700;
      padding: 0.15rem 0.4rem;
      border-radius: 4px;
      margin-left: 0.4rem;
      text-transform: uppercase;
    }
    .file-input-hidden { display: none; }
    .upload-dropzone {
      border: 2px dashed #cbd5e1;
      border-radius: var(--radius-sm);
      padding: 1.25rem;
      text-align: center;
      background: #f8fafc;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
    }
    .upload-dropzone:hover {
      border-color: var(--accent);
      background: #f0f9ff;
    }
    .upload-icon {
      font-size: 2rem;
      color: var(--accent);
    }
    .sub-text {
      font-size: 0.8rem;
      color: var(--text-muted);
      margin-top: 0.2rem;
    }
    .file-preview-card {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      padding: 0.85rem 1rem;
      border-radius: var(--radius-sm);
    }
    .file-icon {
      font-size: 1.8rem;
      color: #16a34a;
    }
    .file-info {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    .file-name {
      font-weight: 600;
      font-size: 0.9rem;
      color: #15803d;
    }
    .file-status {
      font-size: 0.775rem;
    }
    .btn-remove-file {
      background: none;
      border: none;
      color: #991b1b;
      font-size: 1.25rem;
      cursor: pointer;
    }
    .required {
      color: var(--danger);
    }
    .modal-footer {
      padding: 1rem 1.5rem;
      background: #f8fafc;
      border-top: 1px solid var(--border-color);
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
    }
  `]
})
export class CandidatureModalComponent {
  @Input({ required: true }) offre!: OffreStage;
  @Output() close = new EventEmitter<void>();
  @Output() submitted = new EventEmitter<{ lettreMotivation: string; cv?: string }>();

  form: FormGroup;
  submitting = false;
  selectedFileName: string | null = null;
  cvBase64: string | null = null;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      lettreMotivation: ['', [Validators.required, Validators.minLength(30)]]
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFileName = file.name;
      const reader = new FileReader();
      reader.onload = () => {
        this.cvBase64 = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removeFile() {
    this.selectedFileName = null;
    this.cvBase64 = null;
  }

  onClose() {
    this.close.emit();
  }

  onSubmit() {
    if (this.form.valid) {
      this.submitting = true;
      this.submitted.emit({
        lettreMotivation: this.form.value.lettreMotivation,
        cv: this.cvBase64 || undefined
      });
    }
  }
}

