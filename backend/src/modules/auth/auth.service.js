/**
 * Auth Service — logique métier auth. (SRP) (DIP)
 */

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as authRepository from './auth.repository.js';
import AppError from '../../common/utils/AppError.js';

const SALT_ROUNDS = 10;

/** Génère un JWT signé avec id, email et rôle. */
const _generateToken = (user) =>
  jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

/** Supprime le hash du mot de passe avant tout renvoi HTTP. */
const _stripPassword = ({ password: _password, ...user }) => user;

/** Inscrit un nouvel utilisateur (PATIENT par défaut). */
export const register = async ({ nom, email, password }) => {
  const existing = await authRepository.findByEmail(email);
  if (existing) throw new AppError('Cet email est déjà utilisé.', 409);

  const hashed = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await authRepository.create({ nom, email, password: hashed });
  return _stripPassword(user);
};

/**
 * Authentifie un utilisateur et retourne un JWT.
 * Message d'erreur volontairement générique (sécurité).
 */
export const login = async ({ email, password }) => {
  const user = await authRepository.findByEmail(email);
  if (!user) throw new AppError('Email ou mot de passe incorrect.', 401);

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new AppError('Email ou mot de passe incorrect.', 401);

  return { token: _generateToken(user), utilisateur: _stripPassword(user) };
};

/** Retourne le profil de l'utilisateur connecté (id extrait du JWT). */
export const getMe = async (id) => {
  const user = await authRepository.findById(id);
  if (!user) throw new AppError('Utilisateur introuvable.', 404);
  return user;
};
