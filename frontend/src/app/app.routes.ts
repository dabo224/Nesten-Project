import { Routes } from '@angular/router';
import { authGuard }    from './core/guards/auth.guard';
import { adminGuard }   from './core/guards/admin.guard';
import { patientGuard } from './core/guards/patient.guard';

export const routes: Routes = [
  // Redirection racine
  { path: '', redirectTo: 'creneaux', pathMatch: 'full' },

  // Page d'authentification (publique)
  {
    path: 'auth',
    loadComponent: () =>
      import('./features/auth/auth.component').then((m) => m.AuthComponent),
  },

  // Espace patient (connecté, non-admin)
  {
    path: 'creneaux',
    canActivate: [authGuard, patientGuard],
    loadComponent: () =>
      import('./features/creneaux/creneaux-list/creneaux-list.component').then(
        (m) => m.CreneauxListComponent
      ),
  },
  {
    path: 'creneaux/:id',
    canActivate: [authGuard, patientGuard],
    loadComponent: () =>
      import('./features/creneaux/creneau-detail/creneau-detail.component').then(
        (m) => m.CreneauDetailComponent
      ),
  },
  {
    path: 'mes-rendezvous',
    canActivate: [authGuard, patientGuard],
    loadComponent: () =>
      import('./features/rendezvous/mes-rendezvous/mes-rendezvous.component').then(
        (m) => m.MesRendezVousComponent
      ),
  },

  // Espace admin (connecté + rôle ADMIN)
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/admin/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
      },
      {
        path: 'centres',
        loadComponent: () =>
          import('./features/admin/centres/centres-admin.component').then(
            (m) => m.CentresAdminComponent
          ),
      },
      {
        path: 'specialites',
        loadComponent: () =>
          import('./features/admin/specialites/specialites-admin.component').then(
            (m) => m.SpecialitesAdminComponent
          ),
      },
      {
        path: 'medecins',
        loadComponent: () =>
          import('./features/admin/medecins/medecins-admin.component').then(
            (m) => m.MedecinsAdminComponent
          ),
      },
      {
        path: 'absences',
        loadComponent: () =>
          import('./features/admin/absences/absences-admin.component').then(
            (m) => m.AbsencesAdminComponent
          ),
      },
      {
        path: 'creneaux',
        loadComponent: () =>
          import('./features/admin/creneaux/creneaux-admin.component').then(
            (m) => m.CreneauxAdminComponent
          ),
      },
      {
        path: 'rendezvous',
        loadComponent: () =>
          import('./features/admin/rendezvous/rendezvous-admin.component').then(
            (m) => m.RendezVousAdminComponent
          ),
      },
    ],
  },

  // Catch-all
  { path: '**', redirectTo: 'creneaux' },
];
