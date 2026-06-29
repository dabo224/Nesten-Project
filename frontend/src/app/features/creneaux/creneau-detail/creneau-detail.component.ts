import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { NavbarComponent }     from '../../../shared/navbar/navbar.component';
import { CreneauxService }     from '../../../core/services/creneaux.service';
import { RendezVousService }   from '../../../core/services/rendezvous.service';
import { Creneau }             from '../../../core/models/creneau.model';

@Component({
  selector: 'app-creneau-detail',
  imports: [NavbarComponent, FormsModule, DatePipe],
  template: `
    <app-navbar />
    <div class="page-wrapper">
      <section>

        @if (loading()) { <div class="spinner"></div> }

        @if (!loading() && creneau()) {
          <div style="max-width:60rem;margin:0 auto">

            <!-- Carte du créneau -->
            <div class="card" style="margin-bottom:3rem">
              <div style="display:flex;align-items:center;gap:2rem;flex-wrap:wrap">
                <img src="doc-1.jpg" alt="Médecin"
                     style="width:9rem;height:9rem;border-radius:50%;object-fit:cover;border:var(--border)" />
                <div>
                  <h3 style="font-size:2.4rem;color:var(--black)">
                    {{ creneau()!.medecin?.nom }}
                  </h3>
                  <p style="font-size:1.5rem;color:var(--green);margin:.4rem 0">
                    {{ creneau()!.medecin?.specialite?.nom }}
                  </p>
                  <p style="font-size:1.4rem;color:var(--light)">{{ creneau()!.medecin?.centre?.nom }}</p>
                  <p style="font-size:1.4rem;color:var(--light);margin-top:.5rem">
                    {{ creneau()!.dateHeure | date:'EEEE dd MMMM yyyy à HH:mm':'':'fr' }}
                    — {{ creneau()!.dureeMinutes }} min
                  </p>
                </div>
              </div>

              @if (!creneau()!.estDisponible) {
                <div class="alert alert-error" style="margin-top:1.5rem">
                  Ce créneau n'est plus disponible.
                </div>
              }
            </div>

            <!-- Formulaire de réservation -->
            @if (creneau()!.estDisponible) {
              <div class="card">
                <h3 style="font-size:2rem;margin-bottom:2rem;color:var(--black)">Confirmer la réservation</h3>

                @if (successMsg()) {
                  <div class="alert alert-success">{{ successMsg() }}</div>
                }
                @if (errorMsg()) {
                  <div class="alert alert-error">{{ errorMsg() }}</div>
                }

                <form (ngSubmit)="book()">
                  <div class="form-group">
                    <label for="detail-patientNom">Nom du patient</label>
                    <input id="detail-patientNom" type="text" [(ngModel)]="form.patientNom" name="patientNom"
                           placeholder="Ex : Fatou Diallo" required />
                  </div>
                  <div class="form-group">
                    <label for="detail-patientContact">Contact (email ou téléphone)</label>
                    <input id="detail-patientContact" type="text" [(ngModel)]="form.patientContact" name="patientContact"
                           placeholder="Ex : 77 000 00 00" required />
                  </div>
                  <div style="display:flex;gap:1.5rem;flex-wrap:wrap">
                    <button type="submit" class="btn btn-primary" [disabled]="booking()">
                      {{ booking() ? '...' : 'Confirmer le rendez-vous' }}
                    </button>
                    <button type="button" class="btn btn-outline" (click)="router.navigate(['/creneaux'])">
                      Annuler
                    </button>
                  </div>
                </form>
              </div>
            }

          </div>
        }

      </section>
    </div>
  `,
})
export class CreneauDetailComponent implements OnInit {
  private readonly route            = inject(ActivatedRoute);
  private readonly creneauxService  = inject(CreneauxService);
  private readonly rdvService       = inject(RendezVousService);
  readonly router          = inject(Router);

  creneau    = signal<Creneau | null>(null);
  loading    = signal(true);
  booking    = signal(false);
  successMsg = signal('');
  errorMsg   = signal('');

  form = { patientNom: '', patientContact: '' };

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.creneauxService.getById(id).subscribe({
      next:  (r) => { this.creneau.set(r.data); this.loading.set(false); },
      error: ()  => this.loading.set(false),
    });
  }

  book() {
    this.booking.set(true);
    this.errorMsg.set('');
    this.rdvService.book({
      creneauId:      this.creneau()!.id,
      patientNom:     this.form.patientNom,
      patientContact: this.form.patientContact,
    }).subscribe({
      next: () => {
        this.successMsg.set('Rendez-vous confirmé ! Vous allez être redirigé…');
        this.booking.set(false);
        setTimeout(() => this.router.navigate(['/mes-rendezvous']), 2000);
      },
      error: (err) => {
        this.errorMsg.set(err.error?.message ?? 'Erreur lors de la réservation.');
        this.booking.set(false);
      },
    });
  }
}
