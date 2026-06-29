/**
 * Medecins Repository — accès DB uniquement. (SRP) (DIP)
 */

import prisma from '../../common/config/db.js';

/**
 * Retourne tous les médecins avec filtres optionnels par spécialité et/ou centre.
 * Les filtres undefined sont ignorés par Prisma (pas de clause WHERE inutile).
 * @param {{ specialiteId?: number, centreId?: number }} filters
 */
export const findAll = ({ specialiteId, centreId } = {}) =>
  prisma.medecin.findMany({
    where: {
      ...(specialiteId && { specialiteId }),
      ...(centreId    && { centreId }),
    },
    include: {
      specialite: true,
      centre:     true,
    },
    orderBy: { nom: 'asc' },
  });

/**
 * Retourne un médecin par id avec spécialité, centre et absences.
 * @param {number} id
 */
export const findById = (id) =>
  prisma.medecin.findUnique({
    where: { id },
    include: {
      specialite: true,
      centre:     true,
      absences:   { orderBy: { dateDebut: 'asc' } },
    },
  });

/** Crée un nouveau médecin. */
export const create = (data) =>
  prisma.medecin.create({
    data,
    include: { specialite: true, centre: true },
  });

/** Met à jour un médecin existant. */
export const update = (id, data) =>
  prisma.medecin.update({
    where: { id },
    data,
    include: { specialite: true, centre: true },
  });

/** Supprime un médecin par son id. */
export const remove = (id) =>
  prisma.medecin.delete({ where: { id } });
