import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NavbarComponent }   from '../../../shared/navbar/navbar.component';
import { RendezVousService } from '../../../core/services/rendezvous.service';
import { RendezVous }        from '../../../core/models/rendezvous.model';

@Component({
  selector: 'app-rendezvous-admin',
  imports: [NavbarComponent, DatePipe],
  template: `
    <app-navbar />
    <div class="page-wrapper">
      <section>
        <div class="page-header">
          <h2 class="heading" style="text-align:left;padding-bottom:0">
            Tous les <span>rendez-vous</span>
          </h2>
        </div>

        @if (successMsg()) { <div class="alert alert-success">{{ successMsg() }}</div> }
        @if (errorMsg())   { <div class="alert alert-error">{{ errorMsg() }}</div> }

        @if (loading()) { <div class="spinner"></div> }
        @if (!loading()) {
          <div class="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Patient</th>
                  <th>Contact</th>
                  <th>Médecin</th>
                  <th>Date RDV</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (rdv of rendezvous(); track rdv.id) {
                  <tr>
                    <td>{{ rdv.id }}</td>
                    <td>{{ rdv.patientNom }}</td>
                    <td>{{ rdv.patientContact }}</td>
                    <td>{{ rdv.creneau?.medecin?.nom }}</td>
                    <td>{{ rdv.creneau?.dateHeure | date:'dd/MM/yyyy HH:mm' }}</td>
                    <td>
                      <span class="badge" [class.badge-success]="rdv.statut === 'CONFIRME'"
                                          [class.badge-danger]="rdv.statut === 'ANNULE'">
                        {{ rdv.statut }}
                      </span>
                    </td>
                    <td>
                      @if (rdv.statut === 'CONFIRME') {
                        <button class="btn btn-danger btn-sm" (click)="cancel(rdv)"
                                [disabled]="cancellingId() === rdv.id">
                          {{ cancellingId() === rdv.id ? '...' : 'Annuler' }}
                        </button>
                      }
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </section>
    </div>
  `,
})
export class RendezVousAdminComponent implements OnInit {
  private readonly service = inject(RendezVousService);

  rendezvous   = signal<RendezVous[]>([]);
  loading      = signal(true);
  cancellingId = signal<number | null>(null);
  successMsg   = signal('');
  errorMsg     = signal('');

  ngOnInit() { this.load(); }

  private load() {
    this.loading.set(true);
    this.service.getAll().subscribe({ next: (r) => { this.rendezvous.set(r.data); this.loading.set(false); } });
  }

  cancel(rdv: RendezVous) {
    this.cancellingId.set(rdv.id);
    this.service.cancel(rdv.id).subscribe({
      next: () => { this.successMsg.set('Rendez-vous annulé.'); this.cancellingId.set(null); this.load(); },
      error: (err) => { this.errorMsg.set(err.error?.message ?? 'Erreur.'); this.cancellingId.set(null); },
    });
  }
}
