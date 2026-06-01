import { HomeService } from './home.service';
import type { PrismaService } from '../database/prisma.service';

describe('HomeService', () => {
  type PrismaLike = {
    user: { findMany: jest.Mock };
  };

  const prisma: PrismaLike = {
    user: { findMany: jest.fn() },
  };

  beforeEach(() => jest.resetAllMocks());

  function makeSvc() {
    return new HomeService(prisma as unknown as PrismaService);
  }

  it('retorna topStreamers com rank e featuredLives vazio', async () => {
    prisma.user.findMany.mockResolvedValue([
      { id: 1, name: 'A', username: 'a', avatar: null, _count: { posts: 5, followers_list: 10 } },
      { id: 2, name: 'B', username: 'b', avatar: null, _count: { posts: 3, followers_list: 7 } },
    ]);

    const result = await makeSvc().getHome();

    expect(result.topStreamers).toHaveLength(2);
    expect(result.topStreamers[0].rank).toBe(1);
    expect(result.topStreamers[1].rank).toBe(2);
    expect(result.featuredLives).toEqual([]);
  });

  it('retorna topStreamers vazio se não há usuários', async () => {
    prisma.user.findMany.mockResolvedValue([]);
    const result = await makeSvc().getHome();
    expect(result.topStreamers).toEqual([]);
    expect(result.featuredLives).toEqual([]);
  });

  it('busca no máximo 5 usuários', async () => {
    prisma.user.findMany.mockResolvedValue([]);
    await makeSvc().getHome();
    expect(prisma.user.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ take: 5 }),
    );
  });
});
