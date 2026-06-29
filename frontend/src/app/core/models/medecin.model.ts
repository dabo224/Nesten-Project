import { Centre } from './centre.model';
import { Specialite } from './specialite.model';

export interface Medecin {
  id: number;
  nom: string;
  specialiteId: number;
  centreId: number;
  specialite?: Specialite;
  centre?: Centre;
}
