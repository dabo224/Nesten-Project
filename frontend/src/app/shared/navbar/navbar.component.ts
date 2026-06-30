import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="header">
      <a routerLink="/creneaux" class="logo">MedCare.</a>

      <!-- Hamburger (visible uniquement sur mobile) -->
      <button class="menu-toggle" [class.open]="menuOpen()" (click)="menuOpen.set(!menuOpen())"
              aria-label="Menu" aria-expanded="{{ menuOpen() }}">
        <span></span><span></span><span></span>
      </button>

      <!-- Overlay de fermeture -->
      @if (menuOpen()) {
        <div class="menu-overlay" (click)="close()"></div>
      }

      <nav class="navbar" [class.open]="menuOpen()">
        @if (auth.isAdmin()) {
          <a routerLink="/admin"             routerLinkActive="active" (click)="close()">Dashboard</a>
          <a routerLink="/admin/centres"     routerLinkActive="active" (click)="close()">Centres</a>
          <a routerLink="/admin/specialites" routerLinkActive="active" (click)="close()">Spécialités</a>
          <a routerLink="/admin/medecins"    routerLinkActive="active" (click)="close()">Médecins</a>
          <a routerLink="/admin/absences"    routerLinkActive="active" (click)="close()">Absences</a>
          <a routerLink="/admin/creneaux"    routerLinkActive="active" (click)="close()">Créneaux</a>
          <a routerLink="/admin/rendezvous"  routerLinkActive="active" (click)="close()">Rendez-vous</a>
        } @else {
          <a routerLink="/creneaux"        routerLinkActive="active" (click)="close()">Créneaux</a>
          <a routerLink="/mes-rendezvous"  routerLinkActive="active" (click)="close()">Mes RDV</a>
        }

        <span class="user-info">{{ auth.currentUser()?.nom }}</span>
        <button class="btn-logout" (click)="auth.logout()">Déconnexion</button>
      </nav>
    </header>
  `,
  styles: [`
    .user-info {
      font-size: 1.5rem;
      color: var(--green);
      margin-left: 2rem;
      font-weight: 500;
    }

    @media (max-width: 768px) {
      .user-info {
        margin-left: 0;
        padding: 1.2rem 0;
        border-bottom: .1rem solid #eee;
        width: 100%;
        display: block;
      }
    }
  `],
})
export class NavbarComponent {
  auth     = inject(AuthService);
  menuOpen = signal(false);

  close() { this.menuOpen.set(false); }
}
