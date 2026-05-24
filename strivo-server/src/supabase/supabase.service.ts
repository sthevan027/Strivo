import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private readonly client: ReturnType<typeof createClient>;
  private readonly bucket: string;

  constructor() {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_KEY;
    const bucket = process.env.BUCKET_NAME;

    if (!url || !key || !bucket) {
      throw new Error(
        'SUPABASE_URL/SUPABASE_KEY/BUCKET_NAME não configurados.',
      );
    }

    this.client = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    this.bucket = bucket;
  }

  getBucketName() {
    return this.bucket;
  }

  async createSignedUploadUrl(path: string) {
    const { data, error } = await this.client.storage
      .from(this.bucket)
      .createSignedUploadUrl(path, { upsert: false });

    if (error || !data) {
      throw new Error(error?.message ?? 'Falha ao criar signed upload URL.');
    }

    return data; // { signedUrl, path, token }
  }
}
