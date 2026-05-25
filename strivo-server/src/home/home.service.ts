import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class HomeService {
  constructor(private readonly prisma: PrismaService) {}

  async getHome() {
    const users = await this.prisma.user.findMany({
      take: 5,
      orderBy: { posts: { _count: 'desc' } },
      select: {
        id: true,
        name: true,
        username: true,
        avatar: true,
        _count: { select: { posts: true, followers_list: true } },
      },
    });

    return {
      topStreamers: users.map((u, idx) => ({
        rank: idx + 1,
        id: u.id,
        name: u.name,
        username: u.username,
        avatar: u.avatar,
        postCount: u._count.posts,
        followerCount: u._count.followers_list,
      })),
      featuredLives: [] as never[],
    };
  }
}
