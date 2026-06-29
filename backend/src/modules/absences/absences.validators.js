import { z } from 'zod';

const isValidDate = (v) => !Number.isNaN(Date.parse(v));

export const absenceSchema = z.object({
  medecinId: z.number({ required_error: 'Le médecin est requis.', invalid_type_error: 'medecinId doit être un entier.' })
    .int('medecinId doit être un entier.')
    .positive('Médecin invalide.'),

  dateDebut: z.string({ required_error: 'La date de début est requise.' })
    .min(1, 'La date de début est requise.')
    .refine(isValidDate, { message: 'Format de date de début invalide.' }),

  dateFin: z.string({ required_error: 'La date de fin est requise.' })
    .min(1, 'La date de fin est requise.')
    .refine(isValidDate, { message: 'Format de date de fin invalide.' }),

  motif: z.enum(['MALADIE', 'CONGES', 'AUTRE'], {
    required_error: 'Le motif est requis.',
    invalid_type_error: 'Motif invalide.',
    message: 'Le motif doit être MALADIE, CONGES ou AUTRE.',
  }),
}).refine(
  (d) => new Date(d.dateFin) > new Date(d.dateDebut),
  { message: 'La date de fin doit être postérieure à la date de début.', path: ['dateFin'] }
);

export const absenceUpdateSchema = z.object({
  medecinId:  z.number().int().positive().optional(),
  dateDebut:  z.string().refine(isValidDate, { message: 'Format de date de début invalide.' }).optional(),
  dateFin:    z.string().refine(isValidDate, { message: 'Format de date de fin invalide.' }).optional(),
  motif:      z.enum(['MALADIE', 'CONGES', 'AUTRE']).optional(),
});
