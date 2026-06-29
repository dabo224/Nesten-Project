/**
 * Absences Routes — GET public / POST PUT DELETE → ADMIN. (SRP) (OCP)
 *
 * GET /api/absences?medecinId=1  → filtre par médecin
 * GET /api/absences/:id          → détail d'une absence
 * POST /api/absences             → créer une absence (ADMIN)
 * PUT  /api/absences/:id         → modifier une absence (ADMIN)
 * DELETE /api/absences/:id       → supprimer une absence (ADMIN)
 */

import { Router } from 'express';
import * as absencesController from './absences.controller.js';
import { authenticate, authorize } from '../../common/middleware/auth.js';

const router = Router();

// Lecture — accessible à tous
router.get('/',       absencesController.getAll);
router.get('/:id',    absencesController.getById);

// Écriture — ADMIN uniquement
router.post('/',      authenticate, authorize('ADMIN'), absencesController.create);
router.put('/:id',    authenticate, authorize('ADMIN'), absencesController.update);
router.delete('/:id', authenticate, authorize('ADMIN'), absencesController.remove);

export default router;
