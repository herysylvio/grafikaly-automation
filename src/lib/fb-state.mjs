import fs from 'node:fs/promises';
import path from 'node:path';

const DEFAULT_STATE_FILE = path.resolve('backups', 'fb-processed-state.json');

async function readState(filePath = DEFAULT_STATE_FILE) {
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    return JSON.parse(raw);
  } catch {
    return { processed: {} };
  }
}

export async function hasProcessedId(id, filePath = DEFAULT_STATE_FILE) {
  const state = await readState(filePath);
  return Boolean(state.processed[id]);
}

export async function markAsProcessed(id, metadata = {}, filePath = DEFAULT_STATE_FILE) {
  const state = await readState(filePath);
  state.processed[id] = {
    processedAt: new Date().toISOString(),
    ...metadata,
  };
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(state, null, 2), 'utf8');
}
