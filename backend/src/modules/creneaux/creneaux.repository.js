/**
 * Creneaux Repository — accès DB uniquement. (SRP) (DIP)
 */

import prisma from '../../common/config/db.js';

/**
 * Retourne tous les créneaux avec filtres optionnels.
 * @param {{ medecinId?: number, date?: string, estDisponible?: boolean }} filters
 */
export const findAll = ({ medecinId, date, estDisponible } = {}) => {
  const where = {};
  if (medecinId)            where.medecinId     = medecinId;
  if (estDisponible !== undefined) where.estDisponible = estDisponible;
  if (date) {
    const debut = new Date(date);
    debut.setHours(0, 0, 0, 0);
    const fin = new Date(date);
    fin.setHours(23, 59, 59, 999);
    where.dateHeure = { gte: debut, lte: fin };
  }

  return prisma.creneau.findMany({
    where,
    include: {
      medecin:   { include: { specialite: true, centre: true } },
      rendezVous: true,
    },
    orderBy: { dateHeure: 'asc' },
  });
};

/**
 * Retourne un créneau par son id avec médecin et rendez-vous associé.
 * @param {number} id
 */
export const findById = (id) =>
  prisma.creneau.findUnique({
    where: { id },
    include: {
      medecin:   { include: { specialite: true, centre: true } },
      rendezVous: true,
    },
  });

/**
 * Détecte les créneaux existants d'un médecin qui chevauchent la nouvelle plage.
 * Implémente la logique : existant.début < nouveau.fin ET existant.fin > nouveau.début.
 * La fin d'un créneau est calculée côté JS car Prisma ne supporte pas l'arithmétique de date.
 *
 * @param {number} medecinId
 * @param {Date}   dateHeure   - début du nouveau créneau
 * @param {number} dureeMinutes
 */
export const findOverlapping = async (medecinId, dateHeure, dureeMinutes) => {
  const newStart = new Date(dateHeure);
  const newEnd   = new Date(dateHeure.getTime() + dureeMinutes * 60_000);

  // On récupère les créneaux dont le début est avant la fin du nouveau
  const candidats = await prisma.creneau.findMany({
    where: { medecinId, dateHeure: { lt: newEnd } },
  });

  // On filtre ceux dont la fin dépasse le début du nouveau (chevauchement réel)
  return candidats.filter((c) => {
    const existingEnd = new Date(c.dateHeure.getTime() + c.dureeMinutes * 60_000);
    return existingEnd > newStart;
  });
};

/** Crée un nouveau créneau. */
export const create = (data) =>
  prisma.creneau.create({
    data,
    include: {
      medecin: { include: { specialite: true, centre: true } },
    },
  });

/** Met à jour un créneau existant. */
export const update = (id, data) =>
  prisma.creneau.update({
    where: { id },
    data,
    include: {
      medecin:    { include: { specialite: true, centre: true } },
      rendezVous: true,
    },
  });

/** Supprime un créneau par son id. */
export const remove = (id) =>
  prisma.creneau.delete({ where: { id } });
