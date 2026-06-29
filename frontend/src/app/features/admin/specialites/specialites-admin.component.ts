import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavbarComponent }      from '../../../shared/navbar/navbar.component';
import { SpecialitesService }   from '../../../core/services/specialites.service';
import { Specialite }           from '../../../core/models/specialite.model';

@Component({
  selector: 'app-specialites-admin',
  imports: [NavbarComponent, FormsModule],
  template: `
    <app-navbar />
    <div class="page-wrapper">
      <section>
        <div class="page-header">
          <h2 class="heading" style="text-align:left;padding-bottom:0">
            Gestion des <span>spécialités</span>
          </h2>
          <button class="btn btn-primary" (click)="openForm()">+ Nouvelle spécialité</button>
        </div>

        @if (successMsg()) { <div class="alert alert-success">{{ successMsg() }}</div> }
        @if (errorMsg())   { <div class="alert alert-error">{{ errorMsg() }}</div> }

        @if (showForm()) {
          <div class="card" style="max-width:40rem;margin-bottom:2.5rem">
            <h3 style="font-size:1.9rem;margin-bottom:1.5rem;color:var(--black)">
              {{ editing() ? 'Modifier' : 'Nouvelle spécialité' }}
            </h3>
            <form (ngSubmit)="save()">
              <div class="form-group">
                <label for="specialite-nom">Nom</label>
                <input id="specialite-nom" type="text" [(ngModel)]="form.nom" name="nom"
                       placeholder="Ex : Cardiologie" required />
              </div>
              <div style="display:flex;gap:1rem">
                <button type="submit" class="btn btn-primary" [disabled]="saving()">
                  {{ saving() ? '...' : (editing() ? 'Enregistrer' : 'Créer') }}
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
                <tr><th>#</th><th>Nom</th><th>Actions</th></tr>
              </thead>
              <tbody>
                @for (s of specialites(); track s.id) {
                  <tr>
                    <td>{{ s.id }}</td>
                    <td>{{ s.nom }}</td>
                    <td>
                      <button class="btn btn-outline btn-sm" (click)="openForm(s)" style="margin-right:.5rem">Modifier</button>
                      <button class="btn btn-danger btn-sm" (click)="remove(s.id)">Supprimer</button>
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
export class SpecialitesAdminComponent implements OnInit {
  private readonly service = inject(SpecialitesService);

  specialites = signal<Specialite[]>([]);
  loading     = signal(true);
  showForm    = signal(false);
  saving      = signal(false);
  editing     = signal<Specialite | null>(null);
  successMsg  = signal('');
  errorMsg    = signal('');
  form        = { nom: '' };

  ngOnInit() { this.load(); }
  private load() {
    this.loading.set(true);
    this.service.getAll().subscribe({ next: (r) => { this.specialites.set(r.data); this.loading.set(false); } });
  }

  openForm(s?: Specialite) {
    this.editing.set(s ?? null);
    this.form = { nom: s?.nom ?? '' };
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
    if (!confirm('Supprimer cette spécialité ?')) return;
    this.service.remove(id).subscribe({
      next: () => { this.successMsg.set('Spécialité supprimée.'); this.load(); },
      error: (err) => this.errorMsg.set(err.error?.message ?? 'Erreur.'),
    });
  }
}
