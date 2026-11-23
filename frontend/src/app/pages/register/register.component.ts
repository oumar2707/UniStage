import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-page container">
      <div class="auth-card card">
        <div class="auth-header">
          <h2 class="auth-title">Créer un compte</h2>
          <p class="auth-sub">Choisissez votre type de compte</p>

          <!-- Toggle Role Tabs -->
          <div class="role-toggle">
            <button
              type="button"
              [class.active]="selectedRole === 'ETUDIANT'"
              (click)="selectRole('ETUDIANT')"
              class="role-btn"
            >
              <i class="fa-solid fa-user-graduate"></i> Étudiant
            </button>
            <button
              type="button"
              [class.active]="selectedRole === 'ENTREPRISE'"
              (click)="selectRole('ENTREPRISE')"
              class="role-btn"
            >
              <i class="fa-solid fa-building"></i> Entreprise
            </button>
          </div>
        </div>

        @if (errorMessage) {
          <div class="alert alert-danger py-2 mb-2">
            <i class="fa-solid fa-triangle-exclamation"></i> {{ errorMessage }}
          </div>
        }

        <!-- FORMULAIRE ÉTUDIANT -->
        @if (selectedRole === 'ETUDIANT') {
          <form [formGroup]="etudiantForm" (ngSubmit)="onSubmitEtudiant()" class="compact-form">
            <div class="grid-2 gap-compact">
              <div class="form-group compact">
                <label class="form-label" for="nomEtu">Nom *</label>
                <input id="nomEtu" formControlName="nom" class="form-control compact-input" placeholder="ex: Diallo" />
              </div>

              <div class="form-group compact">
                <label class="form-label" for="prenomEtu">Prénom *</label>
                <input id="prenomEtu" formControlName="prenom" class="form-control compact-input" placeholder="ex: Alpha Oumar" />
              </div>
            </div>

            <div class="grid-2 gap-compact">
              <div class="form-group compact">
                <label class="form-label" for="emailEtu">Adresse e-mail *</label>
                <input id="emailEtu" type="email" formControlName="email" class="form-control compact-input" placeholder="alpha.diallo@etudiant.univ-labe.edu.gn" />
              </div>

              <div class="form-group compact">
                <label class="form-label" for="passEtu">Mot de passe *</label>
                <input id="passEtu" type="password" formControlName="motDePasse" class="form-control compact-input" placeholder="6 car. min" />
              </div>
            </div>

            <div class="grid-3 gap-compact">
              <div class="form-group compact">
                <label class="form-label" for="matricule">Matricule *</label>
                <input id="matricule" formControlName="matricule" class="form-control compact-input" placeholder="ETU-2026-001" />
              </div>

              <div class="form-group compact">
                <label class="form-label" for="filiere">Filière *</label>
                <input id="filiere" formControlName="filiere" class="form-control compact-input" placeholder="L3 Informatique" />
              </div>

              <div class="form-group compact">
                <label class="form-label" for="niveau">Niveau *</label>
                <input id="niveau" formControlName="niveau" class="form-control compact-input" placeholder="L3" />
              </div>
            </div>

            <div class="form-group compact">
              <label class="form-label" for="telEtu">Téléphone</label>
              <input id="telEtu" formControlName="telephone" class="form-control compact-input" placeholder="+224 6XX XX XX XX" />
            </div>

            <!-- Champ CV avec Téléversement de fichier -->
            <div class="form-group compact">
              <label class="form-label">
                <i class="fa-solid fa-file-pdf text-danger"></i> CV <span class="badge-tag">Recommandé</span>
              </label>
              
              <div class="cv-register-upload">
                <input
                  type="file"
                  id="cvFileInput"
                  (change)="onCvFileSelected($event)"
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.txt"
                  class="file-input-hidden"
                  #cvInputRef
                />

                @if (selectedCvFileName) {
                  <div class="file-preview-mini">
                    <i class="fa-solid fa-file-pdf text-success"></i>
                    <span class="file-name-text">{{ selectedCvFileName }}</span>
                    <button type="button" (click)="removeCvFile()" class="btn-remove-mini" title="Retirer">
                      <i class="fa-solid fa-xmark"></i>
                    </button>
                  </div>
                } @else {
                  <div class="upload-box-mini" (click)="cvInputRef.click()">
                    <i class="fa-solid fa-cloud-arrow-up"></i>
                    <span>Téléverser mon CV (PDF, DOCX) ou coller un lien ci-dessous</span>
                  </div>
                }

                @if (!selectedCvFileName) {
                  <input
                    id="cvEtu"
                    formControlName="cv"
                    class="form-control compact-input mt-1"
                    placeholder="Ou collez un lien Drive / URL..."
                  />
                }
              </div>
            </div>

            <button type="submit" [disabled]="etudiantForm.invalid || loading" class="btn btn-primary btn-block compact-btn">
              @if (loading) {
                <i class="fa-solid fa-spinner fa-spin"></i> Inscription...
              } @else {
                <i class="fa-solid fa-user-plus"></i> Créer mon compte étudiant
              }
            </button>
          </form>
        }

        <!-- FORMULAIRE ENTREPRISE -->
        @if (selectedRole === 'ENTREPRISE') {
          <form [formGroup]="entrepriseForm" (ngSubmit)="onSubmitEntreprise()" class="compact-form">
            <div class="grid-2 gap-compact">
              <div class="form-group compact">
                <label class="form-label" for="raisonSociale">Raison sociale *</label>
                <input id="raisonSociale" formControlName="raisonSociale" class="form-control compact-input" placeholder="Orange Guinee Labé" />
              </div>

              <div class="form-group compact">
                <label class="form-label" for="secteurActivite">Secteur d'activité *</label>
                <input id="secteurActivite" formControlName="secteurActivite" class="form-control compact-input" placeholder="Télécommunications & IT" />
              </div>
            </div>

            <div class="grid-2 gap-compact">
              <div class="form-group compact">
                <label class="form-label" for="nomEnt">Nom du contact *</label>
                <input id="nomEnt" formControlName="nom" class="form-control compact-input" placeholder="Diallo" />
              </div>
              <div class="form-group compact">
                <label class="form-label" for="prenomEnt">Prénom du contact *</label>
                <input id="prenomEnt" formControlName="prenom" class="form-control compact-input" placeholder="Mamadou" />
              </div>
            </div>

            <div class="grid-2 gap-compact">
              <div class="form-group compact">
                <label class="form-label" for="emailEnt">E-mail professionnel *</label>
                <input id="emailEnt" type="email" formControlName="email" class="form-control compact-input" placeholder="contact@entreprise.gn" />
              </div>

              <div class="form-group compact">
                <label class="form-label" for="passEnt">Mot de passe *</label>
                <input id="passEnt" type="password" formControlName="motDePasse" class="form-control compact-input" placeholder="6 car. min" />
              </div>
            </div>

            <div class="grid-2 gap-compact">
              <div class="form-group compact">
                <label class="form-label" for="adresse">Adresse / Ville</label>
                <input id="adresse" formControlName="adresse" class="form-control compact-input" placeholder="Quartier Tata, Labé" />
              </div>

              <div class="form-group compact">
                <label class="form-label" for="siteWeb">Site web</label>
                <input id="siteWeb" formControlName="siteWeb" class="form-control compact-input" placeholder="https://..." />
              </div>
            </div>

            <button type="submit" [disabled]="entrepriseForm.invalid || loading" class="btn btn-primary btn-block compact-btn">
              @if (loading) {
                <i class="fa-solid fa-spinner fa-spin"></i> Inscription...
              } @else {
                <i class="fa-solid fa-building-circle-check"></i> Créer mon compte entreprise
              }
            </button>
          </form>
        }

        <div class="auth-footer compact-footer">
          <p>Déjà inscrit ? <a routerLink="/login">Se connecter</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 1.5rem 0.5rem;
      min-height: calc(100vh - 120px);
    }
    .auth-card {
      width: 100%;
      max-width: 540px;
      padding: 1.25rem 1.5rem;
      border-radius: var(--radius-md);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
    }
    .auth-header {
      text-align: center;
      margin-bottom: 1rem;
    }
    .auth-title {
      font-size: 1.45rem;
      color: var(--primary);
      margin-bottom: 0.2rem;
    }
    .auth-sub {
      font-size: 0.8rem;
      color: var(--text-muted);
      margin-bottom: 0.85rem;
    }
    .role-toggle {
      display: flex;
      background: #f1f5f9;
      padding: 0.2rem;
      border-radius: var(--radius-sm);
      gap: 0.25rem;
    }
    .role-btn {
      flex: 1;
      padding: 0.45rem 0.5rem;
      border: none;
      background: transparent;
      font-weight: 600;
      font-size: 0.825rem;
      color: var(--text-muted);
      border-radius: var(--radius-sm);
      cursor: pointer;
      transition: var(--transition);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.4rem;
    }
    .role-btn.active {
      background: #ffffff;
      color: var(--accent);
      box-shadow: var(--shadow-sm);
    }
    .compact-form {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .gap-compact {
      gap: 0.6rem !important;
    }
    .form-group.compact {
      margin-bottom: 0.4rem;
    }
    .form-group.compact .form-label {
      font-size: 0.775rem;
      font-weight: 700;
      margin-bottom: 0.2rem;
      display: block;
      color: #334155;
    }
    .compact-input {
      padding: 0.45rem 0.65rem !important;
      font-size: 0.85rem !important;
      height: 36px;
      border-radius: 6px;
    }
    .compact-btn {
      width: 100%;
      margin-top: 0.6rem;
      padding: 0.55rem;
      font-size: 0.9rem;
    }
    .badge-tag {
      background: #e0f2fe;
      color: #0369a1;
      font-size: 0.65rem;
      font-weight: 700;
      padding: 0.1rem 0.35rem;
      border-radius: 4px;
      margin-left: 0.3rem;
      text-transform: uppercase;
    }
    .file-input-hidden { display: none; }
    .upload-box-mini {
      border: 2px dashed #cbd5e1;
      background: #f8fafc;
      border-radius: 6px;
      padding: 0.5rem 0.75rem;
      text-align: center;
      cursor: pointer;
      font-size: 0.8rem;
      color: var(--accent);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      transition: all 0.2s;
    }
    .upload-box-mini:hover {
      background: #f0f9ff;
      border-color: var(--accent);
    }
    .file-preview-mini {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      padding: 0.4rem 0.65rem;
      border-radius: 6px;
      font-size: 0.825rem;
    }
    .file-name-text {
      flex: 1;
      font-weight: 600;
      color: #15803d;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .btn-remove-mini {
      background: none;
      border: none;
      color: #991b1b;
      font-size: 1rem;
      cursor: pointer;
    }
    .mt-1 { margin-top: 0.35rem; }
    .text-danger { color: #dc2626; }
    .text-success { color: #16a34a; }
    .compact-footer {
      text-align: center;
      margin-top: 0.85rem;
      padding-top: 0.6rem;
      border-top: 1px solid var(--border-color);
      font-size: 0.825rem;
    }
  `]
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  selectedRole: 'ETUDIANT' | 'ENTREPRISE' = 'ETUDIANT';
  loading = false;
  errorMessage: string | null = null;
  selectedCvFileName: string | null = null;

  etudiantForm: FormGroup = this.fb.group({
    nom: ['', Validators.required],
    prenom: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    motDePasse: ['', [Validators.required, Validators.minLength(6)]],
    matricule: ['', Validators.required],
    filiere: ['Licence 3 Informatique', Validators.required],
    niveau: ['L3', Validators.required],
    telephone: [''],
    cv: ['']
  });

  entrepriseForm: FormGroup = this.fb.group({
    nom: ['', Validators.required],
    prenom: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    motDePasse: ['', [Validators.required, Validators.minLength(6)]],
    raisonSociale: ['', Validators.required],
    secteurActivite: ['', Validators.required],
    adresse: [''],
    siteWeb: ['']
  });

  selectRole(role: 'ETUDIANT' | 'ENTREPRISE') {
    this.selectedRole = role;
    this.errorMessage = null;
  }

  onCvFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedCvFileName = file.name;
      const reader = new FileReader();
      reader.onload = () => {
        const cvDataUrl = reader.result as string;
        this.etudiantForm.patchValue({ cv: cvDataUrl });
      };
      reader.readAsDataURL(file);
    }
  }

  removeCvFile() {
    this.selectedCvFileName = null;
    this.etudiantForm.patchValue({ cv: '' });
  }

  onSubmitEtudiant() {
    if (this.etudiantForm.invalid) return;
    this.loading = true;
    this.errorMessage = null;

    this.authService.registerEtudiant(this.etudiantForm.value).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/login'], { queryParams: { registered: 'true' } });
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.message || 'Erreur lors de l\'inscription de l\'étudiant.';
      }
    });
  }

  onSubmitEntreprise() {
    if (this.entrepriseForm.invalid) return;
    this.loading = true;
    this.errorMessage = null;

    this.authService.registerEntreprise(this.entrepriseForm.value).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/login'], { queryParams: { registered: 'true' } });
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.message || 'Erreur lors de l\'inscription de l\'entreprise.';
      }
    });
  }
}
