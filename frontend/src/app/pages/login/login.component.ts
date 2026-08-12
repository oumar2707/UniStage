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
          <div class="logo-circle"><i class="fa-solid fa-lock"></i></div>
          <h2>Connexion UniStage</h2>
          <p class="auth-sub">Université de Labé &bull; Espace Sécurisé</p>
        </div>

        <!-- Fast Demo Account Autofill Selector -->
        <div class="demo-accounts-box">
          <span class="demo-title"><i class="fa-solid fa-bolt"></i> Comptes de Démonstration :</span>
          <div class="demo-pills">
            <button type="button" (click)="fillDemo('dialoalphoumar021@gmail.com', 'Aoddiallo')" class="demo-pill admin">
              👑 Admin
            </button>
            <button type="button" (click)="fillDemo('Saliou@gmail.com', 'Saliou123')" class="demo-pill student">
              🎓 Étudiant
            </button>
            <button type="button" (click)="fillDemo('contact@koumaacademy.com', 'Kouma2026!')" class="demo-pill company">
              🏢 Entreprise
            </button>
          </div>
        </div>

        @if (errorMessage) {
          <div class="alert alert-danger mt-3">
            <i class="fa-solid fa-circle-exclamation"></i> {{ errorMessage }}
          </div>
        }

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="mt-3">
          <div class="form-group">
            <label class="form-label" for="email">Adresse Email</label>
            <div class="input-with-icon">
              <i class="fa-regular fa-envelope input-icon"></i>
              <input
                id="email"
                type="email"
                formControlName="email"
                class="form-control"
                placeholder="ex: Saliou@gmail.com"
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
            <label class="form-label" for="motDePasse">Mot de Passe</label>
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
              <i class="fa-solid fa-spinner fa-spin"></i> Authentification en cours...
            } @else {
              <i class="fa-solid fa-right-to-bracket"></i> Se connecter
            }
          </button>
        </form>

        <div class="auth-footer">
          <p>Vous n'avez pas encore de compte ? <a routerLink="/register">Inscrivez-vous ici</a></p>
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
      max-width: 460px;
      padding: 2.5rem;
      box-shadow: var(--shadow-lg);
      border-radius: var(--radius-md);
      border: 1px solid #cbd5e1;
    }
    .auth-header {
      text-align: center;
      margin-bottom: 1.5rem;
    }
    .logo-circle {
      width: 54px;
      height: 54px;
      background: linear-gradient(135deg, #0b132b, #2563eb);
      color: #ffffff;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.4rem;
      margin: 0 auto 0.85rem;
      box-shadow: 0 4px 14px rgba(37, 99, 235, 0.3);
    }
    .auth-sub {
      font-size: 0.85rem;
      color: var(--text-muted);
      margin-top: 0.2rem;
    }

    /* Demo Accounts Selector */
    .demo-accounts-box {
      background: #f8fafc;
      border: 1px dashed #cbd5e1;
      padding: 0.85rem;
      border-radius: var(--radius-sm);
      text-align: center;
    }
    .demo-title {
      font-size: 0.775rem;
      font-weight: 700;
      color: var(--text-muted);
      display: block;
      margin-bottom: 0.5rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .demo-pills {
      display: flex;
      justify-content: center;
      gap: 0.4rem;
    }
    .demo-pill {
      font-size: 0.75rem;
      font-weight: 700;
      padding: 0.3rem 0.65rem;
      border-radius: 20px;
      border: none;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .demo-pill.admin { background: #fee2e2; color: #991b1b; }
    .demo-pill.admin:hover { background: #fca5a5; }
    .demo-pill.student { background: #dbeafe; color: #1e40af; }
    .demo-pill.student:hover { background: #bfdbfe; }
    .demo-pill.company { background: #fef3c7; color: #92400e; }
    .demo-pill.company:hover { background: #fde68a; }

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

  fillDemo(email: string, pass: string) {
    this.loginForm.patchValue({
      email: email,
      motDePasse: pass
    });
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
