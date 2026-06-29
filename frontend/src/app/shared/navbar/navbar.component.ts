import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="header">
      <a routerLink="/creneaux" class="logo">
        MedCare.
      </a>

      <nav class="navbar">
        @if (auth.isAdmin()) {
          <a routerLink="/admin"            routerLinkActive="active">Dashboard</a>
          <a routerLink="/admin/centres"    routerLinkActive="active">Centres</a>
          <a routerLink="/admin/specialites" routerLinkActive="active">Spécialités</a>
          <a routerLink="/admin/medecins"   routerLinkActive="active">Médecins</a>
          <a routerLink="/admin/absences"   routerLinkActive="active">Absences</a>
          <a routerLink="/admin/creneaux"   routerLinkActive="active">Créneaux</a>
          <a routerLink="/admin/rendezvous" routerLinkActive="active">Rendez-vous</a>
        } @else {
          <a routerLink="/creneaux"         routerLinkActive="active">Créneaux</a>
          <a routerLink="/mes-rendezvous"   routerLinkActive="active">Mes RDV</a>
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
    .user-info i { margin-right: .4rem; }
  `],
})
export class NavbarComponent {
  auth = inject(AuthService);
}
