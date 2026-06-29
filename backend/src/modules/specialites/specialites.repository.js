/**
 * Specialites Repository — accès DB uniquement. (SRP) (DIP)
 */

import prisma from '../../common/config/db.js';

export const findAll = () =>
  prisma.specialite.findMany({
    include: { _count: { select: { medecins: true } } },
    orderBy: { nom: 'asc' },
  });

export const findById = (id) =>
  prisma.specialite.findUnique({
    where: { id },
    include: { medecins: { include: { centre: true }, orderBy: { nom: 'asc' } } },
  });

/** Recherche par nom pour vérifier l'unicité. */
export const findByNom = (nom) =>
  prisma.specialite.findUnique({ where: { nom } });

export const create = (data) =>
  prisma.specialite.create({ data });

export const update = (id, data) =>
  prisma.specialite.update({ where: { id }, data });

export const remove = (id) =>
  prisma.specialite.delete({ where: { id } });
