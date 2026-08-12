import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { OffreService } from '../../services/offre.service';

@Component({
  selector: 'app-nouvelle-offre',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="container form-page">
      <div class="form-card card">
        <div class="form-header">
          <h2>Publier une Offre de Stage</h2>
          <p class="sub-text">Remplissez les détails du stage pour les étudiants de l'Université de Labé</p>
        </div>

        @if (errorMessage) {
          <div class="alert alert-danger">
            <i class="fa-solid fa-triangle-exclamation"></i> {{ errorMessage }}
          </div>
        }

        <form [formGroup]="offreForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label class="form-label" for="titre">Titre du Stage *</label>
            <input id="titre" formControlName="titre" class="form-control" placeholder="ex: Développeur Full-Stack Java / Angular" />
            @if (offreForm.get('titre')?.touched && offreForm.get('titre')?.errors?.['required']) {
              <p class="form-error">Le titre de l'offre est obligatoire.</p>
            }
          </div>

          <div class="form-group">
            <label class="form-label" for="description">Description Détaillée du Poste *</label>
            <textarea id="description" formControlName="description" rows="5" class="form-control" placeholder="Missions du stagiaire, projet, environnement de travail..."></textarea>
            @if (offreForm.get('description')?.touched && offreForm.get('description')?.errors?.['required']) {
              <p class="form-error">La description est obligatoire.</p>
            }
          </div>

          <div class="form-group">
            <label class="form-label" for="competences">Compétences Requises (séparées par des virgules) *</label>
            <input id="competences" formControlName="competencesRequises" class="form-control" placeholder="ex: Java, Spring Boot, Angular, Git, REST API" />
            @if (offreForm.get('competencesRequises')?.touched && offreForm.get('competencesRequises')?.errors?.['required']) {
              <p class="form-error">Les compétences requises sont obligatoires.</p>
            }
          </div>

          <div class="grid-2">
            <div class="form-group">
              <label class="form-label" for="dateDebut">Date de Début Prévisionnelle</label>
              <input id="dateDebut" type="date" formControlName="dateDebut" class="form-control" />
            </div>

            <div class="form-group">
              <label class="form-label" for="dateFin">Date de Fin Prévisionnelle</label>
              <input id="dateFin" type="date" formControlName="dateFin" class="form-control" />
            </div>
          </div>

          <div class="grid-2">
            <div class="form-group">
              <label class="form-label" for="lieu">Lieu / Ville *</label>
              <input id="lieu" formControlName="lieu" class="form-control" placeholder="ex: Labé (ou En distanciel)" />
              @if (offreForm.get('lieu')?.touched && offreForm.get('lieu')?.errors?.['required']) {
                <p class="form-error">Le lieu du stage est obligatoire.</p>
              }
            </div>

            <div class="form-group">
              <label class="form-label" for="statut">Statut de l'Offre</label>
              <select id="statut" formControlName="statut" class="form-control">
                <option value="OUVERTE">OUVERTE</option>
                <option value="FERMEE">FERMEE</option>
              </select>
            </div>
          </div>

          <div class="form-actions flex-between">
            <a routerLink="/entreprise" class="btn btn-secondary">Annuler</a>
            <button type="submit" [disabled]="offreForm.invalid || loading" class="btn btn-primary">
              @if (loading) {
                <i class="fa-solid fa-spinner fa-spin"></i> Publication...
              } @else {
                <i class="fa-solid fa-check"></i> Publier l'Offre de Stage
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .form-page { padding: 3rem 1rem; }
    .form-card { max-width: 700px; margin: 0 auto; padding: 2.25rem; }
    .form-header { margin-bottom: 1.75rem; text-align: center; }
    .sub-text { font-size: 0.9rem; color: var(--text-muted); }
    .form-actions { margin-top: 1.5rem; padding-top: 1.25rem; border-top: 1px solid var(--border-color); }
  `]
})
export class NouvelleOffreComponent {
  private fb = inject(FormBuilder);
  private offreService = inject(OffreService);
  private router = inject(Router);

  loading = false;
  errorMessage: string | null = null;

  offreForm: FormGroup = this.fb.group({
    titre: ['', Validators.required],
    description: ['', Validators.required],
    competencesRequises: ['', Validators.required],
    dateDebut: [''],
    dateFin: [''],
    lieu: ['', Validators.required],
    statut: ['OUVERTE', Validators.required]
  });

  onSubmit() {
    if (this.offreForm.invalid) return;
    this.loading = true;
    this.errorMessage = null;

    this.offreService.createOffre(this.offreForm.value).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/entreprise']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.message || 'Erreur lors de la création de l\'offre.';
      }
    });
  }
}
