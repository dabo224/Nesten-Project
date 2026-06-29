import { z } from 'zod';

export const registerSchema = z.object({
  nom: z.string({ required_error: 'Le nom est requis.' })
    .trim()
    .min(2, 'Le nom doit contenir au moins 2 caractères.'),

  email: z.string({ required_error: "L'email est requis." })
    .trim()
    .email()
    .transform((v) => v.toLowerCase()),

  password: z.string({ required_error: 'Le mot de passe est requis.' })
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères.'),

  role: z.enum(['ADMIN', 'PATIENT']).optional(),
});

export const loginSchema = z.object({
  email: z.string({ required_error: "L'email est requis." })
    .trim()
    .email()
    .transform((v) => v.toLowerCase()),

  password: z.string({ required_error: 'Le mot de passe est requis.' })
    .min(1, 'Le mot de passe est requis.'),
});
