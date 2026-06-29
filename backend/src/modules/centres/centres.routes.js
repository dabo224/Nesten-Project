/**
 * Centres Routes — GET public / POST PUT DELETE → ADMIN. (SRP) (OCP)
 */

import { Router } from 'express';
import * as centresController from './centres.controller.js';
import { authenticate, authorize } from '../../common/middleware/auth.js';

const router = Router();

router.get('/',       centresController.getAll);
router.get('/:id',    centresController.getById);
router.post('/',      authenticate, authorize('ADMIN'), centresController.create);
router.put('/:id',    authenticate, authorize('ADMIN'), centresController.update);
router.delete('/:id', authenticate, authorize('ADMIN'), centresController.remove);

export default router;
