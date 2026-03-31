import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PostsService } from './posts.service';

describe('PostsService', () => {
  const prisma = {
    media: {
      create: jest.fn(),
      findMany: jest.fn(),
      updateMany: jest.fn(),
    },
    post: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
    $transaction: jest.fn(),
  } as any;

  const supabase = {
    getBucketName: jest.fn(() => 'bucket'),
    createSignedUploadUrl: jest.fn(),
  } as any;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('createUpload cria media e retorna signedUploadUrl', async () => {
    supabase.createSignedUploadUrl.mockResolvedValue({
      signedUrl: 'https://signed',
      path: 'x',
      token: 't',
    });
    prisma.media.create.mockResolvedValue({ id: 123, path: 'users/1/posts/x.jpg' });

    const svc = new PostsService(prisma, supabase);
    const res = await svc.createUpload(1, { kind: 'photo', mimeType: 'image/jpeg', size: 10 });

    expect(res.mediaId).toBe(123);
    expect(res.signedUploadUrl).toBe('https://signed');
    expect(prisma.media.create).toHaveBeenCalled();
  });

  it('createPost rejeita media de outro usuário', async () => {
    prisma.media.findMany.mockResolvedValue([{ id: 1, owner_id: 2, status: 'pending' }]);
    const svc = new PostsService(prisma, supabase);
    await expect(svc.createPost(1, { mediaIds: [1] })).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('createPost rejeita quando falta media', async () => {
    prisma.media.findMany.mockResolvedValue([{ id: 1, owner_id: 1, status: 'pending' }]);
    const svc = new PostsService(prisma, supabase);
    await expect(svc.createPost(1, { mediaIds: [1, 2] })).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('createPost cria post e retorna dto via getPostById', async () => {
    prisma.media.findMany.mockResolvedValue([
      { id: 1, owner_id: 1, status: 'pending' },
      { id: 2, owner_id: 1, status: 'pending' },
    ]);

    prisma.$transaction.mockImplementation(async (fn: any) => {
      const tx = {
        post: { create: jest.fn().mockResolvedValue({ id: 99 }) },
        media: { updateMany: jest.fn() },
      };
      return fn(tx);
    });

    prisma.post.findUnique.mockResolvedValue({
      id: 99,
      caption: 'oi',
      created_at: new Date('2026-01-01T00:00:00.000Z'),
      author: { id: 1, name: 'S', avatar: null },
      media: [
        {
          order: 0,
          media: {
            id: 1,
            bucket: 'bucket',
            path: 'p',
            kind: 'photo',
            mime_type: 'image/jpeg',
            size: 10,
            status: 'ready',
          },
        },
      ],
    });

    const svc = new PostsService(prisma, supabase);
    const res = await svc.createPost(1, { caption: 'oi', mediaIds: [1, 2] });

    expect(res.id).toBe(99);
    expect(prisma.$transaction).toHaveBeenCalled();
  });
});

