import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class RankingService {
  constructor(private readonly prisma: PrismaService) {}

  async getRanking(limit = 20) {
    const users = await this.prisma.user.findMany({
      take: Math.min(limit, 50),
      orderBy: { posts: { _count: 'desc' } },
      select: {
        id: true,
        name: true,
        username: true,
        avatar: true,
        _count: { select: { posts: true, followers_list: true } },
      },
    });

    return users.map((u, idx) => ({
      rank: idx + 1,
      id: u.id,
      name: u.name,
      username: u.username,
      avatar: u.avatar,
      postCount: u._count.posts,
      followerCount: u._count.followers_list,
    }));
  }
}
