/**
 * RendezVous Service — Tests unitaires (Jest + Babel)
 * Repositories mockés pour une isolation complète. (DIP)
 */

import * as rendezvousService    from './rendezvous.service.js';
import * as rendezvousRepository from './rendezvous.repository.js';
import * as creneauxRepository   from '../creneaux/creneaux.repository.js';
import AppError                  from '../../common/utils/AppError.js';

jest.mock('./rendezvous.repository.js');
jest.mock('../creneaux/creneaux.repository.js');

const mockCreneau = {
  id: 1,
  medecinId: 1,
  dateHeure: new Date('2026-08-01T09:00:00Z'),
  dureeMinutes: 30,
  estDisponible: true,
};

const mockRdv = {
  id: 1,
  creneauId: 1,
  patientNom: 'Alice Martin',
  patientContact: 'alice@mail.com',
  statut: 'CONFIRME',
  creneau: mockCreneau,
};

afterEach(() => jest.clearAllMocks());

// ─── getAll ──────────────────────────────────────────────────────────────────

describe('rendezvousService.getAll', () => {
  it('retourne tous les rendez-vous', async () => {
    rendezvousRepository.findAll.mockResolvedValue([mockRdv]);

    const result = await rendezvousService.getAll({});

    expect(result).toHaveLength(1);
    expect(result[0].patientNom).toBe('Alice Martin');
  });

  it('passe le filtre statut au repository', async () => {
    rendezvousRepository.findAll.mockResolvedValue([mockRdv]);

    await rendezvousService.getAll({ statut: 'CONFIRME' });

    expect(rendezvousRepository.findAll).toHaveBeenCalledWith({ statut: 'CONFIRME' });
  });
});

// ─── getById ─────────────────────────────────────────────────────────────────

describe('rendezvousService.getById', () => {
  it('retourne un rendez-vous si trouvé', async () => {
    rendezvousRepository.findById.mockResolvedValue(mockRdv);

    const result = await rendezvousService.getById(1);

    expect(result.id).toBe(1);
    expect(result.statut).toBe('CONFIRME');
  });

  it('lève une AppError 404 si introuvable', async () => {
    rendezvousRepository.findById.mockResolvedValue(null);

    await expect(rendezvousService.getById(999)).rejects.toThrow(
      new AppError('Rendez-vous introuvable.', 404)
    );
  });
});

// ─── book ────────────────────────────────────────────────────────────────────

describe('rendezvousService.book', () => {
  const bookData = {
    creneauId: 1,
    patientNom: 'Alice Martin',
    patientContact: 'alice@mail.com',
  };

  it('réserve un créneau disponible', async () => {
    creneauxRepository.findById.mockResolvedValue(mockCreneau);
    rendezvousRepository.book.mockResolvedValue(mockRdv);

    const result = await rendezvousService.book(bookData);

    expect(result.statut).toBe('CONFIRME');
    expect(rendezvousRepository.book).toHaveBeenCalledWith(bookData);
  });

  it('lève une AppError 404 si le créneau est introuvable', async () => {
    creneauxRepository.findById.mockResolvedValue(null);

    await expect(rendezvousService.book(bookData)).rejects.toThrow(
      new AppError('Créneau introuvable.', 404)
    );
  });

  it('lève une AppError 409 si le créneau est déjà pris', async () => {
    creneauxRepository.findById.mockResolvedValue({ ...mockCreneau, estDisponible: false });

    await expect(rendezvousService.book(bookData)).rejects.toThrow(
      new AppError('Ce créneau n\'est plus disponible.', 409)
    );
  });
});

// ─── cancel ──────────────────────────────────────────────────────────────────

describe('rendezvousService.cancel', () => {
  it('annule un rendez-vous confirmé et libère le créneau', async () => {
    const annule = { ...mockRdv, statut: 'ANNULE' };
    rendezvousRepository.findById.mockResolvedValue(mockRdv);
    rendezvousRepository.cancel.mockResolvedValue(annule);

    const result = await rendezvousService.cancel(1);

    expect(result.statut).toBe('ANNULE');
    expect(rendezvousRepository.cancel).toHaveBeenCalledWith(1, mockCreneau.id);
  });

  it('lève une AppError 404 si le rendez-vous est introuvable', async () => {
    rendezvousRepository.findById.mockResolvedValue(null);

    await expect(rendezvousService.cancel(999)).rejects.toThrow(
      new AppError('Rendez-vous introuvable.', 404)
    );
  });

  it('lève une AppError 409 si le rendez-vous est déjà annulé', async () => {
    rendezvousRepository.findById.mockResolvedValue({ ...mockRdv, statut: 'ANNULE' });

    await expect(rendezvousService.cancel(1)).rejects.toThrow(
      new AppError('Ce rendez-vous est déjà annulé.', 409)
    );
  });
});

// ─── remove ──────────────────────────────────────────────────────────────────

describe('rendezvousService.remove', () => {
  it('supprime définitivement un rendez-vous', async () => {
    rendezvousRepository.findById.mockResolvedValue(mockRdv);
    rendezvousRepository.remove.mockResolvedValue(mockRdv);

    await expect(rendezvousService.remove(1)).resolves.not.toThrow();
    expect(rendezvousRepository.remove).toHaveBeenCalledWith(1);
  });

  it('lève une AppError 404 si introuvable', async () => {
    rendezvousRepository.findById.mockResolvedValue(null);

    await expect(rendezvousService.remove(999)).rejects.toThrow(
      new AppError('Rendez-vous introuvable.', 404)
    );
  });
});
