/**
 * Specialites Routes — GET public / POST PUT DELETE → ADMIN. (SRP) (OCP)
 */

import { Router } from 'express';
import * as specialitesController from './specialites.controller.js';
import { authenticate, authorize } from '../../common/middleware/auth.js';
import { validate } from '../../common/middleware/validate.js';
import { specialiteSchema, specialiteUpdateSchema } from './specialites.validators.js';

const router = Router();

router.get('/',       specialitesController.getAll);
router.get('/:id',    specialitesController.getById);
router.post('/',      authenticate, authorize('ADMIN'), validate(specialiteSchema),       specialitesController.create);
router.put('/:id',    authenticate, authorize('ADMIN'), validate(specialiteUpdateSchema), specialitesController.update);
router.delete('/:id', authenticate, authorize('ADMIN'),                                   specialitesController.remove);

export default router;
