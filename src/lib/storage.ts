import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

const bucketName = process.env.NEON_STORAGE_BUCKET || 'receipts';

let s3ClientInstance: S3Client | null = null;

function getS3Client(): S3Client {
  if (!s3ClientInstance) {
    s3ClientInstance = new S3Client({
      forcePathStyle: true,
      endpoint: process.env.AWS_ENDPOINT_URL_S3,
      region: process.env.AWS_REGION || 'us-east-2',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      },
    });
  }
  return s3ClientInstance;
}

export interface UploadResult {
  url: string;
  key: string;
  fileName: string;
  size: number;
  mimeType: string;
}

/**
 * Uploads a file buffer to Neon Object Storage.
 */
export async function uploadToStorage(
  buffer: Buffer,
  originalName: string,
  mimeType: string
): Promise<UploadResult> {
  const s3 = getS3Client();
  const sanitized = originalName.replace(/[^a-zA-Z0-9._-]/g, '_');
  const key = `receipts/${Date.now()}_${sanitized}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: buffer,
      ContentType: mimeType,
    })
  );

  const endpoint = process.env.AWS_ENDPOINT_URL_S3?.replace(/\/$/, '') || '';
  const url = `${endpoint}/${bucketName}/${key}`;

  return {
    url,
    key,
    fileName: originalName,
    size: buffer.length,
    mimeType,
  };
}

/**
 * Downloads a file from Neon Object Storage by its key or full URL.
 */
export async function downloadFromStorage(keyOrUrl: string): Promise<{ buffer: Buffer; contentType: string }> {
  const s3 = getS3Client();
  
  // Extract key if full URL passed
  let key = keyOrUrl;
  if (keyOrUrl.startsWith('http')) {
    const parts = new URL(keyOrUrl).pathname.split('/');
    // pathname is /<bucket>/<key...>
    if (parts.length > 2 && parts[1] === bucketName) {
      key = parts.slice(2).join('/');
    }
  }

  const response = await s3.send(
    new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    })
  );

  const bytes = await response.Body?.transformToByteArray();
  const buffer = Buffer.from(bytes || []);
  const contentType = response.ContentType || 'application/octet-stream';

  return { buffer, contentType };
}
