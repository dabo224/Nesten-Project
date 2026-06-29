/**
 * Creneaux Service — Tests unitaires (Jest + Babel)
 * Repositories mockés pour une isolation complète. (DIP)
 */

import * as creneauxService    from './creneaux.service.js';
import * as creneauxRepository from './creneaux.repository.js';
import * as absencesRepository from '../absences/absences.repository.js';
import AppError                from '../../common/utils/AppError.js';

jest.mock('./creneaux.repository.js');
jest.mock('../absences/absences.repository.js');

const mockCreneau = {
  id: 1,
  medecinId: 1,
  dateHeure: new Date('2026-08-01T09:00:00Z'),
  dureeMinutes: 30,
  estDisponible: true,
  rendezVous: null,
  medecin: { id: 1, nom: 'Dr. Karim Alaoui' },
};

afterEach(() => jest.clearAllMocks());

// ─── getAll ──────────────────────────────────────────────────────────────────

describe('creneauxService.getAll', () => {
  it('retourne tous les créneaux sans filtre', async () => {
    creneauxRepository.findAll.mockResolvedValue([mockCreneau]);

    const result = await creneauxService.getAll({});

    expect(result).toHaveLength(1);
    expect(result[0].dureeMinutes).toBe(30);
    expect(creneauxRepository.findAll).toHaveBeenCalledWith({});
  });

  it('passe les filtres medecinId, date, estDisponible au repository', async () => {
    creneauxRepository.findAll.mockResolvedValue([mockCreneau]);

    await creneauxService.getAll({ medecinId: 1, date: '2026-08-01', estDisponible: true });

    expect(creneauxRepository.findAll).toHaveBeenCalledWith({
      medecinId: 1,
      date: '2026-08-01',
      estDisponible: true,
    });
  });
});

// ─── getById ─────────────────────────────────────────────────────────────────

describe('creneauxService.getById', () => {
  it('retourne un créneau si trouvé', async () => {
    creneauxRepository.findById.mockResolvedValue(mockCreneau);

    const result = await creneauxService.getById(1);

    expect(result.id).toBe(1);
    expect(result.estDisponible).toBe(true);
  });

  it('lève une AppError 404 si introuvable', async () => {
    creneauxRepository.findById.mockResolvedValue(null);

    await expect(creneauxService.getById(999)).rejects.toThrow(
      new AppError('Créneau introuvable.', 404)
    );
  });
});

// ─── create ──────────────────────────────────────────────────────────────────

describe('creneauxService.create', () => {
  const validData = { medecinId: 1, dateHeure: '2026-08-01T10:00:00Z', dureeMinutes: 30 };

  it('crée un créneau valide (pas d\'absence, pas de chevauchement)', async () => {
    absencesRepository.findOverlapping.mockResolvedValue([]);
    creneauxRepository.findOverlapping.mockResolvedValue([]);
    creneauxRepository.create.mockResolvedValue(mockCreneau);

    const result = await creneauxService.create(validData);

    expect(result.dureeMinutes).toBe(30);
    expect(creneauxRepository.create).toHaveBeenCalledTimes(1);
  });

  it('lève une AppError 400 si dureeMinutes <= 0', async () => {
    await expect(
      creneauxService.create({ ...validData, dureeMinutes: 0 })
    ).rejects.toThrow(new AppError('La durée du créneau doit être supérieure à 0 minute.', 400));
  });

  it('lève une AppError 409 si le médecin est en absence', async () => {
    absencesRepository.findOverlapping.mockResolvedValue([{ id: 1, motif: 'MALADIE' }]);

    await expect(creneauxService.create(validData)).rejects.toThrow(
      new AppError('Le médecin est en absence sur ce créneau.', 409)
    );
  });

  it('lève une AppError 409 si chevauchement avec un créneau existant', async () => {
    absencesRepository.findOverlapping.mockResolvedValue([]);
    creneauxRepository.findOverlapping.mockResolvedValue([mockCreneau]);

    await expect(creneauxService.create(validData)).rejects.toThrow(
      new AppError('Ce créneau chevauche un créneau existant pour ce médecin.', 409)
    );
  });
});

// ─── update ──────────────────────────────────────────────────────────────────

describe('creneauxService.update', () => {
  it('met à jour un créneau sans conflit', async () => {
    const updated = { ...mockCreneau, dureeMinutes: 45 };
    creneauxRepository.findById.mockResolvedValue(mockCreneau);
    absencesRepository.findOverlapping.mockResolvedValue([]);
    creneauxRepository.findOverlapping.mockResolvedValue([]);
    creneauxRepository.update.mockResolvedValue(updated);

    const result = await creneauxService.update(1, { dureeMinutes: 45 });

    expect(result.dureeMinutes).toBe(45);
  });

  it('lève une AppError 404 si créneau introuvable', async () => {
    creneauxRepository.findById.mockResolvedValue(null);

    await expect(
      creneauxService.update(999, { dureeMinutes: 45 })
    ).rejects.toThrow(new AppError('Créneau introuvable.', 404));
  });

  it('ignore le chevauchement avec soi-même lors de la mise à jour', async () => {
    creneauxRepository.findById.mockResolvedValue(mockCreneau);
    absencesRepository.findOverlapping.mockResolvedValue([]);
    // findOverlapping retourne le créneau lui-même → ne doit pas bloquer
    creneauxRepository.findOverlapping.mockResolvedValue([mockCreneau]);
    creneauxRepository.update.mockResolvedValue(mockCreneau);

    await expect(
      creneauxService.update(1, { dureeMinutes: 30 })
    ).resolves.not.toThrow();
  });
});

// ─── remove ──────────────────────────────────────────────────────────────────

describe('creneauxService.remove', () => {
  it('supprime un créneau sans rendez-vous', async () => {
    creneauxRepository.findById.mockResolvedValue(mockCreneau);
    creneauxRepository.remove.mockResolvedValue(mockCreneau);

    await expect(creneauxService.remove(1)).resolves.not.toThrow();
    expect(creneauxRepository.remove).toHaveBeenCalledWith(1);
  });

  it('lève une AppError 404 si introuvable', async () => {
    creneauxRepository.findById.mockResolvedValue(null);

    await expect(creneauxService.remove(999)).rejects.toThrow(
      new AppError('Créneau introuvable.', 404)
    );
  });

  it('lève une AppError 409 si un rendez-vous est lié au créneau', async () => {
    const creneauReserve = { ...mockCreneau, rendezVous: { id: 1, statut: 'CONFIRME' } };
    creneauxRepository.findById.mockResolvedValue(creneauReserve);

    await expect(creneauxService.remove(1)).rejects.toThrow(
      new AppError('Impossible de supprimer un créneau avec un rendez-vous associé. Annulez le rendez-vous d\'abord.', 409)
    );
  });
});
