import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { User, ApiAuthResponse } from '../models/user.model';
import { environment } from '../../../environments/environment';

/**
 * AuthService — gère la session utilisateur (token JWT + utilisateur courant).
 *
 * Le signal `currentUser` est la source de vérité pour l'UI :
 * les composants s'y abonnent pour afficher ou cacher des éléments.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API = `${environment.apiUrl}/auth`;
  private readonly TOKEN_KEY = 'nesten_token';

  // Signal Angular 22 — réactif, utilisable directement dans les templates
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  currentUser = signal<User | null>(null);

  constructor() {
    const token = this.getToken();
    if (token) {
      // Restauration synchrone depuis le payload JWT : les guards peuvent lire
      // le rôle immédiatement sans attendre la réponse HTTP.
      const partial = this._decodeJwt(token);
      if (partial) this.currentUser.set(partial as User);

      // Vérification côté serveur + récupération du profil complet (nom, etc.)
      this.http
        .get<{ success: boolean; data: User }>(`${this.API}/me`)
        .subscribe({
          next:  (res) => this.currentUser.set(res.data),
          error: (err) => {
            if (err.status === 401 || err.status === 403) {
              localStorage.removeItem(this.TOKEN_KEY);
              this.currentUser.set(null);
              this.router.navigate(['/auth']);
            }
          },
        });
    }
  }

  /** Décode le payload JWT (sans vérification de signature — côté serveur seulement). */
  private _decodeJwt(token: string): Pick<User, 'id' | 'email' | 'role'> | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (!payload?.role) return null;
      return { id: payload.id, email: payload.email ?? '', role: payload.role, nom: '' } as User;
    } catch {
      return null;
    }
  }

  register(data: { nom: string; email: string; password: string; role?: string }) {
    return this.http
      .post<ApiAuthResponse>(`${this.API}/register`, data)
      .pipe(tap((res) => this.saveSession(res)));
  }

  login(data: { email: string; password: string }) {
    return this.http
      .post<ApiAuthResponse>(`${this.API}/login`, data)
      .pipe(tap((res) => this.saveSession(res)));
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    this.currentUser.set(null);
    this.router.navigate(['/auth']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    return this.currentUser()?.role === 'ADMIN';
  }

  private saveSession(res: ApiAuthResponse) {
    localStorage.setItem(this.TOKEN_KEY, res.data.token);
    this.currentUser.set(res.data.utilisateur);
  }
}
