/**
 * Medecins Service — logique métier. (SRP) (DIP)
 */

import * as medecinRepository from './medecins.repository.js';
import AppError from '../../common/utils/AppError.js';

/**
 * Retourne tous les médecins avec filtres optionnels.
 * Les query params sont convertis en nombres avant d'arriver ici (côté controller).
 * @param {{ specialiteId?: number, centreId?: number }} filters
 */
export const getAll = (filters) => medecinRepository.findAll(filters);

/**
 * Retourne un médecin par son id avec spécialité, centre et absences.
 * @param {number} id
 * @throws {AppError} 404 si le médecin n'existe pas
 */
export const getById = async (id) => {
  const medecin = await medecinRepository.findById(id);
  if (!medecin) throw new AppError('Médecin introuvable.', 404);
  return medecin;
};

/**
 * Crée un nouveau médecin.
 * @param {{ nom: string, specialiteId: number, centreId: number }} data
 */
export const create = (data) => medecinRepository.create(data);

/**
 * Met à jour un médecin existant.
 * @param {number} id
 * @param {{ nom?: string, specialiteId?: number, centreId?: number }} data
 * @throws {AppError} 404 si le médecin n'existe pas
 */
export const update = async (id, data) => {
  await getById(id); // lève 404 si inexistant
  return medecinRepository.update(id, data);
};

/**
 * Supprime un médecin.
 * Les absences et créneaux associés sont supprimés en cascade (onDelete: Cascade).
 * @param {number} id
 * @throws {AppError} 404 si le médecin n'existe pas
 */
export const remove = async (id) => {
  await getById(id); // lève 404 si inexistant
  await medecinRepository.remove(id);
};
