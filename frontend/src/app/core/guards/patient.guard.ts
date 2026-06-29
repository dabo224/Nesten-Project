import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/** Redirige vers /admin si l'utilisateur est ADMIN. Réservé aux patients. */
export const patientGuard: CanActivateFn = () => {
  const auth   = inject(AuthService);
  const router = inject(Router);

  if (!auth.isAdmin()) return true;

  return router.createUrlTree(['/admin']);
};
