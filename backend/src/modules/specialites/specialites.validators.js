import { z } from 'zod';

export const specialiteSchema = z.object({
  nom: z.string({ required_error: 'Le nom est requis.' })
    .trim()
    .min(2, 'Le nom doit contenir au moins 2 caractères.'),
});

export const specialiteUpdateSchema = specialiteSchema.partial();
