/**
 * Creneaux Routes — GET public / POST PUT DELETE → ADMIN. (SRP) (OCP)
 *
 * GET /api/creneaux?medecinId=1&date=2026-08-01&estDisponible=true
 * GET /api/creneaux/:id
 * POST   /api/creneaux              → ADMIN
 * PUT    /api/creneaux/:id          → ADMIN
 * DELETE /api/creneaux/:id          → ADMIN
 */

import { Router } from 'express';
import * as creneauxController from './creneaux.controller.js';
import { authenticate, authorize } from '../../common/middleware/auth.js';

const router = Router();

// Lecture — accessible à tous (patients cherchent des créneaux disponibles)
router.get('/',       creneauxController.getAll);
router.get('/:id',    creneauxController.getById);

// Écriture — ADMIN uniquement
router.post('/',      authenticate, authorize('ADMIN'), creneauxController.create);
router.put('/:id',    authenticate, authorize('ADMIN'), creneauxController.update);
router.delete('/:id', authenticate, authorize('ADMIN'), creneauxController.remove);

export default router;
