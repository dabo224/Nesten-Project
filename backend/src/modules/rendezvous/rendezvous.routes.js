/**
 * RendezVous Routes. (SRP) (OCP)
 *
 * GET    /api/rendezvous              → ADMIN (liste tous)
 * GET    /api/rendezvous/mine         → authentifié (ses propres RDV)
 * GET    /api/rendezvous/:id          → authentifié
 * POST   /api/rendezvous              → authentifié (PATIENT ou ADMIN)
 * PATCH  /api/rendezvous/:id/annuler  → authentifié (PATIENT ou ADMIN)
 * DELETE /api/rendezvous/:id          → ADMIN (suppression définitive)
 */

import { Router } from 'express';
import * as rendezvousController from './rendezvous.controller.js';
import { authenticate, authorize } from '../../common/middleware/auth.js';

const router = Router();

// Liste complète — ADMIN uniquement
router.get('/',      authenticate, authorize('ADMIN'), rendezvousController.getAll);

// Mes rendez-vous — utilisateur connecté (DOIT être avant /:id)
router.get('/mine',  authenticate, rendezvousController.getMyRdvs);

// Détail — tout utilisateur authentifié
router.get('/:id',   authenticate, rendezvousController.getById);

// Réservation — tout utilisateur authentifié (PATIENT ou ADMIN)
router.post('/',   authenticate, rendezvousController.book);

// Annulation — tout utilisateur authentifié
router.patch('/:id/annuler', authenticate, rendezvousController.cancel);

// Suppression définitive — ADMIN uniquement
router.delete('/:id', authenticate, authorize('ADMIN'), rendezvousController.remove);

export default router;
