-- ─── Utilisateurs ────────────────────────────────────────────────────────────
-- Les mots de passe sont des hash bcrypt de "Password123!"

INSERT INTO "utilisateurs" ("nom", "email", "password", "role", "updated_at") VALUES
  ('Super Admin',    'admin@nesten.ma',   '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ADMIN',   NOW()),
  ('Admin Clinique', 'admin2@nesten.ma',  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ADMIN',   NOW()),
  ('Mohammed Amrani','patient1@email.ma', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'PATIENT', NOW()),
  ('Fatima Zohra',   'patient2@email.ma', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'PATIENT', NOW());

-- ─── Centres médicaux ────────────────────────────────────────────────────────

INSERT INTO "centres" ("nom", "adresse", "contact", "updated_at") VALUES
  ('Clinique du Centre',    '12 Avenue Hassan II, Casablanca',    '+212 522 000 001', NOW()),
  ('Polyclinique Atlas',    '45 Rue Ibn Sina, Rabat',             '+212 537 000 002', NOW()),
  ('Centre Médical Anfa',   '8 Boulevard d''Anfa, Casablanca',    '+212 522 000 003', NOW());

-- ─── Spécialités ─────────────────────────────────────────────────────────────

INSERT INTO "specialites" ("nom") VALUES
  ('Cardiologie'),
  ('Pédiatrie'),
  ('Dermatologie'),
  ('Médecine générale'),
  ('Ophtalmologie');

-- ─── Médecins ────────────────────────────────────────────────────────────────

INSERT INTO "medecins" ("nom", "specialite_id", "centre_id", "updated_at") VALUES
  ('Dr. Karim Alaoui',    1, 1, NOW()),  -- Cardiologue / Clinique du Centre
  ('Dr. Sara Benali',     2, 1, NOW()),  -- Pédiatre   / Clinique du Centre
  ('Dr. Youssef Tahiri',  3, 2, NOW()),  -- Dermatologue / Polyclinique Atlas
  ('Dr. Nadia Chraibi',   4, 2, NOW()),  -- Médecin généraliste / Polyclinique Atlas
  ('Dr. Hassan Idrissi',  5, 3, NOW()),  -- Ophtalmologue / Centre Médical Anfa
  ('Dr. Leila Mansouri',  1, 3, NOW());  -- Cardiologue / Centre Médical Anfa

-- ─── Absences ─────────────────────────────────────────────────────────────────

INSERT INTO "absences" ("medecin_id", "date_debut", "date_fin", "motif") VALUES
  (1, '2026-07-01 00:00:00+00', '2026-07-05 23:59:59+00', 'CONGES'),
  (3, '2026-07-03 00:00:00+00', '2026-07-03 23:59:59+00', 'MALADIE');

-- ─── Créneaux horaires ────────────────────────────────────────────────────────
-- Dr. Karim Alaoui (id=1) — disponible sauf 1-5 juillet

INSERT INTO "creneaux" ("medecin_id", "date_heure", "duree_minutes") VALUES
  (1, '2026-06-30 09:00:00+00', 30),
  (1, '2026-06-30 09:30:00+00', 30),
  (1, '2026-06-30 10:00:00+00', 30),
  (1, '2026-07-06 09:00:00+00', 30),  -- après congés
  (1, '2026-07-06 09:30:00+00', 30);

-- Dr. Sara Benali (id=2)
INSERT INTO "creneaux" ("medecin_id", "date_heure", "duree_minutes") VALUES
  (2, '2026-06-30 14:00:00+00', 30),
  (2, '2026-06-30 14:30:00+00', 30),
  (2, '2026-07-01 14:00:00+00', 30);

-- Dr. Youssef Tahiri (id=3) — absent le 3 juillet
INSERT INTO "creneaux" ("medecin_id", "date_heure", "duree_minutes") VALUES
  (3, '2026-07-02 10:00:00+00', 30),
  (3, '2026-07-04 10:00:00+00', 30);  -- après maladie

-- Dr. Nadia Chraibi (id=4)
INSERT INTO "creneaux" ("medecin_id", "date_heure", "duree_minutes") VALUES
  (4, '2026-06-30 08:00:00+00', 30),
  (4, '2026-06-30 08:30:00+00', 30),
  (4, '2026-07-01 08:00:00+00', 30);

-- ─── Rendez-vous exemple ──────────────────────────────────────────────────────

INSERT INTO "rendez_vous" ("creneau_id", "patient_nom", "patient_contact", "statut") VALUES
  (1, 'Mohammed Amrani',  '+212 661 000 010', 'CONFIRME'),
  (6, 'Fatima Zohra',     '+212 662 000 011', 'CONFIRME'),
  (9, 'Omar Benjelloun',  '+212 663 000 012', 'ANNULE');

-- Marquer les créneaux pris comme non disponibles
UPDATE "creneaux" SET "est_disponible" = false WHERE "id" IN (1, 6, 9);
