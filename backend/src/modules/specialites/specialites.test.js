/**
 * Specialites Service — Tests unitaires (Jest + Babel)
 */

import * as specialitesService    from './specialites.service.js';
import * as specialitesRepository from './specialites.repository.js';
import AppError                   from '../../common/utils/AppError.js';

jest.mock('./specialites.repository.js');

const mockSpecialite = { id: 1, nom: 'Cardiologie' };

afterEach(() => jest.clearAllMocks());

describe('specialitesService.getAll', () => {
  it('retourne la liste de toutes les spécialités', async () => {
    specialitesRepository.findAll.mockResolvedValue([mockSpecialite]);
    const result = await specialitesService.getAll();
    expect(result).toHaveLength(1);
    expect(result[0].nom).toBe('Cardiologie');
  });
});

describe('specialitesService.getById', () => {
  it('retourne une spécialité si trouvée', async () => {
    specialitesRepository.findById.mockResolvedValue(mockSpecialite);
    const result = await specialitesService.getById(1);
    expect(result.id).toBe(1);
  });

  it('lève une AppError 404 si introuvable', async () => {
    specialitesRepository.findById.mockResolvedValue(null);
    await expect(specialitesService.getById(999)).rejects.toThrow(
      new AppError('Spécialité introuvable.', 404)
    );
  });
});

describe('specialitesService.create', () => {
  it('crée une spécialité si le nom est disponible', async () => {
    specialitesRepository.findByNom.mockResolvedValue(null);
    specialitesRepository.create.mockResolvedValue(mockSpecialite);
    const result = await specialitesService.create({ nom: 'Cardiologie' });
    expect(result.nom).toBe('Cardiologie');
  });

  it('lève une AppError 409 si le nom existe déjà', async () => {
    specialitesRepository.findByNom.mockResolvedValue(mockSpecialite);
    await expect(specialitesService.create({ nom: 'Cardiologie' })).rejects.toThrow(
      new AppError('La spécialité "Cardiologie" existe déjà.', 409)
    );
  });
});

describe('specialitesService.update', () => {
  it('met à jour avec un nom unique', async () => {
    specialitesRepository.findById.mockResolvedValue(mockSpecialite);
    specialitesRepository.findByNom.mockResolvedValue(null);
    specialitesRepository.update.mockResolvedValue({ ...mockSpecialite, nom: 'Neurologie' });
    const result = await specialitesService.update(1, { nom: 'Neurologie' });
    expect(result.nom).toBe('Neurologie');
  });

  it('lève une AppError 409 si le nom est pris par une autre spécialité', async () => {
    specialitesRepository.findById.mockResolvedValue(mockSpecialite);
    specialitesRepository.findByNom.mockResolvedValue({ id: 2, nom: 'Neurologie' });
    await expect(specialitesService.update(1, { nom: 'Neurologie' })).rejects.toThrow(
      new AppError('La spécialité "Neurologie" existe déjà.', 409)
    );
  });

  it('lève une AppError 404 si introuvable', async () => {
    specialitesRepository.findById.mockResolvedValue(null);
    await expect(specialitesService.update(999, { nom: 'X' })).rejects.toThrow(
      new AppError('Spécialité introuvable.', 404)
    );
  });
});

describe('specialitesService.remove', () => {
  it('supprime une spécialité existante', async () => {
    specialitesRepository.findById.mockResolvedValue(mockSpecialite);
    specialitesRepository.remove.mockResolvedValue(mockSpecialite);
    await expect(specialitesService.remove(1)).resolves.not.toThrow();
    expect(specialitesRepository.remove).toHaveBeenCalledWith(1);
  });

  it('lève une AppError 404 si introuvable', async () => {
    specialitesRepository.findById.mockResolvedValue(null);
    await expect(specialitesService.remove(999)).rejects.toThrow(
      new AppError('Spécialité introuvable.', 404)
    );
  });
});
