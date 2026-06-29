export interface Centre {
  id: number;
  nom: string;
  adresse: string;
  contact: string;
  _count?: { medecins: number };
}
