import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe, UpperCasePipe } from '@angular/common';
import { NavbarComponent }    from '../../../shared/navbar/navbar.component';
import { CentresService }     from '../../../core/services/centres.service';
import { MedecinsService }    from '../../../core/services/medecins.service';
import { CreneauxService }    from '../../../core/services/creneaux.service';
import { RendezVousService }  from '../../../core/services/rendezvous.service';
import { Centre }     from '../../../core/models/centre.model';
import { Specialite } from '../../../core/models/specialite.model';
import { Medecin }    from '../../../core/models/medecin.model';
import { Creneau }    from '../../../core/models/creneau.model';

@Component({
  selector: 'app-creneaux-list',
  imports: [NavbarComponent, FormsModule, DatePipe, UpperCasePipe],
  template: `
    <app-navbar />

    <div class="page-wrapper">

      <!-- ── Hero ─────────────────────────────────────────────────────────── -->
      <section class="booking-hero">
        <div class="hero-content">
          <h2>Prenez rendez-vous <span>en ligne</span></h2>
          <p>Choisissez votre centre, votre spécialité et réservez en quelques clics.</p>
        </div>
        <img src="book-img.svg" alt="Réservation médicale" class="hero-img" />
      </section>

      <!-- ── Stepper ───────────────────────────────────────────────────────── -->
      <section class="stepper-section">

        <div class="stepper">
          @for (s of steps; track s.num) {
            <div class="step" [class.active]="step() === s.num" [class.done]="step() > s.num">
              <div class="step-circle">
                @if (step() > s.num) {
                  <i class="fas fa-check"></i>
                } @else {
                  {{ s.num }}
                }
              </div>
              <span class="step-label">{{ s.label }}</span>
            </div>
            @if (s.num < steps.length) {
              <div class="step-line" [class.done]="step() > s.num"></div>
            }
          }
        </div>

        <!-- ── Étape 1 : Centres ──────────────────────────────────────────── -->
        @if (step() === 1) {
          <div class="step-content">
            <h3 class="step-title"><i class="fas fa-hospital"></i> Choisissez un centre médical</h3>
            @if (loading()) { <div class="spinner"></div> }
            <div class="cards-grid">
              @for (c of centres(); track c.id) {
                <div class="choice-card" role="button" tabindex="0"
                     (click)="selectCentre(c)" (keydown.enter)="selectCentre(c)">
                  <div class="choice-icon"><i class="fas fa-hospital-alt"></i></div>
                  <h4>{{ c.nom }}</h4>
                  <p><i class="fas fa-map-marker-alt"></i> {{ c.adresse }}</p>
                  <p><i class="fas fa-phone"></i> {{ c.contact }}</p>
                  <div class="choice-badge">{{ c._count?.medecins ?? 0 }} médecin(s)</div>
                </div>
              }
            </div>
          </div>
        }

        <!-- ── Étape 2 : Spécialités ─────────────────────────────────────── -->
        @if (step() === 2) {
          <div class="step-content">
            <div class="step-back" role="button" tabindex="0"
                 (click)="goBack()" (keydown.enter)="goBack()">
              <i class="fas fa-arrow-left"></i> {{ selectedCentre()?.nom }}
            </div>
            <h3 class="step-title"><i class="fas fa-stethoscope"></i> Choisissez une spécialité</h3>
            @if (loading()) { <div class="spinner"></div> }
            <div class="cards-grid">
              @for (s of specialites(); track s.id) {
                <div class="choice-card" role="button" tabindex="0"
                     (click)="selectSpecialite(s)" (keydown.enter)="selectSpecialite(s)">
                  <div class="choice-icon"><i class="fas fa-heartbeat"></i></div>
                  <h4>{{ s.nom }}</h4>
                </div>
              }
            </div>
          </div>
        }

        <!-- ── Étape 3 : Médecins ────────────────────────────────────────── -->
        @if (step() === 3) {
          <div class="step-content">
            <div class="step-back" role="button" tabindex="0"
                 (click)="goBack()" (keydown.enter)="goBack()">
              <i class="fas fa-arrow-left"></i> {{ selectedSpecialite()?.nom }}
            </div>
            <h3 class="step-title"><i class="fas fa-user-md"></i> Choisissez un médecin</h3>
            @if (loading()) { <div class="spinner"></div> }
            <div class="cards-grid">
              @for (m of medecins(); track m.id) {
                <div class="choice-card doc-choice" role="button" tabindex="0"
                     (click)="selectMedecin(m)" (keydown.enter)="selectMedecin(m)">
                  <img src="doc-1.jpg" alt="{{ m.nom }}" class="doc-avatar" />
                  <h4>{{ m.nom }}</h4>
                  <p class="doc-spec">{{ m.specialite?.nom }}</p>
                  <p><i class="fas fa-hospital"></i> {{ m.centre?.nom }}</p>
                </div>
              }
            </div>
          </div>
        }

        <!-- ── Étape 4 : Créneaux ────────────────────────────────────────── -->
        @if (step() === 4) {
          <div class="step-content">
            <div class="step-back" role="button" tabindex="0"
                 (click)="goBack()" (keydown.enter)="goBack()">
              <i class="fas fa-arrow-left"></i> {{ selectedMedecin()?.nom }}
            </div>
            <h3 class="step-title"><i class="fas fa-calendar-alt"></i> Choisissez un créneau</h3>
            @if (loading()) { <div class="spinner"></div> }
            @if (!loading() && creneaux().length === 0) {
              <div class="empty-state">
                <i class="fas fa-calendar-times"></i>
                <p>Aucun créneau disponible pour ce médecin.</p>
                <button class="btn btn-outline" (click)="goBack()">Choisir un autre médecin</button>
              </div>
            }
            <div class="slots-grid">
              @for (c of creneaux(); track c.id) {
                <div class="slot-item" role="button" tabindex="0"
                     (click)="selectCreneau(c)" (keydown.enter)="selectCreneau(c)">
                  <div class="slot-date">
                    <span class="slot-day">{{ c.dateHeure | date:'EEE' | uppercase }}</span>
                    <span class="slot-num">{{ c.dateHeure | date:'dd' }}</span>
                    <span class="slot-month">{{ c.dateHeure | date:'MMM' }}</span>
                  </div>
                  <div class="slot-time">
                    <i class="fas fa-clock"></i>
                    {{ c.dateHeure | date:'HH:mm' }}
                  </div>
                  <div class="slot-dur">{{ c.dureeMinutes }} min</div>
                </div>
              }
            </div>
          </div>
        }

        <!-- ── Étape 5 : Confirmation ────────────────────────────────────── -->
        @if (step() === 5) {
          <div class="step-content" style="max-width:56rem;margin:0 auto">
            <div class="step-back" role="button" tabindex="0"
                 (click)="goBack()" (keydown.enter)="goBack()">
              <i class="fas fa-arrow-left"></i> Choisir un autre créneau
            </div>
            <h3 class="step-title"><i class="fas fa-calendar-check"></i> Confirmer le rendez-vous</h3>

            <!-- Récap -->
            <div class="recap-card">
              <div class="recap-row">
                <i class="fas fa-hospital-alt"></i>
                <span>{{ selectedCentre()?.nom }}</span>
              </div>
              <div class="recap-row">
                <i class="fas fa-stethoscope"></i>
                <span>{{ selectedSpecialite()?.nom }}</span>
              </div>
              <div class="recap-row">
                <i class="fas fa-user-md"></i>
                <span>{{ selectedMedecin()?.nom }}</span>
              </div>
              <div class="recap-row">
                <i class="fas fa-calendar"></i>
                <span>{{ selectedCreneau()?.dateHeure | date:'EEEE dd MMMM yyyy à HH:mm' }}
                  ({{ selectedCreneau()?.dureeMinutes }} min)</span>
              </div>
            </div>

            @if (successMsg()) {
              <div class="alert alert-success">
                <i class="fas fa-check-circle"></i> {{ successMsg() }}
              </div>
            }
            @if (errorMsg()) {
              <div class="alert alert-error">
                <i class="fas fa-exclamation-circle"></i> {{ errorMsg() }}
              </div>
            }

            <form (ngSubmit)="confirm()" style="margin-top:2rem">
              <div class="form-group">
                <label for="booking-patientNom">Votre nom complet</label>
                <input id="booking-patientNom" type="text" [(ngModel)]="form.patientNom" name="patientNom"
                       placeholder="Ex : Fatou Diallo" required />
              </div>
              <div class="form-group">
                <label for="booking-patientContact">Votre contact (email ou téléphone)</label>
                <input id="booking-patientContact" type="text" [(ngModel)]="form.patientContact" name="patientContact"
                       placeholder="Ex : 77 000 00 00 ou email@mail.com" required />
              </div>
              <button type="submit" class="btn btn-primary btn-block" [disabled]="booking()">
                @if (booking()) { <i class="fas fa-spinner fa-spin"></i> }
                @else { <i class="fas fa-check"></i> }
                Confirmer le rendez-vous
              </button>
            </form>
          </div>
        }

        <!-- ── Étape 6 : Succès ──────────────────────────────────────────── -->
        @if (step() === 6) {
          <div class="step-content success-screen">
            <div class="success-icon"><i class="fas fa-check-circle"></i></div>
            <h3>Rendez-vous confirmé !</h3>
            <div class="recap-card" style="margin:2rem auto;max-width:50rem">
              <div class="recap-row"><i class="fas fa-user-md"></i><span>{{ selectedMedecin()?.nom }}</span></div>
              <div class="recap-row"><i class="fas fa-calendar"></i>
                <span>{{ selectedCreneau()?.dateHeure | date:'EEEE dd MMMM yyyy à HH:mm' }}</span></div>
              <div class="recap-row"><i class="fas fa-hospital-alt"></i><span>{{ selectedCentre()?.nom }}</span></div>
            </div>
            <button class="btn btn-outline" (click)="restart()">
              <i class="fas fa-plus"></i> Prendre un autre rendez-vous
            </button>
          </div>
        }

      </section>
    </div>
  `,
  styles: [`
    /* ── Hero ──────────────────────────────────────────────────────────── */
    .booking-hero {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 2rem;
      padding: 3rem 9%;
      background: linear-gradient(135deg, #f0faf8 0%, #e8f8f5 100%);
      border-bottom: .2rem solid var(--green);
    }
    .hero-content h2 {
      font-size: 3.6rem;
      font-weight: 700;
      color: var(--black);
      text-shadow: var(--text-shadow);
      line-height: 1.4;
    }
    .hero-content h2 span { color: var(--green); }
    .hero-content p { font-size: 1.6rem; color: var(--light); margin-top: 1rem; }
    .hero-img { width: 28rem; }

    /* ── Stepper ────────────────────────────────────────────────────────── */
    .stepper-section { padding: 3rem 9%; }

    .stepper {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      gap: 0;
      margin-bottom: 4rem;
    }
    .step { display: flex; flex-direction: column; align-items: center; gap: .6rem; }
    .step-circle {
      width: 4.2rem; height: 4.2rem;
      border-radius: 50%;
      border: .25rem solid #ccc;
      display: flex; align-items: center; justify-content: center;
      font-size: 1.6rem; font-weight: 700;
      color: #ccc;
      background: #fff;
      transition: all .3s;
    }
    .step.active .step-circle { border-color: var(--green); color: var(--green); background: #e8f8f5; }
    .step.done  .step-circle  { border-color: var(--green); background: var(--green); color: #fff; }
    .step-label { font-size: 1.2rem; color: var(--light); white-space: nowrap; }
    .step.active .step-label, .step.done .step-label { color: var(--green); font-weight: 600; }
    .step-line {
      flex: 1; height: .25rem; background: #ddd; min-width: 3rem; max-width: 8rem;
      margin-bottom: 2.2rem;
    }
    .step-line.done { background: var(--green); }

    /* ── Step content ───────────────────────────────────────────────────── */
    .step-title {
      font-size: 2.2rem; font-weight: 700; color: var(--black);
      margin-bottom: 2.5rem;
    }
    .step-title i { color: var(--green); margin-right: .8rem; }

    .step-back {
      display: inline-flex; align-items: center; gap: .6rem;
      font-size: 1.4rem; color: var(--green); cursor: pointer;
      margin-bottom: 1.5rem; font-weight: 500;
    }
    .step-back:hover { text-decoration: underline; }

    /* ── Cards grid ─────────────────────────────────────────────────────── */
    .cards-grid {
      display: grid;
      gap: 2rem;
      grid-template-columns: repeat(auto-fill, minmax(24rem, 1fr));
    }

    .choice-card {
      background: #fff;
      border: .2rem solid #e2e8f0;
      border-radius: 1rem;
      padding: 2.5rem;
      cursor: pointer;
      transition: all .2s;
      text-align: center;
    }
    .choice-card:hover {
      border-color: var(--green);
      box-shadow: var(--box-shadow);
      transform: translateY(-.3rem);
    }
    .choice-icon {
      font-size: 4rem; color: var(--green);
      margin-bottom: 1.2rem;
    }
    .choice-card h4 { font-size: 1.8rem; color: var(--black); margin-bottom: .8rem; }
    .choice-card p { font-size: 1.3rem; color: var(--light); margin: .3rem 0; }
    .choice-card p i { color: var(--green); margin-right: .5rem; }
    .choice-badge {
      display: inline-block; margin-top: 1rem;
      background: #e8f8f5; color: var(--green);
      border-radius: 99rem; padding: .3rem 1rem;
      font-size: 1.2rem; font-weight: 600;
    }

    /* Doc card */
    .doc-choice .doc-avatar {
      width: 8rem; height: 8rem; border-radius: 50%;
      object-fit: cover; border: .2rem solid var(--green);
      margin-bottom: 1rem;
    }
    .doc-spec { color: var(--green) !important; font-weight: 600 !important; }

    /* ── Slots ──────────────────────────────────────────────────────────── */
    .slots-grid {
      display: grid;
      gap: 1.5rem;
      grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr));
    }
    .slot-item {
      background: #fff;
      border: .2rem solid #e2e8f0;
      border-radius: 1rem;
      padding: 2rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 1.5rem;
      transition: all .2s;
    }
    .slot-item:hover {
      border-color: var(--green);
      box-shadow: var(--box-shadow);
      transform: translateY(-.2rem);
    }
    .slot-date {
      display: flex; flex-direction: column; align-items: center;
      background: var(--green); color: #fff;
      border-radius: .6rem; padding: .8rem 1.2rem; min-width: 6rem;
    }
    .slot-day   { font-size: 1.1rem; font-weight: 600; text-transform: uppercase; }
    .slot-num   { font-size: 2.4rem; font-weight: 700; line-height: 1; }
    .slot-month { font-size: 1.1rem; text-transform: uppercase; }
    .slot-time  { font-size: 1.8rem; font-weight: 600; color: var(--black); }
    .slot-time i { color: var(--green); margin-right: .4rem; }
    .slot-dur   { font-size: 1.3rem; color: var(--light); margin-left: auto; }

    /* ── Recap ──────────────────────────────────────────────────────────── */
    .recap-card {
      background: #f0faf8;
      border: .2rem solid var(--green);
      border-radius: 1rem;
      padding: 2rem;
      margin-bottom: 2rem;
    }
    .recap-row {
      display: flex; align-items: center; gap: 1.2rem;
      font-size: 1.5rem; color: var(--black);
      padding: .8rem 0;
      border-bottom: .1rem solid #d1f0ea;
    }
    .recap-row:last-child { border-bottom: none; }
    .recap-row i { color: var(--green); width: 2rem; text-align: center; }

    /* ── Success ────────────────────────────────────────────────────────── */
    .success-screen { text-align: center; padding: 3rem 0; }
    .success-icon { font-size: 8rem; color: var(--green); margin-bottom: 1.5rem; }
    .success-screen h3 { font-size: 3rem; color: var(--black); margin-bottom: 1rem; }

    /* ── Empty ──────────────────────────────────────────────────────────── */
    .empty-state {
      text-align: center; padding: 4rem; color: var(--light);
    }
    .empty-state i { font-size: 6rem; color: var(--green); display: block; margin-bottom: 1.5rem; }
    .empty-state p { font-size: 1.7rem; margin-bottom: 2rem; }

    /* ── Block button ───────────────────────────────────────────────────── */
    .btn-block { width: 100%; justify-content: center; font-size: 1.6rem; padding: 1.2rem; }

    @media (max-width: 600px) {
      .hero-img { display: none; }
      .stepper  { gap: 0; }
      .step-label { display: none; }
    }
  `],
})
export class CreneauxListComponent implements OnInit {
  private centresService    = inject(CentresService);
  private medecinsService   = inject(MedecinsService);
  private creneauxService   = inject(CreneauxService);
  private rdvService        = inject(RendezVousService);

  steps = [
    { num: 1, label: 'Centre' },
    { num: 2, label: 'Spécialité' },
    { num: 3, label: 'Médecin' },
    { num: 4, label: 'Créneau' },
    { num: 5, label: 'Confirmation' },
  ];

  step = signal(1);
  loading = signal(false);
  booking = signal(false);
  successMsg = signal('');
  errorMsg   = signal('');

  centres     = signal<Centre[]>([]);
  specialites = signal<Specialite[]>([]);
  medecins    = signal<Medecin[]>([]);
  creneaux    = signal<Creneau[]>([]);

  selectedCentre     = signal<Centre | null>(null);
  selectedSpecialite = signal<Specialite | null>(null);
  selectedMedecin    = signal<Medecin | null>(null);
  selectedCreneau    = signal<Creneau | null>(null);

  form = { patientNom: '', patientContact: '' };

  ngOnInit() {
    this.loading.set(true);
    this.centresService.getAll().subscribe({
      next: (r) => { this.centres.set(r.data); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  selectCentre(c: Centre) {
    this.selectedCentre.set(c);
    this.step.set(2);
    this.loading.set(true);

    // On charge les médecins de ce centre pour en extraire les spécialités uniques
    this.medecinsService.getAll({ centreId: c.id }).subscribe({
      next: (r) => {
        const seen = new Set<number>();
        const specs: Specialite[] = [];
        for (const m of r.data) {
          if (m.specialite && !seen.has(m.specialite.id)) {
            seen.add(m.specialite.id);
            specs.push(m.specialite);
          }
        }
        this.specialites.set(specs);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  selectSpecialite(s: Specialite) {
    this.selectedSpecialite.set(s);
    this.step.set(3);
    this.loading.set(true);

    this.medecinsService.getAll({
      centreId:     this.selectedCentre()!.id,
      specialiteId: s.id,
    }).subscribe({
      next: (r) => { this.medecins.set(r.data); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  selectMedecin(m: Medecin) {
    this.selectedMedecin.set(m);
    this.step.set(4);
    this.loading.set(true);

    this.creneauxService.getAll({ medecinId: m.id, estDisponible: true }).subscribe({
      next: (r) => { this.creneaux.set(r.data); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  selectCreneau(c: Creneau) {
    this.selectedCreneau.set(c);
    this.step.set(5);
    this.successMsg.set('');
    this.errorMsg.set('');
  }

  confirm() {
    this.booking.set(true);
    this.errorMsg.set('');
    this.rdvService.book({
      creneauId:      this.selectedCreneau()!.id,
      patientNom:     this.form.patientNom,
      patientContact: this.form.patientContact,
    }).subscribe({
      next: () => {
        this.booking.set(false);
        this.step.set(6);
      },
      error: (err) => {
        this.errorMsg.set(err.error?.message ?? 'Erreur lors de la réservation.');
        this.booking.set(false);
      },
    });
  }

  goBack() {
    const prev = this.step() - 1;
    this.step.set(prev < 1 ? 1 : prev);
  }

  restart() {
    this.step.set(1);
    this.selectedCentre.set(null);
    this.selectedSpecialite.set(null);
    this.selectedMedecin.set(null);
    this.selectedCreneau.set(null);
    this.form = { patientNom: '', patientContact: '' };
    this.successMsg.set('');
    this.errorMsg.set('');
  }
}
