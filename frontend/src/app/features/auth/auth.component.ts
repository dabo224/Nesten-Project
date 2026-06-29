import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-auth',
  imports: [FormsModule],
  template: `
    <div class="auth-wrapper">
      <div class="auth-box">

        <div class="logo-auth">
          <i class="fas fa-heartbeat"></i> MedCare.
        </div>

        <!-- Onglets Login / Inscription -->
        <div class="auth-tabs">
          <button [class.active]="mode() === 'login'"    (click)="mode.set('login')">Connexion</button>
          <button [class.active]="mode() === 'register'" (click)="mode.set('register')">Inscription</button>
        </div>

        <!-- Message d'erreur -->
        @if (errorMsg()) {
          <div class="alert alert-error">{{ errorMsg() }}</div>
        }

        <!-- ── Formulaire Login ── -->
        @if (mode() === 'login') {
          <form (ngSubmit)="login()">
            <div class="form-group">
              <label for="login-email">Email</label>
              <input id="login-email" type="email" [(ngModel)]="loginData.email" name="email"
                     placeholder="votre@email.com" required />
            </div>
            <div class="form-group">
              <label for="login-password">Mot de passe</label>
              <input id="login-password" type="password" [(ngModel)]="loginData.password" name="password"
                     placeholder="••••••••" required />
            </div>
            <button type="submit" class="btn btn-primary" style="width:100%"
                    [disabled]="loading()">
              @if (loading()) { <i class="fas fa-spinner fa-spin"></i> }
              Se connecter
            </button>
          </form>
        }

        <!-- ── Formulaire Inscription ── -->
        @if (mode() === 'register') {
          <form (ngSubmit)="register()">
            <div class="form-group">
              <label for="register-nom">Nom complet</label>
              <input id="register-nom" type="text" [(ngModel)]="registerData.nom" name="nom"
                     placeholder="Ex : Fatou Diallo" required />
            </div>
            <div class="form-group">
              <label for="register-email">Email</label>
              <input id="register-email" type="email" [(ngModel)]="registerData.email" name="email"
                     placeholder="votre@email.com" required />
            </div>
            <div class="form-group">
              <label for="register-password">Mot de passe</label>
              <input id="register-password" type="password" [(ngModel)]="registerData.password" name="password"
                     placeholder="••••••••" required />
            </div>
            <button type="submit" class="btn btn-primary" style="width:100%"
                    [disabled]="loading()">
              @if (loading()) { <i class="fas fa-spinner fa-spin"></i> }
              Créer mon compte
            </button>
          </form>
        }

      </div>
    </div>
  `,
})
export class AuthComponent {
  private authService = inject(AuthService);
  private router      = inject(Router);

  mode    = signal<'login' | 'register'>('login');
  loading = signal(false);
  errorMsg = signal('');

  loginData    = { email: '', password: '' };
  registerData = { nom: '', email: '', password: '' };

  login() {
    this.loading.set(true);
    this.errorMsg.set('');
    this.authService.login(this.loginData).subscribe({
      next: () => this.router.navigate(['/creneaux']),
      error: (err) => {
        this.errorMsg.set(err.error?.message ?? 'Identifiants incorrects.');
        this.loading.set(false);
      },
    });
  }

  register() {
    this.loading.set(true);
    this.errorMsg.set('');
    this.authService.register({ ...this.registerData, role: 'PATIENT' }).subscribe({
      next: () => this.router.navigate(['/creneaux']),
      error: (err) => {
        this.errorMsg.set(err.error?.message ?? 'Erreur lors de l\'inscription.');
        this.loading.set(false);
      },
    });
  }
}
