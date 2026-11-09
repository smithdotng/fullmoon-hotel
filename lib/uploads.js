import { mkdir, writeFile } from 'fs/promises';
import path from 'path';

// Uploaded files live outside /public (Next.js only serves files that existed at
// build time from there) and are served by app/uploads/[...path]/route.js.
export const UPLOAD_ROOT = path.resolve(process.env.UPLOAD_DIR || path.join(process.cwd(), 'storage', 'uploads'));

const MAX_BYTES = 5 * 1024 * 1024;
const EXT = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp', 'image/gif': '.gif', 'image/avif': '.avif' };

// Save image files from a FormData field into storage/uploads/<folder>/.
// Returns the public URLs (/uploads/<folder>/<name>).
export async function saveImages(formData, field, folder, max = 5) {
  const files = formData.getAll(field).filter((f) => f && typeof f === 'object' && f.size > 0).slice(0, max);
  const urls = [];
  if (!files.length) return urls;
  const dir = path.join(UPLOAD_ROOT, folder);
  await mkdir(dir, { recursive: true });
  for (const file of files) {
    if (!file.type?.startsWith('image/')) throw new Error('Only image files are allowed!');
    if (file.size > MAX_BYTES) throw new Error('Images must be 5MB or smaller');
    const ext = EXT[file.type] || path.extname(file.name || '').toLowerCase() || '.jpg';
    const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    await writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));
    urls.push(`/uploads/${folder}/${name}`);
  }
  return urls;
}
