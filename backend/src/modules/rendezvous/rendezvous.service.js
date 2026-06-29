/**
 * RendezVous Service — logique métier. (SRP) (DIP)
 *
 * Règles métier :
 *  - Un créneau doit exister et être disponible (estDisponible = true) pour être réservé
 *  - On ne peut pas annuler un rendez-vous déjà annulé
 *  - La réservation et l'annulation mettent à jour estDisponible du créneau (via transaction)
 */

import * as rendezvousRepository from './rendezvous.repository.js';
import * as creneauxRepository    from '../creneaux/creneaux.repository.js';
import AppError from '../../common/utils/AppError.js';

/** Retourne tous les rendez-vous (ADMIN). */
export const getAll = (filters) => rendezvousRepository.findAll(filters);

/** Retourne les rendez-vous de l'utilisateur connecté. */
export const getMyRdvs = (utilisateurId) => rendezvousRepository.findByUser(utilisateurId);

/**
 * Retourne un rendez-vous par son id.
 * @throws {AppError} 404 si introuvable
 */
export const getById = async (id) => {
  const rdv = await rendezvousRepository.findById(id);
  if (!rdv) throw new AppError('Rendez-vous introuvable.', 404);
  return rdv;
};

/**
 * Réserve un créneau pour un patient.
 * @param {{ creneauId: number, utilisateurId: number, patientNom: string, patientContact: string }} data
 * @throws {AppError} 404 si créneau inexistant
 * @throws {AppError} 409 si créneau déjà pris ou indisponible
 */
export const book = async ({ creneauId, utilisateurId, patientNom, patientContact }) => {
  const creneau = await creneauxRepository.findById(creneauId);
  if (!creneau) throw new AppError('Créneau introuvable.', 404);

  if (!creneau.estDisponible) {
    throw new AppError('Ce créneau n\'est plus disponible.', 409);
  }

  return rendezvousRepository.book({ creneauId, utilisateurId, patientNom, patientContact });
};

/**
 * Annule un rendez-vous existant et libère le créneau.
 * @throws {AppError} 404 si introuvable
 * @throws {AppError} 409 si déjà annulé
 */
export const cancel = async (id) => {
  const rdv = await getById(id);

  if (rdv.statut === 'ANNULE') {
    throw new AppError('Ce rendez-vous est déjà annulé.', 409);
  }

  return rendezvousRepository.cancel(id, rdv.creneau.id);
};

/**
 * Supprime définitivement un rendez-vous (ADMIN).
 * @throws {AppError} 404 si introuvable
 */
export const remove = async (id) => {
  await getById(id);
  await rendezvousRepository.remove(id);
};
