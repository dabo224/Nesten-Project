/**
 * Auth Routes (SRP) (OCP)
 * GET /me → protégé | POST /register & /login → public
 */

import { Router } from 'express';
import * as authController from './auth.controller.js';
import { authenticate } from '../../common/middleware/auth.js';

const router = Router();

router.post('/register', authController.register);
router.post('/login',    authController.login);
router.get('/me',        authenticate, authController.getMe);

export default router;
