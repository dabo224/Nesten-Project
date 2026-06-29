import { z } from 'zod';

export const rendezvousSchema = z.object({
  creneauId: z.number({ required_error: 'Le créneau est requis.', invalid_type_error: 'creneauId doit être un entier.' })
    .int('creneauId doit être un entier.')
    .positive('Créneau invalide.'),

  patientNom: z.string({ required_error: 'Le nom du patient est requis.' })
    .trim()
    .min(2, 'Le nom du patient doit contenir au moins 2 caractères.'),

  patientContact: z.string({ required_error: 'Le contact du patient est requis.' })
    .trim()
    .min(2, 'Le contact du patient doit contenir au moins 2 caractères.'),
});
