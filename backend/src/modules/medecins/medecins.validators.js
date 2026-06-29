import { z } from 'zod';

export const medecinSchema = z.object({
  nom: z.string({ required_error: 'Le nom est requis.' })
    .trim()
    .min(2, 'Le nom doit contenir au moins 2 caractères.'),

  specialiteId: z.number({ required_error: 'La spécialité est requise.', invalid_type_error: 'specialiteId doit être un entier.' })
    .int('specialiteId doit être un entier.')
    .positive('Spécialité invalide.'),

  centreId: z.number({ required_error: 'Le centre est requis.', invalid_type_error: 'centreId doit être un entier.' })
    .int('centreId doit être un entier.')
    .positive('Centre invalide.'),
});

export const medecinUpdateSchema = medecinSchema.partial();
