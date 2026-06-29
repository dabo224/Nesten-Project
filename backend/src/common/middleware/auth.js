import jwt from 'jsonwebtoken';
import AppError from '../utils/AppError.js';
import asyncWrapper from '../utils/asyncWrapper.js';

// ISP : deux middlewares distincts — authentification et autorisation séparées

/**
 * Vérifie que le token JWT est valide et attache req.user.
 */
export const authenticate = asyncWrapper((req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    throw new AppError('Token manquant ou invalide.', 401);
  }

  const token = authHeader.split(' ')[1];

  // jwt.verify() lance JsonWebTokenError ou TokenExpiredError → on les convertit en AppError 401
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw new AppError('Token invalide ou expiré.', 401);
  }

  req.user = decoded;
  next();
});

/**
 * Vérifie que l'utilisateur connecté possède l'un des rôles autorisés.
 */
export const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(new AppError('Accès refusé : permissions insuffisantes.', 403));
  }
  next();
};
