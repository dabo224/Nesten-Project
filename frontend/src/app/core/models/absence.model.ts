import { Medecin } from './medecin.model';

export type MotifAbsence = 'MALADIE' | 'CONGES' | 'AUTRE';

export interface Absence {
  id: number;
  medecinId: number;
  dateDebut: string;
  dateFin: string;
  motif: MotifAbsence;
  medecin?: Medecin;
}
