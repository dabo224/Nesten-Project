import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { RendezVous } from '../models/rendezvous.model';

@Injectable({ providedIn: 'root' })
export class RendezVousService {
  private readonly API = 'http://localhost:3000/api/rendezvous';
  private readonly http = inject(HttpClient);

  getAll(filters: { statut?: string } = {}) {
    let params = new HttpParams();
    if (filters.statut) params = params.set('statut', filters.statut);
    return this.http.get<{ success: boolean; data: RendezVous[] }>(this.API, { params });
  }

  getMine() {
    return this.http.get<{ success: boolean; data: RendezVous[] }>(`${this.API}/mine`);
  }

  getById(id: number) {
    return this.http.get<{ success: boolean; data: RendezVous }>(`${this.API}/${id}`);
  }

  book(data: { creneauId: number; patientNom: string; patientContact: string }) {
    return this.http.post<{ success: boolean; data: RendezVous }>(this.API, data);
  }

  cancel(id: number) {
    return this.http.patch<{ success: boolean; data: RendezVous }>(
      `${this.API}/${id}/annuler`,
      {}
    );
  }

  remove(id: number) {
    return this.http.delete<{ success: boolean }>(`${this.API}/${id}`);
  }
}
