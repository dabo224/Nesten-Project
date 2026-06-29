import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Creneau } from '../models/creneau.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CreneauxService {
  private readonly API = `${environment.apiUrl}/creneaux`;
  private readonly http = inject(HttpClient);

  getAll(filters: { medecinId?: number; date?: string; estDisponible?: boolean } = {}) {
    let params = new HttpParams();
    if (filters.medecinId)              params = params.set('medecinId', filters.medecinId);
    if (filters.date)                   params = params.set('date', filters.date);
    if (filters.estDisponible !== undefined)
      params = params.set('estDisponible', String(filters.estDisponible));
    return this.http.get<{ success: boolean; data: Creneau[] }>(this.API, { params });
  }

  getById(id: number) {
    return this.http.get<{ success: boolean; data: Creneau }>(`${this.API}/${id}`);
  }

  create(data: { medecinId: number; dateHeure: string; dureeMinutes?: number }) {
    return this.http.post<{ success: boolean; data: Creneau }>(this.API, data);
  }

  update(id: number, data: Partial<{ dateHeure: string; dureeMinutes: number }>) {
    return this.http.put<{ success: boolean; data: Creneau }>(`${this.API}/${id}`, data);
  }

  remove(id: number) {
    return this.http.delete<{ success: boolean }>(`${this.API}/${id}`);
  }
}
