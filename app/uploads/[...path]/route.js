import { readFile, stat } from 'fs/promises';
import path from 'path';
import { UPLOAD_ROOT } from '@/lib/uploads';

const TYPES = {
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp',
  '.gif': 'image/gif', '.avif': 'image/avif', '.svg': 'image/svg+xml',
};

// Serves admin-uploaded images from storage/uploads (or UPLOAD_DIR) at /uploads/...
export async function GET(request, { params }) {
  const { path: parts } = await params;
  const file = path.resolve(UPLOAD_ROOT, ...parts);
  if (!file.startsWith(UPLOAD_ROOT + path.sep)) return new Response('Not found', { status: 404 });
  const type = TYPES[path.extname(file).toLowerCase()];
  if (!type) return new Response('Not found', { status: 404 });
  try {
    const info = await stat(file);
    if (!info.isFile()) throw new Error('not a file');
    const data = await readFile(file);
    return new Response(data, {
      headers: {
        'Content-Type': type,
        'Content-Length': String(info.size),
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch {
    return new Response('Not found', { status: 404 });
  }
}
