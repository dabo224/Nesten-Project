import AppError from '../utils/AppError.js';

/**
 * Middleware de validation Zod.
 * Valide req.body contre le schéma fourni ; en cas d'échec renvoie 422
 * avec un message lisible listant toutes les erreurs séparées par " | ".
 * En cas de succès, req.body est remplacé par la valeur parsée (trimée, coercée…).
 */
export const validate = (schema) => (req, _res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const message = result.error.errors.map((e) => e.message).join(' | ');
    return next(new AppError(message, 422));
  }

  req.body = result.data;
  next();
};
