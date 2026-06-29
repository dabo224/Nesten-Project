import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

/**
 * Intercepteur HTTP — ajoute automatiquement le token JWT à chaque requête.
 * Angular l'injecte dans la chaîne de traitement sans que les services
 * aient à gérer le header manuellement.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthService).getToken();

  // Vérifie que le token a bien le format JWT (3 segments séparés par des points)
  const isValidJwt = token && token.split('.').length === 3;

  if (isValidJwt) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }

  return next(req);
};
