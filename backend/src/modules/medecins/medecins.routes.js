/**
 * Medecins Routes — GET public / POST PUT DELETE → ADMIN. (SRP) (OCP)
 *
 * GET /api/medecins?specialiteId=1&centreId=2  → filtre combinable
 * GET /api/medecins/:id                        → détail + absences
 */

import { Router } from 'express';
import * as medecinController from './medecins.controller.js';
import { authenticate, authorize } from '../../common/middleware/auth.js';

const router = Router();

// Lecture — accessible à tous
router.get('/',       medecinController.getAll);
router.get('/:id',    medecinController.getById);

// Écriture — ADMIN uniquement
router.post('/',      authenticate, authorize('ADMIN'), medecinController.create);
router.put('/:id',    authenticate, authorize('ADMIN'), medecinController.update);
router.delete('/:id', authenticate, authorize('ADMIN'), medecinController.remove);

export default router;
