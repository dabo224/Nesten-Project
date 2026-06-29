/**
 * Centres Service — logique métier. (SRP) (DIP)
 */

import * as centresRepository from './centres.repository.js';
import AppError from '../../common/utils/AppError.js';

export const getAll = () => centresRepository.findAll();

export const getById = async (id) => {
  const centre = await centresRepository.findById(id);
  if (!centre) throw new AppError('Centre introuvable.', 404);
  return centre;
};

export const create = (data) => centresRepository.create(data);

export const update = async (id, data) => {
  await getById(id);
  return centresRepository.update(id, data);
};

/** Prisma lèvera une erreur si des médecins sont encore rattachés (FK RESTRICT). */
export const remove = async (id) => {
  await getById(id);
  await centresRepository.remove(id);
};
