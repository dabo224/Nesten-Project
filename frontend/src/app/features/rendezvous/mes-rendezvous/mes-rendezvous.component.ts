import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NavbarComponent }   from '../../../shared/navbar/navbar.component';
import { RendezVousService } from '../../../core/services/rendezvous.service';
import { RendezVous }        from '../../../core/models/rendezvous.model';

@Component({
  selector: 'app-mes-rendezvous',
  imports: [NavbarComponent, DatePipe],
  template: `
    <app-navbar />
    <div class="page-wrapper">
      <section>
        <div class="page-header">
          <h2 class="heading" style="text-align:left;padding-bottom:0">
            Mes <span>rendez-vous</span>
          </h2>
        </div>

        @if (successMsg()) {
          <div class="alert alert-success">{{ successMsg() }}</div>
        }
        @if (errorMsg()) {
          <div class="alert alert-error">{{ errorMsg() }}</div>
        }

        @if (loading()) { <div class="spinner"></div> }

        @if (!loading()) {
          @if (rendezvous().length === 0) {
            <div style="text-align:center;padding:5rem;color:var(--light)">
              <p style="font-size:1.7rem">Vous n'avez aucun rendez-vous pour le moment.</p>
            </div>
          } @else {
            <div class="box-container">
              @for (rdv of rendezvous(); track rdv.id) {
                <div class="card">
                  <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:1rem">
                    <div>
                      <h4 style="font-size:1.8rem;color:var(--black);margin-bottom:.5rem">
                        {{ rdv.creneau?.medecin?.nom }}
                      </h4>
                      <p style="font-size:1.4rem;color:var(--light)">{{ rdv.creneau?.medecin?.specialite?.nom }}</p>
                      <p style="font-size:1.4rem;color:var(--light)">{{ rdv.creneau?.medecin?.centre?.nom }}</p>
                      <p style="font-size:1.4rem;color:var(--black);margin-top:.6rem">
                        {{ rdv.creneau?.dateHeure | date:'dd/MM/yyyy à HH:mm' }}
                        — {{ rdv.creneau?.dureeMinutes }} min
                      </p>
                      <p style="font-size:1.4rem;color:var(--light);margin-top:.3rem">
                        {{ rdv.patientNom }} · {{ rdv.patientContact }}
                      </p>
                    </div>
                    <div style="display:flex;flex-direction:column;align-items:flex-end;gap:1rem">
                      <span class="badge" [class.badge-success]="rdv.statut === 'CONFIRME'"
                                          [class.badge-danger]="rdv.statut === 'ANNULE'">
                        {{ rdv.statut }}
                      </span>
                      @if (rdv.statut === 'CONFIRME') {
                        <button class="btn btn-danger btn-sm" (click)="cancel(rdv)"
                                [disabled]="cancellingId() === rdv.id">
                          {{ cancellingId() === rdv.id ? '...' : 'Annuler' }}
                        </button>
                      }
                    </div>
                  </div>
                </div>
              }
            </div>
          }
        }
      </section>
    </div>
  `,
})
export class MesRendezVousComponent implements OnInit {
  private readonly rdvService = inject(RendezVousService);

  rendezvous   = signal<RendezVous[]>([]);
  loading      = signal(true);
  cancellingId = signal<number | null>(null);
  successMsg   = signal('');
  errorMsg     = signal('');

  ngOnInit() { this.load(); }

  private load() {
    this.loading.set(true);
    this.rdvService.getMine().subscribe({
      next:  (r) => { this.rendezvous.set(r.data); this.loading.set(false); },
      error: ()  => this.loading.set(false),
    });
  }

  cancel(rdv: RendezVous) {
    this.cancellingId.set(rdv.id);
    this.successMsg.set('');
    this.errorMsg.set('');
    this.rdvService.cancel(rdv.id).subscribe({
      next: () => {
        this.successMsg.set('Rendez-vous annulé avec succès.');
        this.cancellingId.set(null);
        this.load();
      },
      error: (err) => {
        this.errorMsg.set(err.error?.message ?? 'Erreur lors de l\'annulation.');
        this.cancellingId.set(null);
      },
    });
  }
}
