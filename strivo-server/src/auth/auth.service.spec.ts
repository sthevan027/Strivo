import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';
import type { PrismaService } from '../database/prisma.service';
import type { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  type PrismaLike = {
    user: {
      findUnique: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
    };
  };

  type JwtLike = {
    sign: jest.Mock;
  };

  const prisma: PrismaLike = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };

  const jwt: JwtLike = {
    sign: jest.fn(() => 'mocked-token'),
  };

  beforeEach(() => {
    jest.resetAllMocks();
    jwt.sign.mockReturnValue('mocked-token');
  });

  function makeSvc() {
    return new AuthService(
      prisma as unknown as PrismaService,
      jwt as unknown as JwtService,
    );
  }

  describe('register', () => {
    it('lança ConflictException se e-mail já existe', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 1, email: 'a@a.com' });
      await expect(
        makeSvc().register({ name: 'A', email: 'a@a.com', password: '123' }),
      ).rejects.toBeInstanceOf(ConflictException);
    });

    it('cria usuário com senha hasheada', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue({
        id: 1,
        name: 'A',
        email: 'a@a.com',
        username: null,
        avatar: null,
      });
      prisma.user.update.mockResolvedValue({});

      const result = await makeSvc().register({
        name: 'A',
        email: 'a@a.com',
        password: 'senha123',
      });

      expect(prisma.user.create).toHaveBeenCalled();
      const createCall = prisma.user.create.mock.calls[0][0] as { data: { password: string } };
      const storedPassword = createCall.data.password;
      expect(storedPassword).not.toBe('senha123');
      expect(await bcrypt.compare('senha123', storedPassword)).toBe(true);
      expect(result.access_token).toBeDefined();
      expect(result.refresh_token).toBeDefined();
    });

    it('salva hash do refresh token no banco', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue({
        id: 42,
        name: 'B',
        email: 'b@b.com',
        username: null,
        avatar: null,
      });
      prisma.user.update.mockResolvedValue({});

      await makeSvc().register({ name: 'B', email: 'b@b.com', password: 'pass' });

      expect(prisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 42 },
          data: expect.objectContaining({ refresh_token: expect.any(String) }),
        }),
      );
    });
  });

  describe('login', () => {
    it('lança UnauthorizedException se usuário não existe', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      await expect(
        makeSvc().login({ email: 'x@x.com', password: 'pass' }),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('lança UnauthorizedException se senha incorreta', async () => {
      const hashed = await bcrypt.hash('correta', 10);
      prisma.user.findUnique.mockResolvedValue({
        id: 1,
        email: 'x@x.com',
        password: hashed,
        name: 'X',
        username: null,
        avatar: null,
        refresh_token: null,
      });
      await expect(
        makeSvc().login({ email: 'x@x.com', password: 'errada' }),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('retorna tokens com credenciais corretas', async () => {
      const hashed = await bcrypt.hash('correta', 10);
      prisma.user.findUnique.mockResolvedValue({
        id: 1,
        email: 'x@x.com',
        password: hashed,
        name: 'X',
        username: null,
        avatar: null,
        refresh_token: null,
      });
      prisma.user.update.mockResolvedValue({});

      const result = await makeSvc().login({ email: 'x@x.com', password: 'correta' });

      expect(result.access_token).toBeDefined();
      expect(result.refresh_token).toBeDefined();
      expect(result.user.email).toBe('x@x.com');
    });
  });

  describe('refreshTokens', () => {
    it('lança UnauthorizedException se usuário não tem refresh token salvo', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 1, refresh_token: null });
      await expect(
        makeSvc().refreshTokens(1, 'any-token'),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('lança UnauthorizedException se token não bate com o hash', async () => {
      const hashed = await bcrypt.hash('token-certo', 10);
      prisma.user.findUnique.mockResolvedValue({
        id: 1,
        email: 'x@x.com',
        refresh_token: hashed,
      });
      await expect(
        makeSvc().refreshTokens(1, 'token-errado'),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('retorna novos tokens com refresh token válido', async () => {
      const rawToken = 'token-certo';
      const hashed = await bcrypt.hash(rawToken, 10);
      prisma.user.findUnique.mockResolvedValue({
        id: 1,
        email: 'x@x.com',
        refresh_token: hashed,
      });
      prisma.user.update.mockResolvedValue({});

      const result = await makeSvc().refreshTokens(1, rawToken);
      expect(result.access_token).toBeDefined();
      expect(result.refresh_token).toBeDefined();
    });
  });

  describe('logout', () => {
    it('limpa o refresh_token do usuário', async () => {
      prisma.user.update.mockResolvedValue({});
      await makeSvc().logout(5);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 5 },
        data: { refresh_token: null },
      });
    });
  });
});
