import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { SupabaseService } from '../supabase/supabase.service';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateUploadDto } from './dto/create-upload.dto';
import { randomUUID } from 'crypto';

function assertAllowedMime(kind: 'photo' | 'video', mimeType: string) {
  if (kind === 'photo' && !mimeType.startsWith('image/')) {
    throw new BadRequestException('mimeType inválido para photo.');
  }
  if (kind === 'video' && !mimeType.startsWith('video/')) {
    throw new BadRequestException('mimeType inválido para video.');
  }
}

function guessExtension(mimeType: string) {
  const map: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'video/mp4': 'mp4',
    'video/webm': 'webm',
    'video/quicktime': 'mov',
  };
  return map[mimeType] ?? 'bin';
}

type Cursor = { createdAt: string; id: number };

function encodeCursor(cursor: Cursor) {
  return Buffer.from(JSON.stringify(cursor), 'utf8').toString('base64url');
}

function decodeCursor(cursor?: string): Cursor | undefined {
  if (!cursor) return undefined;
  try {
    const raw = Buffer.from(cursor, 'base64url').toString('utf8');
    return JSON.parse(raw) as Cursor;
  } catch {
    throw new BadRequestException('cursor inválido.');
  }
}

@Injectable()
export class PostsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly supabase: SupabaseService,
  ) {}

  async createUpload(userId: number, dto: CreateUploadDto) {
    assertAllowedMime(dto.kind, dto.mimeType);

    const now = new Date();
    const yyyy = String(now.getUTCFullYear());
    const mm = String(now.getUTCMonth() + 1).padStart(2, '0');
    const ext = guessExtension(dto.mimeType);
    const path = `users/${userId}/posts/${yyyy}/${mm}/${randomUUID()}.${ext}`;

    const signed = await this.supabase.createSignedUploadUrl(path);

    const media = await this.prisma.media.create({
      data: {
        owner_id: userId,
        bucket: this.supabase.getBucketName(),
        path,
        kind: dto.kind,
        mime_type: dto.mimeType,
        size: dto.size,
        status: 'pending',
      },
      select: { id: true, path: true },
    });

    return {
      mediaId: media.id,
      path: media.path,
      signedUploadUrl: signed.signedUrl,
      token: signed.token,
    };
  }

  async createPost(userId: number, dto: CreatePostDto) {
    const media = await this.prisma.media.findMany({
      where: { id: { in: dto.mediaIds } },
      select: { id: true, owner_id: true, status: true },
    });

    if (media.length !== dto.mediaIds.length) {
      throw new NotFoundException('Uma ou mais mídias não foram encontradas.');
    }
    const invalidOwner = media.find((m) => m.owner_id !== userId);
    if (invalidOwner) {
      throw new BadRequestException('Uma ou mais mídias não pertencem ao usuário.');
    }

    return this.prisma.$transaction(async (tx) => {
      const post = await tx.post.create({
        data: {
          author_id: userId,
          caption: dto.caption,
          media: {
            createMany: {
              data: dto.mediaIds.map((id, idx) => ({ media_id: id, order: idx })),
            },
          },
        },
        select: { id: true },
      });

      await tx.media.updateMany({
        where: { id: { in: dto.mediaIds }, owner_id: userId },
        data: { status: 'ready' },
      });

      return this.getPostById(post.id);
    });
  }

  async getPostById(postId: number) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: { select: { id: true, name: true, avatar: true } },
        media: {
          orderBy: { order: 'asc' },
          include: { media: true },
        },
      },
    });
    if (!post) throw new NotFoundException('Post não encontrado.');

    return {
      id: post.id,
      caption: post.caption,
      createdAt: post.created_at,
      author: post.author,
      media: post.media.map((pm) => ({
        id: pm.media.id,
        bucket: pm.media.bucket,
        path: pm.media.path,
        kind: pm.media.kind,
        mimeType: pm.media.mime_type,
        size: pm.media.size,
        status: pm.media.status,
        order: pm.order,
      })),
    };
  }

  async getFeed(limit = 20, cursor?: string) {
    const take = Math.max(1, Math.min(limit, 50));
    const decoded = decodeCursor(cursor);

    const where = decoded
      ? {
          OR: [
            { created_at: { lt: new Date(decoded.createdAt) } },
            { created_at: new Date(decoded.createdAt), id: { lt: decoded.id } },
          ],
        }
      : {};

    const posts = await this.prisma.post.findMany({
      where,
      orderBy: [{ created_at: 'desc' }, { id: 'desc' }],
      take: take + 1,
      include: {
        author: { select: { id: true, name: true, avatar: true } },
        media: {
          orderBy: { order: 'asc' },
          include: { media: true },
        },
      },
    });

    const hasMore = posts.length > take;
    const items = (hasMore ? posts.slice(0, take) : posts).map((post) => ({
      id: post.id,
      caption: post.caption,
      createdAt: post.created_at,
      author: post.author,
      media: post.media.map((pm) => ({
        id: pm.media.id,
        bucket: pm.media.bucket,
        path: pm.media.path,
        kind: pm.media.kind,
        mimeType: pm.media.mime_type,
        size: pm.media.size,
        status: pm.media.status,
        order: pm.order,
      })),
    }));

    const nextCursor = hasMore
      ? encodeCursor({
          createdAt: items[items.length - 1].createdAt.toISOString(),
          id: items[items.length - 1].id,
        })
      : undefined;

    return { items, nextCursor };
  }
}

