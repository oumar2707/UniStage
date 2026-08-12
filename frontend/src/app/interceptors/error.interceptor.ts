import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Une erreur inattendue est survenue.';

      if (error.error instanceof ErrorEvent) {
        // Erreur côté client
        errorMessage = `Erreur client : ${error.error.message}`;
      } else {
        // Erreurs HTTP
        switch (error.status) {
          case 0:
            errorMessage = 'Impossible de contacter le serveur backend UniStage (http://localhost:8080). Assurez-vous que le serveur Spring Boot est bien démarré.';
            break;

          case 401:
            errorMessage = 'Email ou mot de passe incorrect. Veuillez vérifier vos identifiants.';
            break;

          case 403:
            errorMessage = 'Accès non autorisé. Votre compte n\'a pas les permissions requises.';
            break;

          case 404:
            errorMessage = 'La ressource demandée n\'existe pas (404).';
            break;

          case 400:
            errorMessage = error.error?.message || 'Informations saisies invalides (400).';
            break;

          case 500:
            errorMessage = 'Erreur interne du serveur (500). Veuillez réessayer plus tard.';
            break;

          default:
            errorMessage = error.error?.message || `Erreur de communication (Code HTTP ${error.status}).`;
            break;
        }
      }

      console.error(`[HttpInterceptor - Error ${error.status}]:`, errorMessage, error);
      return throwError(() => new Error(errorMessage));
    })
  );
};
