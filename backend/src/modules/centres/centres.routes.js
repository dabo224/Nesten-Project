/**
 * Centres Routes — GET public / POST PUT DELETE → ADMIN. (SRP) (OCP)
 */

import { Router } from 'express';
import * as centresController from './centres.controller.js';
import { authenticate, authorize } from '../../common/middleware/auth.js';
import { validate } from '../../common/middleware/validate.js';
import { centreSchema, centreUpdateSchema } from './centres.validators.js';

const router = Router();

router.get('/',       centresController.getAll);
router.get('/:id',    centresController.getById);
router.post('/',      authenticate, authorize('ADMIN'), validate(centreSchema),       centresController.create);
router.put('/:id',    authenticate, authorize('ADMIN'), validate(centreUpdateSchema), centresController.update);
router.delete('/:id', authenticate, authorize('ADMIN'),                               centresController.remove);

export default router;
