/**
 * Medecins Controller — pont HTTP/service. (SRP)
 */

import * as medecinService from './medecins.service.js';
import asyncWrapper from '../../common/utils/asyncWrapper.js';
import { success } from '../../common/utils/apiResponse.js';

/**
 * GET /api/medecins
 * Accepte les query params optionnels : ?specialiteId=1&centreId=2
 * Convertit les strings en nombres avant de passer au service.
 */
export const getAll = asyncWrapper(async (req, res) => {
  const filters = {
    specialiteId: req.query.specialiteId ? Number(req.query.specialiteId) : undefined,
    centreId:     req.query.centreId     ? Number(req.query.centreId)     : undefined,
  };
  const medecins = await medecinService.getAll(filters);
  success(res, medecins, 200, 'Médecins récupérés.');
});

/**
 * GET /api/medecins/:id
 * Retourne un médecin avec sa spécialité, son centre et ses absences.
 */
export const getById = asyncWrapper(async (req, res) => {
  const medecin = await medecinService.getById(Number(req.params.id));
  success(res, medecin, 200, 'Médecin récupéré.');
});

/**
 * POST /api/medecins — ADMIN uniquement
 * Body attendu : { nom, specialiteId, centreId }
 */
export const create = asyncWrapper(async (req, res) => {
  const { nom, specialiteId, centreId } = req.body;
  const medecin = await medecinService.create({
    nom,
    specialiteId: Number(specialiteId),
    centreId:     Number(centreId),
  });
  success(res, medecin, 201, 'Médecin créé avec succès.');
});

/**
 * PUT /api/medecins/:id — ADMIN uniquement
 * Body attendu : { nom?, specialiteId?, centreId? }
 */
export const update = asyncWrapper(async (req, res) => {
  const { nom, specialiteId, centreId } = req.body;
  const data = {
    ...(nom          && { nom }),
    ...(specialiteId && { specialiteId: Number(specialiteId) }),
    ...(centreId     && { centreId:     Number(centreId) }),
  };
  const medecin = await medecinService.update(Number(req.params.id), data);
  success(res, medecin, 200, 'Médecin mis à jour.');
});

/**
 * DELETE /api/medecins/:id — ADMIN uniquement
 * Supprime le médecin ainsi que ses absences et créneaux (cascade).
 */
export const remove = asyncWrapper(async (req, res) => {
  await medecinService.remove(Number(req.params.id));
  success(res, null, 200, 'Médecin supprimé.');
});
