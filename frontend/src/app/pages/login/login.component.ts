import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-page container">
      <div class="auth-card card">
        <div class="auth-header">
          <div class="logo-circle"><i class="fa-solid fa-graduation-cap"></i></div>
          <h2>Connexion</h2>
          <p class="auth-sub">Accédez à votre espace UniStage</p>
        </div>

        <div class="demo-accounts-box">
          <span class="demo-title">Comptes de démonstration</span>
          <div class="demo-pills">
            <button type="button" (click)="fillDemo('etudiant1@demo.local')" class="demo-pill">Étudiant</button>
            <button type="button" (click)="fillDemo('entreprise1@demo.local')" class="demo-pill">Entreprise</button>
            <button type="button" (click)="fillDemo('admin@demo.local')" class="demo-pill">Administrateur</button>
          </div>
        </div>

        @if (errorMessage) {
          <div class="alert alert-danger mt-3">
            <i class="fa-solid fa-circle-exclamation"></i> {{ errorMessage }}
          </div>
        }

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="mt-3">
          <div class="form-group">
            <label class="form-label" for="email">Adresse e-mail</label>
            <div class="input-with-icon">
              <i class="fa-regular fa-envelope input-icon"></i>
              <input
                id="email"
                type="email"
                formControlName="email"
                class="form-control"
                placeholder="nom@exemple.com"
              />
            </div>
            @if (loginForm.get('email')?.touched && loginForm.get('email')?.errors?.['required']) {
              <p class="form-error">L'adresse email est requise.</p>
            }
            @if (loginForm.get('email')?.touched && loginForm.get('email')?.errors?.['email']) {
              <p class="form-error">Veuillez saisir une adresse email valide.</p>
            }
          </div>

          <div class="form-group">
            <label class="form-label" for="motDePasse">Mot de passe</label>
            <div class="input-with-icon">
              <i class="fa-solid fa-key input-icon"></i>
              <input
                id="motDePasse"
                type="password"
                formControlName="motDePasse"
                class="form-control"
                placeholder="Mot de passe"
              />
            </div>
            @if (loginForm.get('motDePasse')?.touched && loginForm.get('motDePasse')?.errors?.['required']) {
              <p class="form-error">Le mot de passe est requis.</p>
            }
          </div>

          <button type="submit" [disabled]="loginForm.invalid || loading" class="btn btn-primary btn-block">
            @if (loading) {
              <i class="fa-solid fa-spinner fa-spin"></i> Connexion...
            } @else {
              <i class="fa-solid fa-right-to-bracket"></i> Se connecter
            }
          </button>
        </form>

        <div class="auth-footer">
          <p>Pas encore de compte ? <a routerLink="/register">Créer un compte</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 3.5rem 1rem;
      min-height: calc(100vh - 180px);
    }
    .auth-card {
      width: 100%;
      max-width: 420px;
      padding: 2.5rem;
      box-shadow: var(--shadow-md);
    }
    .auth-header {
      text-align: center;
      margin-bottom: 1.5rem;
    }
    .logo-circle {
      width: 54px;
      height: 54px;
      background: var(--accent-soft);
      color: var(--accent);
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.4rem;
      margin: 0 auto 0.85rem;
    }
    .auth-sub {
      font-size: 0.85rem;
      color: var(--text-muted);
      margin-top: 0.2rem;
    }

    /* Demo Accounts Selector */
    .demo-accounts-box {
      background: var(--bg-main);
      padding: 0.85rem;
      border-radius: var(--radius-sm);
      text-align: center;
    }
    .demo-title {
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--text-muted);
      display: block;
      margin-bottom: 0.5rem;
    }
    .demo-pills {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 0.4rem;
    }
    .demo-pill {
      font: inherit;
      font-size: 0.8rem;
      font-weight: 500;
      padding: 0.3rem 0.75rem;
      border-radius: 20px;
      border: 1px solid var(--border-color);
      background: #ffffff;
      color: var(--text-main);
      cursor: pointer;
      transition: var(--transition);
    }
    .demo-pill:hover { border-color: var(--accent); color: var(--accent); }

    .input-with-icon {
      position: relative;
      display: flex;
      align-items: center;
    }
    .input-icon {
      position: absolute;
      left: 1.1rem;
      color: var(--text-muted);
    }
    .input-with-icon .form-control {
      padding-left: 2.65rem;
    }
    .btn-block {
      width: 100%;
      margin-top: 1.25rem;
      padding: 0.85rem;
    }
    .auth-footer {
      text-align: center;
      margin-top: 1.5rem;
      padding-top: 1.15rem;
      border-top: 1px solid var(--border-color);
      font-size: 0.9rem;
    }
    .mt-3 { margin-top: 1rem; }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    motDePasse: ['', [Validators.required, Validators.minLength(6)]]
  });

  loading = false;
  errorMessage: string | null = null;

  fillDemo(email: string) {
    this.loginForm.patchValue({ email, motDePasse: '' });
    document.getElementById('motDePasse')?.focus();
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.errorMessage = null;

    this.authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.role === 'ETUDIANT') {
          this.router.navigate(['/etudiant']);
        } else if (res.role === 'ENTREPRISE') {
          this.router.navigate(['/entreprise']);
        } else if (res.role === 'ADMIN') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.message || 'Identifiants ou mot de passe incorrects.';
      }
    });
  }
}
