/**
 * Centres Controller — pont HTTP/service. (SRP)
 */

import * as centresService from './centres.service.js';
import asyncWrapper from '../../common/utils/asyncWrapper.js';
import { success } from '../../common/utils/apiResponse.js';

/** GET /api/centres */
export const getAll = asyncWrapper(async (req, res) => {
  const centres = await centresService.getAll();
  success(res, centres, 200, 'Centres récupérés.');
});

/** GET /api/centres/:id */
export const getById = asyncWrapper(async (req, res) => {
  const centre = await centresService.getById(Number(req.params.id));
  success(res, centre, 200, 'Centre récupéré.');
});

/** POST /api/centres — Body : { nom, adresse, contact } */
export const create = asyncWrapper(async (req, res) => {
  const centre = await centresService.create(req.body);
  success(res, centre, 201, 'Centre créé avec succès.');
});

/** PUT /api/centres/:id — Body : { nom?, adresse?, contact? } */
export const update = asyncWrapper(async (req, res) => {
  const centre = await centresService.update(Number(req.params.id), req.body);
  success(res, centre, 200, 'Centre mis à jour.');
});

/** DELETE /api/centres/:id */
export const remove = asyncWrapper(async (req, res) => {
  await centresService.remove(Number(req.params.id));
  success(res, null, 200, 'Centre supprimé.');
});
