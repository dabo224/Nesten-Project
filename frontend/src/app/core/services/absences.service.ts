import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Absence, MotifAbsence } from '../models/absence.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AbsencesService {
  private readonly API = `${environment.apiUrl}/absences`;
  private readonly http = inject(HttpClient);

  getAll(medecinId?: number) {
    let params = new HttpParams();
    if (medecinId) params = params.set('medecinId', medecinId);
    return this.http.get<{ success: boolean; data: Absence[] }>(this.API, { params });
  }

  create(data: { medecinId: number; dateDebut: string; dateFin: string; motif: MotifAbsence }) {
    return this.http.post<{ success: boolean; data: Absence }>(this.API, data);
  }

  update(id: number, data: Partial<{ dateDebut: string; dateFin: string; motif: MotifAbsence }>) {
    return this.http.put<{ success: boolean; data: Absence }>(`${this.API}/${id}`, data);
  }

  remove(id: number) {
    return this.http.delete<{ success: boolean }>(`${this.API}/${id}`);
  }
}
