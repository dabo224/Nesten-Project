/**
 * Centres Repository — accès DB uniquement. (SRP) (DIP)
 */

import prisma from '../../common/config/db.js';

/** Retourne tous les centres avec le nombre de médecins associés. */
export const findAll = () =>
  prisma.centre.findMany({
    include: { _count: { select: { medecins: true } } },
    orderBy: { nom: 'asc' },
  });

/** Retourne un centre par id avec la liste de ses médecins et leur spécialité. */
export const findById = (id) =>
  prisma.centre.findUnique({
    where: { id },
    include: { medecins: { include: { specialite: true }, orderBy: { nom: 'asc' } } },
  });

/** Crée un nouveau centre médical. */
export const create = (data) =>
  prisma.centre.create({ data });

/** Met à jour un centre existant. */
export const update = (id, data) =>
  prisma.centre.update({ where: { id }, data });

/** Supprime un centre par son id. */
export const remove = (id) =>
  prisma.centre.delete({ where: { id } });
