/**
 * RendezVous Controller — liaison HTTP ↔ service. (SRP) (DIP)
 */

import asyncWrapper from '../../common/utils/asyncWrapper.js';
import * as rendezvousService from './rendezvous.service.js';
import { success } from '../../common/utils/apiResponse.js';

/** GET /api/rendezvous?statut=CONFIRME */
export const getAll = asyncWrapper(async (req, res) => {
  const { statut } = req.query;
  const rdvs = await rendezvousService.getAll({ ...(statut && { statut }) });
  success(res, rdvs);
});

/** GET /api/rendezvous/mine */
export const getMyRdvs = asyncWrapper(async (req, res) => {
  const rdvs = await rendezvousService.getMyRdvs(req.user.id);
  success(res, rdvs);
});

/** GET /api/rendezvous/:id */
export const getById = asyncWrapper(async (req, res) => {
  const rdv = await rendezvousService.getById(Number(req.params.id));
  success(res, rdv);
});

/**
 * POST /api/rendezvous
 * Body : { creneauId, patientNom, patientContact }
 */
export const book = asyncWrapper(async (req, res) => {
  const { creneauId, patientNom, patientContact } = req.body;
  const rdv = await rendezvousService.book({
    creneauId: Number(creneauId),
    utilisateurId: req.user.id,
    patientNom,
    patientContact,
  });
  success(res, rdv, 201, 'Rendez-vous confirmé.');
});

/** PATCH /api/rendezvous/:id/annuler */
export const cancel = asyncWrapper(async (req, res) => {
  const rdv = await rendezvousService.cancel(Number(req.params.id));
  success(res, rdv, 200, 'Rendez-vous annulé.');
});

/** DELETE /api/rendezvous/:id — ADMIN */
export const remove = asyncWrapper(async (req, res) => {
  await rendezvousService.remove(Number(req.params.id));
  success(res, null, 200, 'Rendez-vous supprimé.');
});
