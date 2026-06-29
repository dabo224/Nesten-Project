/**
 * Specialites Controller — pont HTTP/service. (SRP)
 */

import * as specialitesService from './specialites.service.js';
import asyncWrapper from '../../common/utils/asyncWrapper.js';
import { success } from '../../common/utils/apiResponse.js';

/** GET /api/specialites */
export const getAll = asyncWrapper(async (req, res) => {
  const specialites = await specialitesService.getAll();
  success(res, specialites, 200, 'Spécialités récupérées.');
});

/** GET /api/specialites/:id */
export const getById = asyncWrapper(async (req, res) => {
  const specialite = await specialitesService.getById(Number(req.params.id));
  success(res, specialite, 200, 'Spécialité récupérée.');
});

/** POST /api/specialites — Body : { nom } */
export const create = asyncWrapper(async (req, res) => {
  const specialite = await specialitesService.create(req.body);
  success(res, specialite, 201, 'Spécialité créée avec succès.');
});

/** PUT /api/specialites/:id — Body : { nom } */
export const update = asyncWrapper(async (req, res) => {
  const specialite = await specialitesService.update(Number(req.params.id), req.body);
  success(res, specialite, 200, 'Spécialité mise à jour.');
});

/** DELETE /api/specialites/:id */
export const remove = asyncWrapper(async (req, res) => {
  await specialitesService.remove(Number(req.params.id));
  success(res, null, 200, 'Spécialité supprimée.');
});
