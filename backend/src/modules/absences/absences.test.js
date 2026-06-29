/**
 * Absences Service — Tests unitaires (Jest + Babel)
 * Repository mocké pour une isolation complète. (DIP)
 */

import * as absencesService    from './absences.service.js';
import * as absencesRepository from './absences.repository.js';
import AppError                from '../../common/utils/AppError.js';

jest.mock('./absences.repository.js');

const mockAbsence = {
  id: 1,
  medecinId: 1,
  dateDebut: new Date('2026-07-01'),
  dateFin:   new Date('2026-07-05'),
  motif: 'MALADIE',
  medecin: { id: 1, nom: 'Dr. Karim Alaoui' },
};

afterEach(() => jest.clearAllMocks());

// ─── getAll ──────────────────────────────────────────────────────────────────

describe('absencesService.getAll', () => {
  it('retourne toutes les absences sans filtre', async () => {
    absencesRepository.findAll.mockResolvedValue([mockAbsence]);

    const result = await absencesService.getAll({});

    expect(result).toHaveLength(1);
    expect(result[0].motif).toBe('MALADIE');
    expect(absencesRepository.findAll).toHaveBeenCalledWith({});
  });

  it('passe le filtre medecinId au repository', async () => {
    absencesRepository.findAll.mockResolvedValue([mockAbsence]);

    await absencesService.getAll({ medecinId: 1 });

    expect(absencesRepository.findAll).toHaveBeenCalledWith({ medecinId: 1 });
  });
});

// ─── getById ─────────────────────────────────────────────────────────────────

describe('absencesService.getById', () => {
  it('retourne une absence si trouvée', async () => {
    absencesRepository.findById.mockResolvedValue(mockAbsence);

    const result = await absencesService.getById(1);

    expect(result.id).toBe(1);
    expect(result.motif).toBe('MALADIE');
  });

  it('lève une AppError 404 si introuvable', async () => {
    absencesRepository.findById.mockResolvedValue(null);

    await expect(absencesService.getById(999)).rejects.toThrow(
      new AppError('Absence introuvable.', 404)
    );
  });
});

// ─── create ──────────────────────────────────────────────────────────────────

describe('absencesService.create', () => {
  const validData = {
    medecinId: 1,
    dateDebut: '2026-08-01',
    dateFin:   '2026-08-05',
    motif:     'CONGES',
  };

  it('crée une absence valide sans chevauchement', async () => {
    absencesRepository.findOverlapping.mockResolvedValue([]);
    absencesRepository.create.mockResolvedValue({ ...mockAbsence, motif: 'CONGES' });

    const result = await absencesService.create(validData);

    expect(result.motif).toBe('CONGES');
    expect(absencesRepository.create).toHaveBeenCalledTimes(1);
  });

  it('lève une AppError 400 si motif invalide', async () => {
    await expect(
      absencesService.create({ ...validData, motif: 'VACANCES' })
    ).rejects.toThrow(new AppError('Motif invalide. Valeurs acceptées : MALADIE, CONGES, AUTRE.', 400));
  });

  it('lève une AppError 400 si dateDebut >= dateFin', async () => {
    await expect(
      absencesService.create({ ...validData, dateDebut: '2026-08-10', dateFin: '2026-08-05' })
    ).rejects.toThrow(new AppError('La date de début doit être antérieure à la date de fin.', 400));
  });

  it('lève une AppError 409 si chevauchement détecté', async () => {
    absencesRepository.findOverlapping.mockResolvedValue([mockAbsence]);

    await expect(absencesService.create(validData)).rejects.toThrow(
      new AppError('Une absence existe déjà sur cette période pour ce médecin.', 409)
    );
  });
});

// ─── update ──────────────────────────────────────────────────────────────────

describe('absencesService.update', () => {
  it('met à jour une absence existante sans conflit', async () => {
    const updated = { ...mockAbsence, motif: 'AUTRE' };
    absencesRepository.findById.mockResolvedValue(mockAbsence);
    absencesRepository.findOverlapping.mockResolvedValue([]);
    absencesRepository.update.mockResolvedValue(updated);

    const result = await absencesService.update(1, {
      dateDebut: '2026-07-01',
      dateFin:   '2026-07-05',
      motif:     'AUTRE',
    });

    expect(result.motif).toBe('AUTRE');
  });

  it('lève une AppError 404 si absence introuvable', async () => {
    absencesRepository.findById.mockResolvedValue(null);

    await expect(
      absencesService.update(999, { dateDebut: '2026-07-01', dateFin: '2026-07-05' })
    ).rejects.toThrow(new AppError('Absence introuvable.', 404));
  });

  it('lève une AppError 409 si conflit avec une autre absence (pas soi-même)', async () => {
    const autreAbsence = { id: 2, medecinId: 1 };
    absencesRepository.findById.mockResolvedValue(mockAbsence);
    absencesRepository.findOverlapping.mockResolvedValue([autreAbsence]);

    await expect(
      absencesService.update(1, { dateDebut: '2026-07-01', dateFin: '2026-07-10' })
    ).rejects.toThrow(new AppError('Une absence existe déjà sur cette période pour ce médecin.', 409));
  });
});

// ─── remove ──────────────────────────────────────────────────────────────────

describe('absencesService.remove', () => {
  it('supprime une absence existante', async () => {
    absencesRepository.findById.mockResolvedValue(mockAbsence);
    absencesRepository.remove.mockResolvedValue(mockAbsence);

    await expect(absencesService.remove(1)).resolves.not.toThrow();
    expect(absencesRepository.remove).toHaveBeenCalledWith(1);
  });

  it('lève une AppError 404 si introuvable', async () => {
    absencesRepository.findById.mockResolvedValue(null);

    await expect(absencesService.remove(999)).rejects.toThrow(
      new AppError('Absence introuvable.', 404)
    );
  });
});
