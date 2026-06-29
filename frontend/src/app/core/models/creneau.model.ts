import { Medecin } from './medecin.model';
import { RendezVous } from './rendezvous.model';

export interface Creneau {
  id: number;
  medecinId: number;
  dateHeure: string;
  dureeMinutes: number;
  estDisponible: boolean;
  medecin?: Medecin;
  rendezVous?: RendezVous | null;
}
