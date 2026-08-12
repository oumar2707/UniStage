import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { RoleEnum } from '../models/user.model';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const requiredRole = route.data['role'] as RoleEnum;
  const userRole = authService.getUserRole();

  if (authService.isLoggedIn() && userRole === requiredRole) {
    return true;
  }

  // Redirection selon le rôle réel s'il est connecté
  if (userRole === 'ETUDIANT') {
    router.navigate(['/etudiant']);
  } else if (userRole === 'ENTREPRISE') {
    router.navigate(['/entreprise']);
  } else if (userRole === 'ADMIN') {
    router.navigate(['/admin']);
  } else {
    router.navigate(['/login']);
  }

  return false;
};
