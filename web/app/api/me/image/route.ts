import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { uploadCover, isAllowedImageType, r2Configured } from '@/lib/r2';

// Inline chapter illustrations. Same R2 store + serving route as covers
// (uploadCover is a generic image upload), but exposed under its own name so
// the editor's intent is clear. Capped a little higher than a cover since an
// illustration is shown full-bleed in the reader.
const MAX_BYTES = 8 * 1024 * 1024;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://novelstack.app';

// POST /api/me/image  — multipart/form-data with a `file` field.
// Uploads the image to R2 and returns { url } for the editor to drop into the
// chapter body as ![caption](url).
export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });

  if (!r2Configured()) {
    return NextResponse.json(
      { error: 'Image uploads are not configured on this server.' },
      { status: 503 },
    );
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: 'Expected a file upload.' }, { status: 400 });
  }

  const file = form.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Missing file.' }, { status: 400 });
  }
  if (!isAllowedImageType(file.type)) {
    return NextResponse.json(
      { error: 'Illustration must be a JPEG, PNG or WebP image.' },
      { status: 400 },
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: 'Illustration must be 8 MB or smaller.' },
      { status: 400 },
    );
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const key = await uploadCover(buffer, file.type);
    return NextResponse.json({ url: `${SITE_URL}/api/covers/${key}` });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Upload failed.';
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
