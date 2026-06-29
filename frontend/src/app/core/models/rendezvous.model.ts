import { Creneau } from './creneau.model';

export type StatutRdv = 'CONFIRME' | 'ANNULE';

export interface RendezVous {
  id: number;
  creneauId: number;
  patientNom: string;
  patientContact: string;
  statut: StatutRdv;
  createdAt?: string;
  creneau?: Creneau;
}
