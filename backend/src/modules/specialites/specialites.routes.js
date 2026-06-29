/**
 * Specialites Routes — GET public / POST PUT DELETE → ADMIN. (SRP) (OCP)
 */

import { Router } from 'express';
import * as specialitesController from './specialites.controller.js';
import { authenticate, authorize } from '../../common/middleware/auth.js';

const router = Router();

router.get('/',       specialitesController.getAll);
router.get('/:id',    specialitesController.getById);
router.post('/',      authenticate, authorize('ADMIN'), specialitesController.create);
router.put('/:id',    authenticate, authorize('ADMIN'), specialitesController.update);
router.delete('/:id', authenticate, authorize('ADMIN'), specialitesController.remove);

export default router;
