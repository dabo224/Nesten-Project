import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import notFound    from './common/middleware/notFound.js';
import errorHandler from './common/middleware/errorHandler.js';

import authRoutes        from './modules/auth/auth.routes.js';
import centresRoutes     from './modules/centres/centres.routes.js';
import specialitesRoutes from './modules/specialites/specialites.routes.js';
import medecinRoutes     from './modules/medecins/medecins.routes.js';
import absencesRoutes    from './modules/absences/absences.routes.js';
import creneauxRoutes    from './modules/creneaux/creneaux.routes.js';
import rendezvousRoutes  from './modules/rendezvous/rendezvous.routes.js';

const app = express();

// Masque l'en-tête X-Powered-By pour ne pas divulguer la version d'Express
app.disable('x-powered-by');

// ─── Middleware globaux ───────────────────────────────────────────────────────
app.use(cors({
  origin: [
    'http://localhost:4200',
    'http://localhost:3000',
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Santé de l'API ──────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'API opérationnelle.' });
});

// ─── Routes des modules ───────────────────────────────────────────────────────
app.use('/api/auth',        authRoutes);
app.use('/api/centres',     centresRoutes);
app.use('/api/specialites', specialitesRoutes);
app.use('/api/medecins',    medecinRoutes);
app.use('/api/absences',    absencesRoutes);
app.use('/api/creneaux',    creneauxRoutes);
app.use('/api/rendezvous',  rendezvousRoutes);

// ─── Handlers globaux (toujours en dernier) ───────────────────────────────────
app.use(notFound);
app.use(errorHandler);

export default app;
