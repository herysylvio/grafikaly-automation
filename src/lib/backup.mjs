import fs from 'node:fs/promises';
import path from 'node:path';

export async function saveSnapshot(entity, data, backupDir = path.resolve('backups')) {
  await fs.mkdir(backupDir, { recursive: true });
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filePath = path.join(backupDir, `${timestamp}-${entity}.json`);
  const payload = {
    entity,
    createdAt: new Date().toISOString(),
    data,
  };
  await fs.writeFile(filePath, JSON.stringify(payload, null, 2), 'utf8');
  return filePath;
}

export async function loadSnapshot(filePath) {
  const raw = await fs.readFile(filePath, 'utf8');
  return JSON.parse(raw);
}
