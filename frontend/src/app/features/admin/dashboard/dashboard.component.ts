import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent }     from '../../../shared/navbar/navbar.component';
import { CentresService }      from '../../../core/services/centres.service';
import { MedecinsService }     from '../../../core/services/medecins.service';
import { CreneauxService }     from '../../../core/services/creneaux.service';
import { RendezVousService }   from '../../../core/services/rendezvous.service';

@Component({
  selector: 'app-dashboard',
  imports: [NavbarComponent, RouterLink],
  template: `
    <app-navbar />
    <div class="page-wrapper">
      <section>
        <h2 class="heading">Tableau de <span>bord</span></h2>

        <div class="box-container" style="grid-template-columns:repeat(auto-fit,minmax(22rem,1fr))">

          <a routerLink="/admin/centres" class="card" style="text-align:center;text-decoration:none">
            <i class="fas fa-hospital" style="font-size:5rem;color:var(--green);display:block;margin-bottom:1rem"></i>
            <h3 style="font-size:3.5rem;color:var(--black);text-shadow:var(--text-shadow)">{{ stats().centres }}</h3>
            <p style="font-size:1.6rem;color:var(--light)">Centres médicaux</p>
          </a>

          <a routerLink="/admin/medecins" class="card" style="text-align:center;text-decoration:none">
            <i class="fas fa-user-md" style="font-size:5rem;color:var(--green);display:block;margin-bottom:1rem"></i>
            <h3 style="font-size:3.5rem;color:var(--black);text-shadow:var(--text-shadow)">{{ stats().medecins }}</h3>
            <p style="font-size:1.6rem;color:var(--light)">Médecins</p>
          </a>

          <a routerLink="/admin/creneaux" class="card" style="text-align:center;text-decoration:none">
            <i class="fas fa-calendar-alt" style="font-size:5rem;color:var(--green);display:block;margin-bottom:1rem"></i>
            <h3 style="font-size:3.5rem;color:var(--black);text-shadow:var(--text-shadow)">{{ stats().creneaux }}</h3>
            <p style="font-size:1.6rem;color:var(--light)">Créneaux</p>
          </a>

          <a routerLink="/admin/rendezvous" class="card" style="text-align:center;text-decoration:none">
            <i class="fas fa-calendar-check" style="font-size:5rem;color:var(--green);display:block;margin-bottom:1rem"></i>
            <h3 style="font-size:3.5rem;color:var(--black);text-shadow:var(--text-shadow)">{{ stats().rendezvous }}</h3>
            <p style="font-size:1.6rem;color:var(--light)">Rendez-vous</p>
          </a>

        </div>
      </section>
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  private centresService    = inject(CentresService);
  private medecinsService   = inject(MedecinsService);
  private creneauxService   = inject(CreneauxService);
  private rdvService        = inject(RendezVousService);

  stats = signal({ centres: 0, medecins: 0, creneaux: 0, rendezvous: 0 });

  ngOnInit() {
    this.centresService.getAll().subscribe((r) =>
      this.stats.update((s) => ({ ...s, centres: r.data.length })));
    this.medecinsService.getAll().subscribe((r) =>
      this.stats.update((s) => ({ ...s, medecins: r.data.length })));
    this.creneauxService.getAll().subscribe((r) =>
      this.stats.update((s) => ({ ...s, creneaux: r.data.length })));
    this.rdvService.getAll().subscribe((r) =>
      this.stats.update((s) => ({ ...s, rendezvous: r.data.length })));
  }
}
