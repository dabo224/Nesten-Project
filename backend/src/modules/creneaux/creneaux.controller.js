/**
 * Creneaux Controller — liaison HTTP ↔ service. (SRP) (DIP)
 */

import asyncWrapper from '../../common/utils/asyncWrapper.js';
import * as creneauxService from './creneaux.service.js';
import { success } from '../../common/utils/apiResponse.js';

/**
 * GET /api/creneaux?medecinId=1&date=2026-08-01&estDisponible=true
 */
export const getAll = asyncWrapper(async (req, res) => {
  const { medecinId, date, estDisponible } = req.query;

  const filters = {
    ...(medecinId    && { medecinId: Number(medecinId) }),
    ...(date         && { date }),
    ...(estDisponible !== undefined && { estDisponible: estDisponible === 'true' }),
  };

  const creneaux = await creneauxService.getAll(filters);
  success(res, creneaux);
});

/** GET /api/creneaux/:id */
export const getById = asyncWrapper(async (req, res) => {
  const creneau = await creneauxService.getById(Number(req.params.id));
  success(res, creneau);
});

/** POST /api/creneaux */
export const create = asyncWrapper(async (req, res) => {
  const { medecinId, dateHeure, dureeMinutes } = req.body;
  const creneau = await creneauxService.create({
    medecinId:    Number(medecinId),
    dateHeure,
    dureeMinutes: dureeMinutes ? Number(dureeMinutes) : 30,
  });
  success(res, creneau, 201, 'Créneau créé avec succès.');
});

/** PUT /api/creneaux/:id */
export const update = asyncWrapper(async (req, res) => {
  const { dateHeure, dureeMinutes } = req.body;
  const creneau = await creneauxService.update(Number(req.params.id), {
    dateHeure,
    ...(dureeMinutes && { dureeMinutes: Number(dureeMinutes) }),
  });
  success(res, creneau, 200, 'Créneau mis à jour.');
});

/** DELETE /api/creneaux/:id */
export const remove = asyncWrapper(async (req, res) => {
  await creneauxService.remove(Number(req.params.id));
  success(res, null, 200, 'Créneau supprimé.');
});
