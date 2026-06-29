import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavbarComponent }      from '../../../shared/navbar/navbar.component';
import { MedecinsService }      from '../../../core/services/medecins.service';
import { SpecialitesService }   from '../../../core/services/specialites.service';
import { CentresService }       from '../../../core/services/centres.service';
import { Medecin }    from '../../../core/models/medecin.model';
import { Specialite } from '../../../core/models/specialite.model';
import { Centre }     from '../../../core/models/centre.model';

@Component({
  selector: 'app-medecins-admin',
  imports: [NavbarComponent, FormsModule],
  template: `
    <app-navbar />
    <div class="page-wrapper">
      <section>
        <div class="page-header">
          <h2 class="heading" style="text-align:left;padding-bottom:0">
            Gestion des <span>médecins</span>
          </h2>
          <button class="btn btn-primary" (click)="openForm()">
            <i class="fas fa-plus"></i> Nouveau médecin
          </button>
        </div>

        @if (successMsg()) { <div class="alert alert-success">{{ successMsg() }}</div> }
        @if (errorMsg())   { <div class="alert alert-error">{{ errorMsg() }}</div> }

        @if (showForm()) {
          <div class="card" style="max-width:55rem;margin-bottom:2.5rem">
            <h3 style="font-size:1.9rem;margin-bottom:1.5rem;color:var(--black)">
              {{ editing() ? 'Modifier le médecin' : 'Nouveau médecin' }}
            </h3>
            <form (ngSubmit)="save()">
              <div class="form-group">
                <label for="medecin-nom">Nom</label>
                <input id="medecin-nom" type="text" [(ngModel)]="form.nom" name="nom"
                       placeholder="Ex : Dr. Fatou Diallo" required />
              </div>
              <div class="form-group">
                <label for="medecin-specialiteId">Spécialité</label>
                <select id="medecin-specialiteId" [(ngModel)]="form.specialiteId" name="specialiteId" required>
                  <option [ngValue]="0">— Choisir —</option>
                  @for (s of specialites(); track s.id) {
                    <option [ngValue]="s.id">{{ s.nom }}</option>
                  }
                </select>
              </div>
              <div class="form-group">
                <label for="medecin-centreId">Centre médical</label>
                <select id="medecin-centreId" [(ngModel)]="form.centreId" name="centreId" required>
                  <option [ngValue]="0">— Choisir —</option>
                  @for (c of centres(); track c.id) {
                    <option [ngValue]="c.id">{{ c.nom }}</option>
                  }
                </select>
              </div>
              <div style="display:flex;gap:1rem">
                <button type="submit" class="btn btn-primary" [disabled]="saving()">
                  @if (saving()) { <i class="fas fa-spinner fa-spin"></i> }
                  {{ editing() ? 'Enregistrer' : 'Créer' }}
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
                <tr><th>#</th><th>Nom</th><th>Spécialité</th><th>Centre</th><th>Actions</th></tr>
              </thead>
              <tbody>
                @for (m of medecins(); track m.id) {
                  <tr>
                    <td>{{ m.id }}</td>
                    <td>{{ m.nom }}</td>
                    <td><span class="badge badge-info">{{ m.specialite?.nom }}</span></td>
                    <td>{{ m.centre?.nom }}</td>
                    <td>
                      <button class="btn btn-outline btn-sm" (click)="openForm(m)" style="margin-right:.5rem">
                        <i class="fas fa-edit"></i>
                      </button>
                      <button class="btn btn-danger btn-sm" (click)="remove(m.id)">
                        <i class="fas fa-trash"></i>
                      </button>
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
export class MedecinsAdminComponent implements OnInit {
  private service          = inject(MedecinsService);
  private specialitesService = inject(SpecialitesService);
  private centresService   = inject(CentresService);

  medecins    = signal<Medecin[]>([]);
  specialites = signal<Specialite[]>([]);
  centres     = signal<Centre[]>([]);
  loading     = signal(true);
  showForm    = signal(false);
  saving      = signal(false);
  editing     = signal<Medecin | null>(null);
  successMsg  = signal('');
  errorMsg    = signal('');
  form        = { nom: '', specialiteId: 0, centreId: 0 };

  ngOnInit() {
    this.specialitesService.getAll().subscribe((r) => this.specialites.set(r.data));
    this.centresService.getAll().subscribe((r) => this.centres.set(r.data));
    this.load();
  }

  private load() {
    this.loading.set(true);
    this.service.getAll().subscribe({ next: (r) => { this.medecins.set(r.data); this.loading.set(false); } });
  }

  openForm(m?: Medecin) {
    this.editing.set(m ?? null);
    this.form = m ? { nom: m.nom, specialiteId: m.specialiteId, centreId: m.centreId }
                  : { nom: '', specialiteId: 0, centreId: 0 };
    this.showForm.set(true);
    this.successMsg.set(''); this.errorMsg.set('');
  }
  closeForm() { this.showForm.set(false); this.editing.set(null); }

  save() {
    this.saving.set(true);
    const req = this.editing()
      ? this.service.update(this.editing()!.id, this.form)
      : this.service.create(this.form);
    req.subscribe({
      next: () => { this.successMsg.set('Enregistré.'); this.saving.set(false); this.closeForm(); this.load(); },
      error: (err) => { this.errorMsg.set(err.error?.message ?? 'Erreur.'); this.saving.set(false); },
    });
  }

  remove(id: number) {
    if (!confirm('Supprimer ce médecin ? Ses créneaux et absences seront supprimés.')) return;
    this.service.remove(id).subscribe({
      next: () => { this.successMsg.set('Médecin supprimé.'); this.load(); },
      error: (err) => this.errorMsg.set(err.error?.message ?? 'Erreur.'),
    });
  }
}
