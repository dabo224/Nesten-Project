/**
 * Creneaux Service — logique métier. (SRP) (DIP)
 *
 * Règles métier :
 *  - Le médecin ne doit pas être absent sur la plage du créneau
 *  - Deux créneaux du même médecin ne peuvent pas se chevaucher
 *  - Un créneau avec un rendez-vous associé ne peut pas être supprimé
 *  - La durée doit être > 0
 */

import * as creneauxRepository from './creneaux.repository.js';
import * as absencesRepository  from '../absences/absences.repository.js';
import AppError from '../../common/utils/AppError.js';

/** Retourne tous les créneaux, filtrables par médecin, date, disponibilité. */
export const getAll = (filters) => creneauxRepository.findAll(filters);

/**
 * Retourne un créneau par son id.
 * @throws {AppError} 404 si introuvable
 */
export const getById = async (id) => {
  const creneau = await creneauxRepository.findById(id);
  if (!creneau) throw new AppError('Créneau introuvable.', 404);
  return creneau;
};

/**
 * Crée un créneau après validation des règles métier.
 * @param {{ medecinId: number, dateHeure: string, dureeMinutes?: number }} data
 * @throws {AppError} 400 si durée invalide
 * @throws {AppError} 409 si absence ou chevauchement détecté
 */
export const create = async ({ medecinId, dateHeure, dureeMinutes = 30 }) => {
  if (dureeMinutes <= 0) {
    throw new AppError('La durée du créneau doit être supérieure à 0 minute.', 400);
  }

  const debut = new Date(dateHeure);
  const fin   = new Date(debut.getTime() + dureeMinutes * 60_000);

  // Règle 1 : le médecin ne doit pas être absent sur cette plage
  const absences = await absencesRepository.findOverlapping(medecinId, debut, fin);
  if (absences.length > 0) {
    throw new AppError('Le médecin est en absence sur ce créneau.', 409);
  }

  // Règle 2 : pas de chevauchement avec d'autres créneaux du même médecin
  const overlapping = await creneauxRepository.findOverlapping(medecinId, debut, dureeMinutes);
  if (overlapping.length > 0) {
    throw new AppError('Ce créneau chevauche un créneau existant pour ce médecin.', 409);
  }

  return creneauxRepository.create({ medecinId, dateHeure: debut, dureeMinutes });
};

/**
 * Met à jour un créneau en respectant les règles métier.
 * @throws {AppError} 404 | 400 | 409
 */
export const update = async (id, { dateHeure, dureeMinutes }) => {
  const creneau = await getById(id); // lève 404 si inexistant

  const newDate     = dateHeure    ? new Date(dateHeure)    : creneau.dateHeure;
  const newDuree    = dureeMinutes ?? creneau.dureeMinutes;

  if (newDuree <= 0) {
    throw new AppError('La durée du créneau doit être supérieure à 0 minute.', 400);
  }

  const fin = new Date(newDate.getTime() + newDuree * 60_000);

  // Règle 1 : vérification absence (avec nouvelles valeurs)
  const absences = await absencesRepository.findOverlapping(creneau.medecinId, newDate, fin);
  if (absences.length > 0) {
    throw new AppError('Le médecin est en absence sur ce créneau.', 409);
  }

  // Règle 2 : chevauchement en excluant le créneau lui-même
  const overlapping = await creneauxRepository.findOverlapping(creneau.medecinId, newDate, newDuree);
  if (overlapping.some((c) => c.id !== id)) {
    throw new AppError('Ce créneau chevauche un créneau existant pour ce médecin.', 409);
  }

  return creneauxRepository.update(id, {
    ...(dateHeure    && { dateHeure: newDate }),
    ...(dureeMinutes && { dureeMinutes: newDuree }),
  });
};

/**
 * Supprime un créneau.
 * @throws {AppError} 404 si introuvable
 * @throws {AppError} 409 si un rendez-vous est associé
 */
export const remove = async (id) => {
  const creneau = await getById(id);

  // Règle 3 : on ne peut pas supprimer un créneau réservé
  if (creneau.rendezVous) {
    throw new AppError(
      'Impossible de supprimer un créneau avec un rendez-vous associé. Annulez le rendez-vous d\'abord.',
      409
    );
  }

  await creneauxRepository.remove(id);
};
