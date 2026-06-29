/**
 * Auth Service — Tests unitaires (Jest + Babel)
 * Repository, bcrypt et jwt sont mockés pour une isolation complète.
 */

import * as authService    from './auth.service.js';
import * as authRepository from './auth.repository.js';
import bcrypt              from 'bcryptjs';
import jwt                 from 'jsonwebtoken';
import AppError            from '../../common/utils/AppError.js';

jest.mock('./auth.repository.js');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

const mockUser = {
  id: 1,
  nom: 'Test User',
  email: 'test@nesten.ma',
  password: 'hashed_password',
  role: 'PATIENT',
  createdAt: new Date(),
};

afterEach(() => jest.clearAllMocks());

// ─── register ────────────────────────────────────────────────────────────────

describe('authService.register', () => {
  it('crée un utilisateur et retourne les données sans mot de passe', async () => {
    authRepository.findByEmail.mockResolvedValue(null);
    bcrypt.hash.mockResolvedValue('hashed_password');
    authRepository.create.mockResolvedValue(mockUser);

    const result = await authService.register({ nom: 'Test', email: 'test@nesten.ma', password: 'Password123!' });

    expect(result).not.toHaveProperty('password');
    expect(authRepository.create).toHaveBeenCalledTimes(1);
  });

  it("lève une AppError 409 si l'email est déjà utilisé", async () => {
    authRepository.findByEmail.mockResolvedValue(mockUser);

    await expect(
      authService.register({ nom: 'X', email: 'test@nesten.ma', password: '123' })
    ).rejects.toThrow(new AppError('Cet email est déjà utilisé.', 409));
  });
});

// ─── login ───────────────────────────────────────────────────────────────────

describe('authService.login', () => {
  it('retourne un token et le profil sans mot de passe si credentials valides', async () => {
    authRepository.findByEmail.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue('mocked_token');

    const result = await authService.login({ email: 'test@nesten.ma', password: 'Password123!' });

    expect(result.token).toBe('mocked_token');
    expect(result.utilisateur).not.toHaveProperty('password');
  });

  it("lève une AppError 401 si l'email est introuvable", async () => {
    authRepository.findByEmail.mockResolvedValue(null);

    await expect(
      authService.login({ email: 'inconnu@nesten.ma', password: '123' })
    ).rejects.toThrow(new AppError('Email ou mot de passe incorrect.', 401));
  });

  it('lève une AppError 401 si le mot de passe est incorrect', async () => {
    authRepository.findByEmail.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(false);

    await expect(
      authService.login({ email: 'test@nesten.ma', password: 'mauvais' })
    ).rejects.toThrow(new AppError('Email ou mot de passe incorrect.', 401));
  });
});

// ─── getMe ───────────────────────────────────────────────────────────────────

describe('authService.getMe', () => {
  it("retourne le profil sans mot de passe", async () => {
    const { password: _password, ...userWithoutPassword } = mockUser;
    authRepository.findById.mockResolvedValue(userWithoutPassword);

    const result = await authService.getMe(1);

    expect(result).not.toHaveProperty('password');
    expect(result.id).toBe(1);
  });

  it("lève une AppError 404 si l'utilisateur est introuvable", async () => {
    authRepository.findById.mockResolvedValue(null);

    await expect(authService.getMe(999)).rejects.toThrow(
      new AppError('Utilisateur introuvable.', 404)
    );
  });
});
