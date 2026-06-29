import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavbarComponent }  from '../../../shared/navbar/navbar.component';
import { CentresService }   from '../../../core/services/centres.service';
import { Centre }           from '../../../core/models/centre.model';

@Component({
  selector: 'app-centres-admin',
  imports: [NavbarComponent, FormsModule],
  template: `
    <app-navbar />
    <div class="page-wrapper">
      <section>
        <div class="page-header">
          <h2 class="heading" style="text-align:left;padding-bottom:0">
            Gestion des <span>centres</span>
          </h2>
          <button class="btn btn-primary" (click)="openForm()">+ Nouveau centre</button>
        </div>

        @if (successMsg()) { <div class="alert alert-success">{{ successMsg() }}</div> }
        @if (errorMsg())   { <div class="alert alert-error">{{ errorMsg() }}</div> }

        <!-- Formulaire -->
        @if (showForm()) {
          <div class="card" style="max-width:55rem;margin-bottom:2.5rem">
            <h3 style="font-size:1.9rem;margin-bottom:1.5rem;color:var(--black)">
              {{ editing() ? 'Modifier le centre' : 'Nouveau centre' }}
            </h3>
            <form (ngSubmit)="save()">
              <div class="form-group">
                <label for="centre-nom">Nom</label>
                <input id="centre-nom" type="text" [(ngModel)]="form.nom" name="nom" required />
              </div>
              <div class="form-group">
                <label for="centre-adresse">Adresse</label>
                <input id="centre-adresse" type="text" [(ngModel)]="form.adresse" name="adresse" required />
              </div>
              <div class="form-group">
                <label for="centre-contact">Contact</label>
                <input id="centre-contact" type="text" [(ngModel)]="form.contact" name="contact" required />
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

        <!-- Tableau -->
        @if (loading()) { <div class="spinner"></div> }
        @if (!loading()) {
          <div class="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nom</th>
                  <th>Adresse</th>
                  <th>Contact</th>
                  <th>Médecins</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (c of centres(); track c.id) {
                  <tr>
                    <td>{{ c.id }}</td>
                    <td>{{ c.nom }}</td>
                    <td>{{ c.adresse }}</td>
                    <td>{{ c.contact }}</td>
                    <td>{{ c._count?.medecins ?? 0 }}</td>
                    <td>
                      <button class="btn btn-outline btn-sm" (click)="openForm(c)" style="margin-right:.5rem">Modifier</button>
                      <button class="btn btn-danger btn-sm" (click)="remove(c.id)">Supprimer</button>
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
export class CentresAdminComponent implements OnInit {
  private readonly service = inject(CentresService);

  centres    = signal<Centre[]>([]);
  loading    = signal(true);
  showForm   = signal(false);
  saving     = signal(false);
  editing    = signal<Centre | null>(null);
  successMsg = signal('');
  errorMsg   = signal('');

  form = { nom: '', adresse: '', contact: '' };

  ngOnInit() { this.load(); }

  private load() {
    this.loading.set(true);
    this.service.getAll().subscribe({ next: (r) => { this.centres.set(r.data); this.loading.set(false); } });
  }

  openForm(c?: Centre) {
    this.editing.set(c ?? null);
    this.form = c ? { nom: c.nom, adresse: c.adresse, contact: c.contact } : { nom: '', adresse: '', contact: '' };
    this.showForm.set(true);
    this.successMsg.set('');
    this.errorMsg.set('');
  }

  closeForm() { this.showForm.set(false); this.editing.set(null); }

  save() {
    this.saving.set(true);
    const req = this.editing()
      ? this.service.update(this.editing()!.id, this.form)
      : this.service.create(this.form);
    req.subscribe({
      next: () => {
        this.successMsg.set(this.editing() ? 'Centre modifié.' : 'Centre créé.');
        this.saving.set(false);
        this.closeForm();
        this.load();
      },
      error: (err) => { this.errorMsg.set(err.error?.message ?? 'Erreur.'); this.saving.set(false); },
    });
  }

  remove(id: number) {
    if (!confirm('Supprimer ce centre ?')) return;
    this.service.remove(id).subscribe({
      next: () => { this.successMsg.set('Centre supprimé.'); this.load(); },
      error: (err) => this.errorMsg.set(err.error?.message ?? 'Erreur.'),
    });
  }
}
