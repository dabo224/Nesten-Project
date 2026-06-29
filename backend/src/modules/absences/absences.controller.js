/**
 * Absences Controller — liaison HTTP ↔ service. (SRP) (DIP)
 *
 * Chaque handler délègue la logique au service et formate la réponse HTTP.
 * asyncWrapper capture les erreurs async et les transmet au middleware errorHandler.
 */

import asyncWrapper from '../../common/utils/asyncWrapper.js';
import * as absencesService from './absences.service.js';
import { success } from '../../common/utils/apiResponse.js';

/** GET /api/absences?medecinId=1 */
export const getAll = asyncWrapper(async (req, res) => {
  const medecinId = req.query.medecinId ? Number(req.query.medecinId) : undefined;
  const absences = await absencesService.getAll({ medecinId });
  success(res, absences);
});

/** GET /api/absences/:id */
export const getById = asyncWrapper(async (req, res) => {
  const absence = await absencesService.getById(Number(req.params.id));
  success(res, absence);
});

/** POST /api/absences */
export const create = asyncWrapper(async (req, res) => {
  const { medecinId, dateDebut, dateFin, motif } = req.body;
  const absence = await absencesService.create({
    medecinId: Number(medecinId),
    dateDebut,
    dateFin,
    motif,
  });
  success(res, absence, 201, 'Absence créée avec succès.');
});

/** PUT /api/absences/:id */
export const update = asyncWrapper(async (req, res) => {
  const { dateDebut, dateFin, motif } = req.body;
  const absence = await absencesService.update(Number(req.params.id), {
    dateDebut,
    dateFin,
    motif,
  });
  success(res, absence, 200, 'Absence mise à jour.');
});

/** DELETE /api/absences/:id */
export const remove = asyncWrapper(async (req, res) => {
  await absencesService.remove(Number(req.params.id));
  success(res, null, 200, 'Absence supprimée.');
});
