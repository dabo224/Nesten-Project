import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Medecin } from '../models/medecin.model';

@Injectable({ providedIn: 'root' })
export class MedecinsService {
  private readonly API = 'http://localhost:3000/api/medecins';
  private readonly http = inject(HttpClient);

  getAll(filters: { specialiteId?: number; centreId?: number } = {}) {
    let params = new HttpParams();
    if (filters.specialiteId) params = params.set('specialiteId', filters.specialiteId);
    if (filters.centreId)     params = params.set('centreId', filters.centreId);
    return this.http.get<{ success: boolean; data: Medecin[] }>(this.API, { params });
  }

  getById(id: number) {
    return this.http.get<{ success: boolean; data: Medecin }>(`${this.API}/${id}`);
  }

  create(data: { nom: string; specialiteId: number; centreId: number }) {
    return this.http.post<{ success: boolean; data: Medecin }>(this.API, data);
  }

  update(id: number, data: Partial<{ nom: string; specialiteId: number; centreId: number }>) {
    return this.http.put<{ success: boolean; data: Medecin }>(`${this.API}/${id}`, data);
  }

  remove(id: number) {
    return this.http.delete<{ success: boolean }>(`${this.API}/${id}`);
  }
}
