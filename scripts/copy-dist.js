import fs from 'fs';
import path from 'path';

const rootDist = path.resolve(process.cwd(), 'dist');
const frontendDist = path.resolve(process.cwd(), 'frontend', 'dist');
const adminDist = path.resolve(process.cwd(), 'admin', 'dist');

try {
  if (fs.existsSync(frontendDist)) {
    fs.mkdirSync(rootDist, { recursive: true });
    fs.cpSync(frontendDist, rootDist, { recursive: true });
    console.log('✅ Copied frontend build to root dist/');
  }
  if (fs.existsSync(adminDist)) {
    const adminDest = path.join(rootDist, 'admin');
    fs.mkdirSync(adminDest, { recursive: true });
    fs.cpSync(adminDist, adminDest, { recursive: true });
    console.log('✅ Copied admin build to root dist/admin/');
  }
} catch (err) {
  console.warn('⚠️ Note during copy-dist:', err.message);
}
