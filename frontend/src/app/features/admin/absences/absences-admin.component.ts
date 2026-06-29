import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { NavbarComponent }   from '../../../shared/navbar/navbar.component';
import { AbsencesService }   from '../../../core/services/absences.service';
import { MedecinsService }   from '../../../core/services/medecins.service';
import { Absence, MotifAbsence } from '../../../core/models/absence.model';
import { Medecin }           from '../../../core/models/medecin.model';

@Component({
  selector: 'app-absences-admin',
  imports: [NavbarComponent, FormsModule, DatePipe],
  template: `
    <app-navbar />
    <div class="page-wrapper">
      <section>
        <div class="page-header">
          <h2 class="heading" style="text-align:left;padding-bottom:0">
            Gestion des <span>absences</span>
          </h2>
          <button class="btn btn-primary" (click)="openForm()">+ Déclarer une absence</button>
        </div>

        @if (successMsg()) { <div class="alert alert-success">{{ successMsg() }}</div> }
        @if (errorMsg())   { <div class="alert alert-error">{{ errorMsg() }}</div> }

        @if (showForm()) {
          <div class="card" style="max-width:55rem;margin-bottom:2.5rem">
            <h3 style="font-size:1.9rem;margin-bottom:1.5rem;color:var(--black)">Déclarer une absence</h3>
            <form (ngSubmit)="save()">
              <div class="form-group">
                <label for="absence-medecinId">Médecin</label>
                <select id="absence-medecinId" [(ngModel)]="form.medecinId" name="medecinId" required>
                  <option [ngValue]="0">— Choisir —</option>
                  @for (m of medecins(); track m.id) {
                    <option [ngValue]="m.id">{{ m.nom }}</option>
                  }
                </select>
              </div>
              <div class="form-group">
                <label for="absence-dateDebut">Date de début</label>
                <input id="absence-dateDebut" type="datetime-local" [(ngModel)]="form.dateDebut" name="dateDebut" required />
              </div>
              <div class="form-group">
                <label for="absence-dateFin">Date de fin</label>
                <input id="absence-dateFin" type="datetime-local" [(ngModel)]="form.dateFin" name="dateFin" required />
              </div>
              <div class="form-group">
                <label for="absence-motif">Motif</label>
                <select id="absence-motif" [(ngModel)]="form.motif" name="motif" required>
                  <option value="MALADIE">Maladie</option>
                  <option value="CONGES">Congés</option>
                  <option value="AUTRE">Autre</option>
                </select>
              </div>
              <div style="display:flex;gap:1rem">
                <button type="submit" class="btn btn-primary" [disabled]="saving()">
                  {{ saving() ? '...' : 'Enregistrer' }}
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
                <tr><th>#</th><th>Médecin</th><th>Du</th><th>Au</th><th>Motif</th><th>Actions</th></tr>
              </thead>
              <tbody>
                @for (a of absences(); track a.id) {
                  <tr>
                    <td>{{ a.id }}</td>
                    <td>{{ a.medecin?.nom }}</td>
                    <td>{{ a.dateDebut | date:'dd/MM/yyyy HH:mm' }}</td>
                    <td>{{ a.dateFin   | date:'dd/MM/yyyy HH:mm' }}</td>
                    <td><span class="badge badge-info">{{ a.motif }}</span></td>
                    <td>
                      <button class="btn btn-danger btn-sm" (click)="remove(a.id)">Supprimer</button>
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
export class AbsencesAdminComponent implements OnInit {
  private readonly service        = inject(AbsencesService);
  private readonly medecinsService = inject(MedecinsService);

  absences   = signal<Absence[]>([]);
  medecins   = signal<Medecin[]>([]);
  loading    = signal(true);
  showForm   = signal(false);
  saving     = signal(false);
  successMsg = signal('');
  errorMsg   = signal('');

  form: { medecinId: number; dateDebut: string; dateFin: string; motif: MotifAbsence } = {
    medecinId: 0, dateDebut: '', dateFin: '', motif: 'MALADIE',
  };

  ngOnInit() {
    this.medecinsService.getAll().subscribe((r) => this.medecins.set(r.data));
    this.load();
  }

  private load() {
    this.loading.set(true);
    this.service.getAll().subscribe({ next: (r) => { this.absences.set(r.data); this.loading.set(false); } });
  }

  openForm() { this.showForm.set(true); this.successMsg.set(''); this.errorMsg.set(''); }
  closeForm() { this.showForm.set(false); }

  save() {
    this.saving.set(true);
    this.service.create(this.form).subscribe({
      next: () => { this.successMsg.set('Absence déclarée.'); this.saving.set(false); this.closeForm(); this.load(); },
      error: (err) => { this.errorMsg.set(err.error?.message ?? 'Erreur.'); this.saving.set(false); },
    });
  }

  remove(id: number) {
    if (!confirm('Supprimer cette absence ?')) return;
    this.service.remove(id).subscribe({
      next: () => { this.successMsg.set('Absence supprimée.'); this.load(); },
      error: (err) => this.errorMsg.set(err.error?.message ?? 'Erreur.'),
    });
  }
}
