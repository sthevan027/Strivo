import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getMe(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        bio: true,
        avatar: true,
        phone: true,
        created_at: true,
      },
    });
    if (!user) throw new NotFoundException('Usuário não encontrado.');
    return user;
  }

  async search(q: string, currentUserId: number) {
    const term = q?.trim() ?? '';
    if (term.length < 2) return [];

    const users = await this.prisma.user.findMany({
      where: {
        id: { not: currentUserId },
        OR: [
          { name: { contains: term, mode: 'insensitive' } },
          { username: { contains: term, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        name: true,
        username: true,
        avatar: true,
        followers_list: {
          where: { follower_id: currentUserId },
          select: { follower_id: true },
        },
      },
      take: 20,
    });

    return users.map((u) => ({
      id: u.id,
      name: u.name,
      username: u.username,
      avatar: u.avatar,
      isFollowing: u.followers_list.length > 0,
    }));
  }

  async follow(followerId: number, followingId: number) {
    if (followerId === followingId) {
      throw new BadRequestException('Não é possível seguir a si mesmo.');
    }
    const target = await this.prisma.user.findUnique({
      where: { id: followingId },
      select: { id: true },
    });
    if (!target) throw new NotFoundException('Usuário não encontrado.');
    await this.prisma.follow.upsert({
      where: {
        follower_id_following_id: { follower_id: followerId, following_id: followingId },
      },
      create: { follower_id: followerId, following_id: followingId },
      update: {},
    });
    return { message: 'ok' };
  }

  async unfollow(followerId: number, followingId: number) {
    await this.prisma.follow.deleteMany({
      where: { follower_id: followerId, following_id: followingId },
    });
    return { message: 'ok' };
  }

  async updateMe(userId: number, dto: UpdateProfileDto) {
    if (dto.username) {
      const exists = await this.prisma.user.findFirst({
        where: { username: dto.username, id: { not: userId } },
      });
      if (exists) throw new ConflictException('Username já em uso.');
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.username !== undefined && { username: dto.username }),
        ...(dto.bio !== undefined && { bio: dto.bio }),
        ...(dto.avatar !== undefined && { avatar: dto.avatar }),
        ...(dto.phone !== undefined && { phone: dto.phone }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        bio: true,
        avatar: true,
        phone: true,
      },
    });
  }
}
