/**
 * Auth Routes (SRP) (OCP)
 * GET /me → protégé | POST /register & /login → public
 */

import { Router } from 'express';
import * as authController from './auth.controller.js';
import { authenticate } from '../../common/middleware/auth.js';
import { validate } from '../../common/middleware/validate.js';
import { registerSchema, loginSchema } from './auth.validators.js';

const router = Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login',    validate(loginSchema),    authController.login);
router.get('/me',        authenticate,             authController.getMe);

export default router;
