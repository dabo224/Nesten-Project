/**
 * Auth Controller — pont HTTP/service, aucune logique métier. (SRP)
 */

import * as authService from './auth.service.js';
import asyncWrapper from '../../common/utils/asyncWrapper.js';
import { success } from '../../common/utils/apiResponse.js';

/** POST /api/auth/register — Body : { nom, email, password } */
export const register = asyncWrapper(async (req, res) => {
  const user = await authService.register(req.body);
  success(res, user, 201, 'Compte créé avec succès.');
});

/** POST /api/auth/login — Body : { email, password } */
export const login = asyncWrapper(async (req, res) => {
  const data = await authService.login(req.body);
  success(res, data, 200, 'Connexion réussie.');
});

/** GET /api/auth/me — Bearer token requis */
export const getMe = asyncWrapper(async (req, res) => {
  const user = await authService.getMe(req.user.id);
  success(res, user, 200, 'Profil récupéré.');
});
