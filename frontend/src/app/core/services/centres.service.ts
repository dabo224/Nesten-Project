import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Centre } from '../models/centre.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CentresService {
  private readonly API = `${environment.apiUrl}/centres`;
  private readonly http = inject(HttpClient);

  getAll() {
    return this.http.get<{ success: boolean; data: Centre[] }>(this.API);
  }

  getById(id: number) {
    return this.http.get<{ success: boolean; data: Centre }>(`${this.API}/${id}`);
  }

  create(data: { nom: string; adresse: string; contact: string }) {
    return this.http.post<{ success: boolean; data: Centre }>(this.API, data);
  }

  update(id: number, data: Partial<{ nom: string; adresse: string; contact: string }>) {
    return this.http.put<{ success: boolean; data: Centre }>(`${this.API}/${id}`, data);
  }

  remove(id: number) {
    return this.http.delete<{ success: boolean }>(`${this.API}/${id}`);
  }
}
