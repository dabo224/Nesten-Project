/**
 * Absences Service — logique métier. (SRP) (DIP)
 *
 * Règles métier :
 *  - dateDebut doit être antérieure à dateFin
 *  - On ne peut pas déclarer deux absences qui se chevauchent pour le même médecin
 *  - Le motif doit être l'un des trois : MALADIE, CONGES, AUTRE
 */

import * as absencesRepository from './absences.repository.js';
import AppError from '../../common/utils/AppError.js';

const MOTIFS_VALIDES = ['MALADIE', 'CONGES', 'AUTRE'];

/** Retourne toutes les absences, filtrables par médecin. */
export const getAll = (filters) => absencesRepository.findAll(filters);

/**
 * Retourne une absence par son id.
 * @throws {AppError} 404 si introuvable
 */
export const getById = async (id) => {
  const absence = await absencesRepository.findById(id);
  if (!absence) throw new AppError('Absence introuvable.', 404);
  return absence;
};

/**
 * Crée une absence après validation des règles métier.
 * @param {{ medecinId: number, dateDebut: string, dateFin: string, motif: string }} data
 * @throws {AppError} 400 si dates invalides ou motif incorrect
 * @throws {AppError} 409 si chevauchement avec une absence existante
 */
export const create = async ({ medecinId, dateDebut, dateFin, motif }) => {
  const debut = new Date(dateDebut);
  const fin   = new Date(dateFin);

  // Validation du motif
  if (!MOTIFS_VALIDES.includes(motif)) {
    throw new AppError(`Motif invalide. Valeurs acceptées : ${MOTIFS_VALIDES.join(', ')}.`, 400);
  }

  // Validation des dates
  if (debut >= fin) {
    throw new AppError('La date de début doit être antérieure à la date de fin.', 400);
  }

  // Vérification de chevauchement avec les absences existantes du même médecin
  const overlapping = await absencesRepository.findOverlapping(medecinId, debut, fin);
  if (overlapping.length > 0) {
    throw new AppError('Une absence existe déjà sur cette période pour ce médecin.', 409);
  }

  return absencesRepository.create({ medecinId, dateDebut: debut, dateFin: fin, motif });
};

/**
 * Met à jour une absence existante avec validation des règles métier.
 * @throws {AppError} 404 | 400 | 409
 */
export const update = async (id, { dateDebut, dateFin, motif }) => {
  const absence = await getById(id); // lève 404 si inexistante

  const debut = new Date(dateDebut ?? absence.dateDebut);
  const fin   = new Date(dateFin   ?? absence.dateFin);

  if (motif && !MOTIFS_VALIDES.includes(motif)) {
    throw new AppError(`Motif invalide. Valeurs acceptées : ${MOTIFS_VALIDES.join(', ')}.`, 400);
  }

  if (debut >= fin) {
    throw new AppError('La date de début doit être antérieure à la date de fin.', 400);
  }

  // Vérifie le chevauchement en excluant l'absence elle-même
  const overlapping = await absencesRepository.findOverlapping(absence.medecinId, debut, fin);
  if (overlapping.some((a) => a.id !== id)) {
    throw new AppError('Une absence existe déjà sur cette période pour ce médecin.', 409);
  }

  return absencesRepository.update(id, {
    dateDebut: debut,
    dateFin:   fin,
    ...(motif && { motif }),
  });
};

/**
 * Supprime une absence.
 * @throws {AppError} 404 si introuvable
 */
export const remove = async (id) => {
  await getById(id);
  await absencesRepository.remove(id);
};
