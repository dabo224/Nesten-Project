/**
 * Medecins Service — Tests unitaires (Jest + Babel)
 * Repository mocké pour une isolation complète. (DIP)
 */

import * as medecinService    from './medecins.service.js';
import * as medecinRepository from './medecins.repository.js';
import AppError               from '../../common/utils/AppError.js';

jest.mock('./medecins.repository.js');

const mockMedecin = {
  id: 1,
  nom: 'Dr. Karim Alaoui',
  specialiteId: 1,
  centreId: 1,
  specialite: { id: 1, nom: 'Cardiologie' },
  centre:     { id: 1, nom: 'Clinique du Centre' },
  absences: [],
};

afterEach(() => jest.clearAllMocks());

// ─── getAll ──────────────────────────────────────────────────────────────────

describe('medecinService.getAll', () => {
  it('retourne tous les médecins sans filtre', async () => {
    medecinRepository.findAll.mockResolvedValue([mockMedecin]);

    const result = await medecinService.getAll({});

    expect(result).toHaveLength(1);
    expect(result[0].nom).toBe('Dr. Karim Alaoui');
    expect(medecinRepository.findAll).toHaveBeenCalledWith({});
  });

  it('passe les filtres specialiteId et centreId au repository', async () => {
    medecinRepository.findAll.mockResolvedValue([mockMedecin]);

    await medecinService.getAll({ specialiteId: 1, centreId: 1 });

    expect(medecinRepository.findAll).toHaveBeenCalledWith({ specialiteId: 1, centreId: 1 });
  });
});

// ─── getById ─────────────────────────────────────────────────────────────────

describe('medecinService.getById', () => {
  it('retourne un médecin si trouvé', async () => {
    medecinRepository.findById.mockResolvedValue(mockMedecin);

    const result = await medecinService.getById(1);

    expect(result.id).toBe(1);
    expect(result.specialite.nom).toBe('Cardiologie');
  });

  it('lève une AppError 404 si introuvable', async () => {
    medecinRepository.findById.mockResolvedValue(null);

    await expect(medecinService.getById(999)).rejects.toThrow(
      new AppError('Médecin introuvable.', 404)
    );
  });
});

// ─── create ──────────────────────────────────────────────────────────────────

describe('medecinService.create', () => {
  it('crée et retourne un médecin avec ses relations', async () => {
    medecinRepository.create.mockResolvedValue(mockMedecin);

    const result = await medecinService.create({
      nom: 'Dr. Karim Alaoui',
      specialiteId: 1,
      centreId: 1,
    });

    expect(result.nom).toBe('Dr. Karim Alaoui');
    expect(medecinRepository.create).toHaveBeenCalledTimes(1);
  });
});

// ─── update ──────────────────────────────────────────────────────────────────

describe('medecinService.update', () => {
  it('met à jour un médecin existant', async () => {
    const updated = { ...mockMedecin, nom: 'Dr. Nouveau Nom' };
    medecinRepository.findById.mockResolvedValue(mockMedecin);
    medecinRepository.update.mockResolvedValue(updated);

    const result = await medecinService.update(1, { nom: 'Dr. Nouveau Nom' });

    expect(result.nom).toBe('Dr. Nouveau Nom');
  });

  it('lève une AppError 404 si introuvable', async () => {
    medecinRepository.findById.mockResolvedValue(null);

    await expect(
      medecinService.update(999, { nom: 'X' })
    ).rejects.toThrow(new AppError('Médecin introuvable.', 404));
  });
});

// ─── remove ──────────────────────────────────────────────────────────────────

describe('medecinService.remove', () => {
  it('supprime un médecin existant (et ses absences/créneaux en cascade)', async () => {
    medecinRepository.findById.mockResolvedValue(mockMedecin);
    medecinRepository.remove.mockResolvedValue(mockMedecin);

    await expect(medecinService.remove(1)).resolves.not.toThrow();
    expect(medecinRepository.remove).toHaveBeenCalledWith(1);
  });

  it('lève une AppError 404 si introuvable', async () => {
    medecinRepository.findById.mockResolvedValue(null);

    await expect(medecinService.remove(999)).rejects.toThrow(
      new AppError('Médecin introuvable.', 404)
    );
  });
});
