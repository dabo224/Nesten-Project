import { z } from 'zod';

export const centreSchema = z.object({
  nom: z.string({ required_error: 'Le nom est requis.' })
    .trim()
    .min(2, 'Le nom doit contenir au moins 2 caractères.'),

  adresse: z.string({ required_error: "L'adresse est requise." })
    .trim()
    .min(5, "L'adresse doit contenir au moins 5 caractères."),

  contact: z.string({ required_error: 'Le contact est requis.' })
    .trim()
    .min(2, 'Le contact doit contenir au moins 2 caractères.'),
});

export const centreUpdateSchema = centreSchema.partial();
