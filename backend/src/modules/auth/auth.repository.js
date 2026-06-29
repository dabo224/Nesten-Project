/**
 * Auth Repository — accès DB uniquement, aucune logique métier. (SRP) (DIP)
 */

import prisma from '../../common/config/db.js';

/** Recherche un utilisateur par email. */
export const findByEmail = (email) =>
  prisma.utilisateur.findUnique({ where: { email } });

/** Recherche un utilisateur par id sans exposer le mot de passe. */
export const findById = (id) =>
  prisma.utilisateur.findUnique({
    where: { id },
    select: { id: true, nom: true, email: true, role: true, createdAt: true },
  });

/** Crée un nouvel utilisateur. */
export const create = (data) =>
  prisma.utilisateur.create({ data });
