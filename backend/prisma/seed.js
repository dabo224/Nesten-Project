/**
 * Script de seed Prisma — peuple la base avec des données de test.
 * Exécution : npx prisma db seed
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Démarrage du seed...');

  const passwordHash = await bcrypt.hash('Password123!', 10);

  await Promise.all([
    prisma.utilisateur.upsert({ where: { email: 'admin@nesten.ma' },    update: {}, create: { nom: 'Super Admin',    email: 'admin@nesten.ma',    password: passwordHash, role: 'ADMIN' } }),
    prisma.utilisateur.upsert({ where: { email: 'patient1@email.ma' },  update: {}, create: { nom: 'Mohammed Amrani', email: 'patient1@email.ma',  password: passwordHash, role: 'PATIENT' } }),
    prisma.utilisateur.upsert({ where: { email: 'patient2@email.ma' },  update: {}, create: { nom: 'Fatima Zohra',    email: 'patient2@email.ma',  password: passwordHash, role: 'PATIENT' } }),
  ]);
  console.log('✔ Utilisateurs créés');

  const [centre1, centre2] = await Promise.all([
    prisma.centre.upsert({ where: { id: 1 }, update: {}, create: { nom: 'Clinique du Centre',  adresse: '12 Avenue Hassan II, Casablanca', contact: '+212 522 000 001' } }),
    prisma.centre.upsert({ where: { id: 2 }, update: {}, create: { nom: 'Polyclinique Atlas',  adresse: '45 Rue Ibn Sina, Rabat',          contact: '+212 537 000 002' } }),
    prisma.centre.upsert({ where: { id: 3 }, update: {}, create: { nom: 'Centre Médical Anfa', adresse: "8 Boulevard d'Anfa, Casablanca",  contact: '+212 522 000 003' } }),
  ]);
  console.log('✔ Centres créés');

  const [cardio, pediatrie, dermato, medGen] = await Promise.all([
    prisma.specialite.upsert({ where: { nom: 'Cardiologie' },       update: {}, create: { nom: 'Cardiologie' } }),
    prisma.specialite.upsert({ where: { nom: 'Pédiatrie' },         update: {}, create: { nom: 'Pédiatrie' } }),
    prisma.specialite.upsert({ where: { nom: 'Dermatologie' },      update: {}, create: { nom: 'Dermatologie' } }),
    prisma.specialite.upsert({ where: { nom: 'Médecine générale' }, update: {}, create: { nom: 'Médecine générale' } }),
    prisma.specialite.upsert({ where: { nom: 'Ophtalmologie' },     update: {}, create: { nom: 'Ophtalmologie' } }),
  ]);
  console.log('✔ Spécialités créées');

  const [dr1, dr2, dr3, dr4] = await Promise.all([
    prisma.medecin.upsert({ where: { id: 1 }, update: {}, create: { nom: 'Dr. Karim Alaoui',   specialiteId: cardio.id,    centreId: centre1.id } }),
    prisma.medecin.upsert({ where: { id: 2 }, update: {}, create: { nom: 'Dr. Sara Benali',    specialiteId: pediatrie.id, centreId: centre1.id } }),
    prisma.medecin.upsert({ where: { id: 3 }, update: {}, create: { nom: 'Dr. Youssef Tahiri', specialiteId: dermato.id,   centreId: centre2.id } }),
    prisma.medecin.upsert({ where: { id: 4 }, update: {}, create: { nom: 'Dr. Nadia Chraibi',  specialiteId: medGen.id,    centreId: centre2.id } }),
  ]);
  console.log('✔ Médecins créés');

  await prisma.absence.createMany({
    data: [
      { medecinId: dr1.id, dateDebut: new Date('2026-07-01'), dateFin: new Date('2026-07-05'), motif: 'CONGES' },
      { medecinId: dr3.id, dateDebut: new Date('2026-07-03'), dateFin: new Date('2026-07-03'), motif: 'MALADIE' },
    ],
    skipDuplicates: true,
  });
  console.log('✔ Absences créées');

  await prisma.creneau.createMany({
    data: [
      { medecinId: dr1.id, dateHeure: new Date('2026-06-30T09:00:00Z'), dureeMinutes: 30 },
      { medecinId: dr1.id, dateHeure: new Date('2026-06-30T09:30:00Z'), dureeMinutes: 30 },
      { medecinId: dr2.id, dateHeure: new Date('2026-06-30T14:00:00Z'), dureeMinutes: 30 },
      { medecinId: dr2.id, dateHeure: new Date('2026-06-30T14:30:00Z'), dureeMinutes: 30 },
      { medecinId: dr3.id, dateHeure: new Date('2026-07-02T10:00:00Z'), dureeMinutes: 30 },
      { medecinId: dr4.id, dateHeure: new Date('2026-06-30T08:00:00Z'), dureeMinutes: 30 },
      { medecinId: dr4.id, dateHeure: new Date('2026-06-30T08:30:00Z'), dureeMinutes: 30 },
    ],
    skipDuplicates: true,
  });
  console.log('✔ Créneaux créés');

  console.log('\nSeed terminé avec succès.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
