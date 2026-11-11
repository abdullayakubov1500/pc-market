import { NextResponse } from 'next/server';
import { uploadToStorage } from '@/lib/storage';
import { promises as fs } from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate mime type: images and pdf
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Неподдерживаемый формат. Загрузите картинку (JPG, PNG, WEBP) или PDF файл.' },
        { status: 400 }
      );
    }

    // Limit size to 15MB
    if (file.size > 15 * 1024 * 1024) {
      return NextResponse.json({ error: 'Размер файла не должен превышать 15 МБ' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let fileUrl: string;

    // Use Neon Object Storage if configured
    if (process.env.AWS_ENDPOINT_URL_S3 && process.env.AWS_ACCESS_KEY_ID) {
      const upload = await uploadToStorage(buffer, file.name, file.type);
      fileUrl = upload.url;
    } else {
      // Local disk fallback
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'receipts');
      await fs.mkdir(uploadDir, { recursive: true });

      const safeName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      const filePath = path.join(uploadDir, safeName);
      await fs.writeFile(filePath, buffer);

      fileUrl = `/uploads/receipts/${safeName}`;
    }

    return NextResponse.json({
      success: true,
      fileUrl,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
    });
  } catch (error: any) {
    console.error('File upload error:', error);
    return NextResponse.json({ error: error.message || 'Failed to upload file' }, { status: 500 });
  }
}
