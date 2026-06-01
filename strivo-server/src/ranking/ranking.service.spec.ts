import { RankingService } from './ranking.service';
import type { PrismaService } from '../database/prisma.service';

describe('RankingService', () => {
  type PrismaLike = {
    user: { findMany: jest.Mock };
  };

  const prisma: PrismaLike = {
    user: { findMany: jest.fn() },
  };

  beforeEach(() => jest.resetAllMocks());

  function makeSvc() {
    return new RankingService(prisma as unknown as PrismaService);
  }

  it('retorna ranking com rank atribuído por índice', async () => {
    prisma.user.findMany.mockResolvedValue([
      { id: 2, name: 'B', username: 'b', avatar: null, _count: { posts: 10, followers_list: 50 } },
      { id: 1, name: 'A', username: 'a', avatar: null, _count: { posts: 5, followers_list: 20 } },
    ]);

    const result = await makeSvc().getRanking(10);

    expect(result).toHaveLength(2);
    expect(result[0].rank).toBe(1);
    expect(result[0].id).toBe(2);
    expect(result[1].rank).toBe(2);
    expect(result[0].postCount).toBe(10);
    expect(result[0].followerCount).toBe(50);
  });

  it('limita o resultado a 50 mesmo se limit > 50', async () => {
    prisma.user.findMany.mockResolvedValue([]);
    await makeSvc().getRanking(200);
    expect(prisma.user.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ take: 50 }),
    );
  });

  it('retorna lista vazia se não houver usuários', async () => {
    prisma.user.findMany.mockResolvedValue([]);
    const result = await makeSvc().getRanking();
    expect(result).toEqual([]);
  });
});
