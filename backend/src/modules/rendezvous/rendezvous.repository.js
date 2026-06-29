/**
 * RendezVous Repository — accès DB uniquement. (SRP) (DIP)
 *
 * Les opérations de réservation et d'annulation utilisent des transactions Prisma
 * pour garantir la cohérence entre les tables rendezvous et creneaux.
 */

import prisma from '../../common/config/db.js';

/** Inclut toujours le créneau complet avec le médecin pour la réponse. */
const includeComplet = {
  creneau: {
    include: {
      medecin: { include: { specialite: true, centre: true } },
    },
  },
};

/**
 * Retourne tous les rendez-vous, filtrables par statut.
 * @param {{ statut?: string }} filters
 */
export const findAll = ({ statut } = {}) =>
  prisma.rendezVous.findMany({
    where: { ...(statut && { statut }) },
    include: includeComplet,
    orderBy: { createdAt: 'desc' },
  });

/**
 * Retourne un rendez-vous par son id.
 * @param {number} id
 */
export const findById = (id) =>
  prisma.rendezVous.findUnique({
    where: { id },
    include: includeComplet,
  });

/**
 * Retourne tous les rendez-vous d'un utilisateur donné.
 * @param {number} utilisateurId
 */
export const findByUser = (utilisateurId) =>
  prisma.rendezVous.findMany({
    where: { utilisateurId },
    include: includeComplet,
    orderBy: { createdAt: 'desc' },
  });

/**
 * Réserve un créneau : crée le rendez-vous ET passe estDisponible à false.
 * Opération atomique via transaction Prisma.
 *
 * @param {{ creneauId: number, utilisateurId: number, patientNom: string, patientContact: string }} data
 */
export const book = ({ creneauId, utilisateurId, patientNom, patientContact }) =>
  prisma.$transaction(async (tx) => {
    // 1. Crée le rendez-vous
    const rdv = await tx.rendezVous.create({
      data: { creneauId, utilisateurId, patientNom, patientContact },
      include: includeComplet,
    });
    // 2. Marque le créneau comme indisponible
    await tx.creneau.update({
      where: { id: creneauId },
      data:  { estDisponible: false },
    });
    return rdv;
  });

/**
 * Annule un rendez-vous : passe statut à ANNULE ET remet estDisponible à true.
 * Opération atomique via transaction Prisma.
 *
 * @param {number} id         - id du rendez-vous
 * @param {number} creneauId  - id du créneau à libérer
 */
export const cancel = (id, creneauId) =>
  prisma.$transaction(async (tx) => {
    // 1. Passe le statut en ANNULE
    const rdv = await tx.rendezVous.update({
      where: { id },
      data:  { statut: 'ANNULE' },
      include: includeComplet,
    });
    // 2. Libère le créneau
    await tx.creneau.update({
      where: { id: creneauId },
      data:  { estDisponible: true },
    });
    return rdv;
  });

/** Suppression définitive (ADMIN uniquement). */
export const remove = (id) =>
  prisma.rendezVous.delete({ where: { id } });
