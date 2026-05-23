// NovelStack — Cloudflare R2 object storage (S3-compatible).
// Used for author-uploaded book cover images. R2 speaks the S3 API, so the
// AWS SDK works against it once `region` is 'auto' and `endpoint` points at
// the account's R2 endpoint.
import 'server-only';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';

// R2_ENDPOINT looks like https://<account-id>.r2.cloudflarestorage.com
const ENDPOINT = process.env.R2_ENDPOINT ?? '';
const ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID ?? '';
const SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY ?? '';
export const R2_BUCKET = process.env.R2_BUCKET ?? 'novelstack-covers';

// True only when every R2 credential is present — lets callers fail with a
// clean message instead of an opaque SDK error.
export function r2Configured(): boolean {
  return !!(ENDPOINT && ACCESS_KEY_ID && SECRET_ACCESS_KEY);
}

let client: S3Client | null = null;
function r2(): S3Client {
  if (!client) {
    client = new S3Client({
      region: 'auto',
      endpoint: ENDPOINT,
      credentials: { accessKeyId: ACCESS_KEY_ID, secretAccessKey: SECRET_ACCESS_KEY },
    });
  }
  return client;
}

// Allowed cover image types → file extension.
const EXT_BY_TYPE: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

export function isAllowedImageType(type: string): boolean {
  return type in EXT_BY_TYPE;
}

// Uploads a cover image and returns its object key (e.g. "8f3c…-.jpg").
export async function uploadCover(body: Buffer, contentType: string): Promise<string> {
  const ext = EXT_BY_TYPE[contentType] ?? 'jpg';
  const key = `${randomUUID()}.${ext}`;
  await r2().send(
    new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      Body: body,
      ContentType: contentType,
      CacheControl: 'public, max-age=31536000, immutable',
    }),
  );
  return key;
}

export type CoverObject = {
  body: Uint8Array;
  contentType: string;
};

// Fetches a cover image back out of R2 for the public serving route.
export async function getCover(key: string): Promise<CoverObject | null> {
  try {
    const res = await r2().send(
      new GetObjectCommand({ Bucket: R2_BUCKET, Key: key }),
    );
    if (!res.Body) return null;
    const bytes = await res.Body.transformToByteArray();
    return {
      body: bytes,
      contentType: res.ContentType ?? 'image/jpeg',
    };
  } catch {
    return null;
  }
}
