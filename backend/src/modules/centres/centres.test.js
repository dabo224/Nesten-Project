/**
 * Centres Service — Tests unitaires (Jest + Babel)
 */

import * as centresService    from './centres.service.js';
import * as centresRepository from './centres.repository.js';
import AppError               from '../../common/utils/AppError.js';

jest.mock('./centres.repository.js');

const mockCentre = {
  id: 1,
  nom: 'Clinique du Centre',
  adresse: '12 Avenue Hassan II, Casablanca',
  contact: '+212 522 000 001',
  createdAt: new Date(),
  updatedAt: new Date(),
};

afterEach(() => jest.clearAllMocks());

describe('centresService.getAll', () => {
  it('retourne la liste de tous les centres', async () => {
    centresRepository.findAll.mockResolvedValue([mockCentre]);
    const result = await centresService.getAll();
    expect(result).toHaveLength(1);
    expect(result[0].nom).toBe('Clinique du Centre');
  });
});

describe('centresService.getById', () => {
  it('retourne un centre si trouvé', async () => {
    centresRepository.findById.mockResolvedValue(mockCentre);
    const result = await centresService.getById(1);
    expect(result.id).toBe(1);
  });

  it('lève une AppError 404 si introuvable', async () => {
    centresRepository.findById.mockResolvedValue(null);
    await expect(centresService.getById(999)).rejects.toThrow(
      new AppError('Centre introuvable.', 404)
    );
  });
});

describe('centresService.create', () => {
  it('crée et retourne un nouveau centre', async () => {
    centresRepository.create.mockResolvedValue(mockCentre);
    const result = await centresService.create({ nom: 'Clinique du Centre', adresse: '12 Avenue Hassan II', contact: '+212 522 000 001' });
    expect(result.nom).toBe('Clinique du Centre');
  });
});

describe('centresService.update', () => {
  it('met à jour un centre existant', async () => {
    centresRepository.findById.mockResolvedValue(mockCentre);
    centresRepository.update.mockResolvedValue({ ...mockCentre, nom: 'Nouveau Nom' });
    const result = await centresService.update(1, { nom: 'Nouveau Nom' });
    expect(result.nom).toBe('Nouveau Nom');
  });

  it('lève une AppError 404 si introuvable', async () => {
    centresRepository.findById.mockResolvedValue(null);
    await expect(centresService.update(999, { nom: 'X' })).rejects.toThrow(
      new AppError('Centre introuvable.', 404)
    );
  });
});

describe('centresService.remove', () => {
  it('supprime un centre existant', async () => {
    centresRepository.findById.mockResolvedValue(mockCentre);
    centresRepository.remove.mockResolvedValue(mockCentre);
    await expect(centresService.remove(1)).resolves.not.toThrow();
    expect(centresRepository.remove).toHaveBeenCalledWith(1);
  });

  it('lève une AppError 404 si introuvable', async () => {
    centresRepository.findById.mockResolvedValue(null);
    await expect(centresService.remove(999)).rejects.toThrow(
      new AppError('Centre introuvable.', 404)
    );
  });
});
