import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import type { PrismaService } from '../database/prisma.service';

describe('UsersService', () => {
  type PrismaLike = {
    user: {
      findUnique: jest.Mock;
      findMany: jest.Mock;
      findFirst: jest.Mock;
      update: jest.Mock;
    };
    follow: {
      upsert: jest.Mock;
      deleteMany: jest.Mock;
    };
  };

  const prisma: PrismaLike = {
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    follow: {
      upsert: jest.fn(),
      deleteMany: jest.fn(),
    },
  };

  beforeEach(() => jest.resetAllMocks());

  function makeSvc() {
    return new UsersService(prisma as unknown as PrismaService);
  }

  describe('getMe', () => {
    it('lança NotFoundException se usuário não existe', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      await expect(makeSvc().getMe(99)).rejects.toBeInstanceOf(NotFoundException);
    });

    it('retorna usuário quando existe', async () => {
      const user = { id: 1, name: 'A', email: 'a@a.com', username: null, bio: null, avatar: null, phone: null, created_at: null };
      prisma.user.findUnique.mockResolvedValue(user);
      const result = await makeSvc().getMe(1);
      expect(result).toEqual(user);
    });
  });

  describe('search', () => {
    it('retorna lista vazia para query menor que 2 caracteres', async () => {
      const result = await makeSvc().search('a', 1);
      expect(result).toEqual([]);
      expect(prisma.user.findMany).not.toHaveBeenCalled();
    });

    it('retorna usuários com isFollowing calculado', async () => {
      prisma.user.findMany.mockResolvedValue([
        { id: 2, name: 'Bob', username: 'bob', avatar: null, followers_list: [{ follower_id: 1 }] },
        { id: 3, name: 'Carol', username: 'carol', avatar: null, followers_list: [] },
      ]);
      const result = await makeSvc().search('bo', 1);
      expect(result[0].isFollowing).toBe(true);
      expect(result[1].isFollowing).toBe(false);
    });
  });

  describe('follow', () => {
    it('lança BadRequestException ao tentar seguir a si mesmo', async () => {
      await expect(makeSvc().follow(1, 1)).rejects.toBeInstanceOf(BadRequestException);
    });

    it('lança NotFoundException se alvo não existe', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      await expect(makeSvc().follow(1, 2)).rejects.toBeInstanceOf(NotFoundException);
    });

    it('faz upsert do follow quando válido', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 2 });
      prisma.follow.upsert.mockResolvedValue({});
      const result = await makeSvc().follow(1, 2);
      expect(prisma.follow.upsert).toHaveBeenCalled();
      expect(result).toEqual({ message: 'ok' });
    });
  });

  describe('unfollow', () => {
    it('deleta o follow existente', async () => {
      prisma.follow.deleteMany.mockResolvedValue({ count: 1 });
      const result = await makeSvc().unfollow(1, 2);
      expect(prisma.follow.deleteMany).toHaveBeenCalledWith({
        where: { follower_id: 1, following_id: 2 },
      });
      expect(result).toEqual({ message: 'ok' });
    });
  });

  describe('updateMe', () => {
    it('lança ConflictException se username já está em uso', async () => {
      prisma.user.findFirst.mockResolvedValue({ id: 5 });
      await expect(
        makeSvc().updateMe(1, { username: 'taken' }),
      ).rejects.toBeInstanceOf(ConflictException);
    });

    it('atualiza perfil quando username está disponível', async () => {
      prisma.user.findFirst.mockResolvedValue(null);
      const updated = { id: 1, name: 'A', email: 'a@a.com', username: 'novo', bio: null, avatar: null, phone: null };
      prisma.user.update.mockResolvedValue(updated);
      const result = await makeSvc().updateMe(1, { username: 'novo' });
      expect(result).toEqual(updated);
    });
  });
});
