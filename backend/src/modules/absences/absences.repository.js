/**
 * Absences Repository — accès DB uniquement. (SRP) (DIP)
 */

import prisma from '../../common/config/db.js';

/**
 * Retourne toutes les absences avec filtre optionnel par médecin.
 * @param {{ medecinId?: number }} filters
 */
export const findAll = ({ medecinId } = {}) =>
  prisma.absence.findMany({
    where: { ...(medecinId && { medecinId }) },
    include: {
      medecin: {
        include: { specialite: true, centre: true },
      },
    },
    orderBy: { dateDebut: 'asc' },
  });

/**
 * Retourne une absence par son id.
 * @param {number} id
 */
export const findById = (id) =>
  prisma.absence.findUnique({
    where: { id },
    include: {
      medecin: { include: { specialite: true, centre: true } },
    },
  });

/**
 * Retourne toutes les absences d'un médecin sur une période donnée.
 * Utilisé par le service créneaux pour vérifier la disponibilité.
 * @param {number} medecinId
 * @param {Date} dateDebut
 * @param {Date} dateFin
 */
export const findOverlapping = (medecinId, dateDebut, dateFin) =>
  prisma.absence.findMany({
    where: {
      medecinId,
      dateDebut: { lte: dateFin },
      dateFin:   { gte: dateDebut },
    },
  });

/** Crée une nouvelle absence. */
export const create = (data) =>
  prisma.absence.create({
    data,
    include: { medecin: true },
  });

/** Met à jour une absence existante. */
export const update = (id, data) =>
  prisma.absence.update({
    where: { id },
    data,
    include: { medecin: true },
  });

/** Supprime une absence par son id. */
export const remove = (id) =>
  prisma.absence.delete({ where: { id } });
