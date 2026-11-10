import { mkdir, writeFile } from 'fs/promises';
import path from 'path';

// Where uploads go:
// - On Vercel (BLOB_READ_WRITE_TOKEN set): Vercel Blob; the full https URL is stored.
// - Elsewhere: storage/uploads (or UPLOAD_DIR) on disk, served by
//   app/api/uploads/[...path]/route.js at /uploads/... via a rewrite (Next.js only
//   serves /public files that existed at build time).
// Images uploaded before the move to Next.js ship in public/uploads.
export const UPLOAD_ROOT = path.resolve(process.env.UPLOAD_DIR || path.join(process.cwd(), 'storage', 'uploads'));
const useBlob = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);

const MAX_BYTES = 5 * 1024 * 1024;
const EXT = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp', 'image/gif': '.gif', 'image/avif': '.avif' };

// Save image files from a FormData field. Returns the URLs to store on the record.
export async function saveImages(formData, field, folder, max = 5) {
  const files = formData.getAll(field).filter((f) => f && typeof f === 'object' && f.size > 0).slice(0, max);
  const urls = [];
  if (!files.length) return urls;
  for (const file of files) {
    if (!file.type?.startsWith('image/')) throw new Error('Only image files are allowed!');
    if (file.size > MAX_BYTES) throw new Error('Images must be 5MB or smaller');
  }
  if (!useBlob()) await mkdir(path.join(UPLOAD_ROOT, folder), { recursive: true });
  for (const file of files) {
    const ext = EXT[file.type] || path.extname(file.name || '').toLowerCase() || '.jpg';
    const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    if (useBlob()) {
      const { put } = await import('@vercel/blob');
      const blob = await put(`uploads/${folder}/${name}`, file, { access: 'public', contentType: file.type });
      urls.push(blob.url);
    } else {
      await writeFile(path.join(UPLOAD_ROOT, folder, name), Buffer.from(await file.arrayBuffer()));
      urls.push(`/uploads/${folder}/${name}`);
    }
  }
  return urls;
}
