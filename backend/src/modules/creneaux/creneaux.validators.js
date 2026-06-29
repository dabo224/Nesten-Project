import { z } from 'zod';

const isValidDate = (v) => !isNaN(Date.parse(v));

export const creneauSchema = z.object({
  medecinId: z.number({ required_error: 'Le médecin est requis.', invalid_type_error: 'medecinId doit être un entier.' })
    .int('medecinId doit être un entier.')
    .positive('Médecin invalide.'),

  dateHeure: z.string({ required_error: 'La date et l\'heure sont requises.' })
    .min(1, 'La date et l\'heure sont requises.')
    .refine(isValidDate, { message: 'Format de date invalide.' }),

  dureeMinutes: z.number({ required_error: 'La durée est requise.', invalid_type_error: 'dureeMinutes doit être un entier.' })
    .int('dureeMinutes doit être un entier.')
    .min(10, 'La durée minimale est de 10 minutes.')
    .max(120, 'La durée maximale est de 120 minutes.'),
});

export const creneauUpdateSchema = creneauSchema.partial();
