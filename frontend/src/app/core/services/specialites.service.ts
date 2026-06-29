import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Specialite } from '../models/specialite.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SpecialitesService {
  private readonly API = `${environment.apiUrl}/specialites`;
  private readonly http = inject(HttpClient);

  getAll() {
    return this.http.get<{ success: boolean; data: Specialite[] }>(this.API);
  }

  create(data: { nom: string }) {
    return this.http.post<{ success: boolean; data: Specialite }>(this.API, data);
  }

  update(id: number, data: { nom: string }) {
    return this.http.put<{ success: boolean; data: Specialite }>(`${this.API}/${id}`, data);
  }

  remove(id: number) {
    return this.http.delete<{ success: boolean }>(`${this.API}/${id}`);
  }
}
