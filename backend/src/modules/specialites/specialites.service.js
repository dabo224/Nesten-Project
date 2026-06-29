/**
 * Specialites Service — logique métier. (SRP) (DIP)
 */

import * as specialitesRepository from './specialites.repository.js';
import AppError from '../../common/utils/AppError.js';

export const getAll = () => specialitesRepository.findAll();

export const getById = async (id) => {
  const specialite = await specialitesRepository.findById(id);
  if (!specialite) throw new AppError('Spécialité introuvable.', 404);
  return specialite;
};

/** Vérifie l'unicité du nom avant insertion. */
export const create = async ({ nom }) => {
  const existing = await specialitesRepository.findByNom(nom);
  if (existing) throw new AppError(`La spécialité "${nom}" existe déjà.`, 409);
  return specialitesRepository.create({ nom });
};

/** Vérifie l'existence et l'unicité du nouveau nom. */
export const update = async (id, { nom }) => {
  await getById(id);
  const existing = await specialitesRepository.findByNom(nom);
  if (existing && existing.id !== id) {
    throw new AppError(`La spécialité "${nom}" existe déjà.`, 409);
  }
  return specialitesRepository.update(id, { nom });
};

/** Prisma lèvera une erreur si des médecins sont rattachés (FK RESTRICT). */
export const remove = async (id) => {
  await getById(id);
  await specialitesRepository.remove(id);
};
