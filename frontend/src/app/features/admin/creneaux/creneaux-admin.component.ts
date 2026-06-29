import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { NavbarComponent }   from '../../../shared/navbar/navbar.component';
import { CreneauxService }   from '../../../core/services/creneaux.service';
import { MedecinsService }   from '../../../core/services/medecins.service';
import { Creneau }  from '../../../core/models/creneau.model';
import { Medecin }  from '../../../core/models/medecin.model';

@Component({
  selector: 'app-creneaux-admin',
  imports: [NavbarComponent, FormsModule, DatePipe],
  template: `
    <app-navbar />
    <div class="page-wrapper">
      <section>
        <div class="page-header">
          <h2 class="heading" style="text-align:left;padding-bottom:0">
            Gestion des <span>créneaux</span>
          </h2>
          <button class="btn btn-primary" (click)="openForm()">+ Nouveau créneau</button>
        </div>

        @if (successMsg()) { <div class="alert alert-success">{{ successMsg() }}</div> }
        @if (errorMsg())   { <div class="alert alert-error">{{ errorMsg() }}</div> }

        @if (showForm()) {
          <div class="card" style="max-width:55rem;margin-bottom:2.5rem">
            <h3 style="font-size:1.9rem;margin-bottom:1.5rem;color:var(--black)">Nouveau créneau</h3>
            <form (ngSubmit)="save()">
              <div class="form-group">
                <label for="creneau-medecinId">Médecin</label>
                <select id="creneau-medecinId" [(ngModel)]="form.medecinId" name="medecinId" required>
                  <option [ngValue]="0">— Choisir —</option>
                  @for (m of medecins(); track m.id) {
                    <option [ngValue]="m.id">{{ m.nom }} ({{ m.specialite?.nom }})</option>
                  }
                </select>
              </div>
              <div class="form-group">
                <label for="creneau-dateHeure">Date et heure</label>
                <input id="creneau-dateHeure" type="datetime-local" [(ngModel)]="form.dateHeure" name="dateHeure" required />
              </div>
              <div class="form-group">
                <label for="creneau-dureeMinutes">Durée (minutes)</label>
                <input id="creneau-dureeMinutes" type="number" [(ngModel)]="form.dureeMinutes" name="dureeMinutes"
                       min="10" max="120" required />
              </div>
              <div style="display:flex;gap:1rem">
                <button type="submit" class="btn btn-primary" [disabled]="saving()">
                  {{ saving() ? '...' : 'Créer' }}
                </button>
                <button type="button" class="btn btn-outline" (click)="closeForm()">Annuler</button>
              </div>
            </form>
          </div>
        }

        @if (loading()) { <div class="spinner"></div> }
        @if (!loading()) {
          <div class="table-wrapper">
            <table>
              <thead>
                <tr><th>#</th><th>Médecin</th><th>Date & heure</th><th>Durée</th><th>Statut</th><th>Actions</th></tr>
              </thead>
              <tbody>
                @for (c of creneaux(); track c.id) {
                  <tr>
                    <td>{{ c.id }}</td>
                    <td>{{ c.medecin?.nom }}</td>
                    <td>{{ c.dateHeure | date:'dd/MM/yyyy HH:mm' }}</td>
                    <td>{{ c.dureeMinutes }} min</td>
                    <td>
                      @if (c.estDisponible) {
                        <span class="badge badge-success">Disponible</span>
                      } @else {
                        <span class="badge badge-danger">Réservé</span>
                      }
                    </td>
                    <td>
                      <button class="btn btn-danger btn-sm" (click)="remove(c.id)"
                              [disabled]="!c.estDisponible">Supprimer</button>
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
export class CreneauxAdminComponent implements OnInit {
  private readonly service         = inject(CreneauxService);
  private readonly medecinsService = inject(MedecinsService);

  creneaux   = signal<Creneau[]>([]);
  medecins   = signal<Medecin[]>([]);
  loading    = signal(true);
  showForm   = signal(false);
  saving     = signal(false);
  successMsg = signal('');
  errorMsg   = signal('');

  form = { medecinId: 0, dateHeure: '', dureeMinutes: 30 };

  ngOnInit() {
    this.medecinsService.getAll().subscribe((r) => this.medecins.set(r.data));
    this.load();
  }

  private load() {
    this.loading.set(true);
    this.service.getAll().subscribe({ next: (r) => { this.creneaux.set(r.data); this.loading.set(false); } });
  }

  openForm() { this.showForm.set(true); this.successMsg.set(''); this.errorMsg.set(''); }
  closeForm() { this.showForm.set(false); }

  save() {
    this.saving.set(true);
    this.service.create(this.form).subscribe({
      next: () => { this.successMsg.set('Créneau créé.'); this.saving.set(false); this.closeForm(); this.load(); },
      error: (err) => { this.errorMsg.set(err.error?.message ?? 'Erreur.'); this.saving.set(false); },
    });
  }

  remove(id: number) {
    if (!confirm('Supprimer ce créneau ?')) return;
    this.service.remove(id).subscribe({
      next: () => { this.successMsg.set('Créneau supprimé.'); this.load(); },
      error: (err) => this.errorMsg.set(err.error?.message ?? 'Impossible de supprimer un créneau réservé.'),
    });
  }
}
