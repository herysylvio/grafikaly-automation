import fs from 'node:fs';
import path from 'node:path';

export function loadDotEnv(envPath = path.resolve(process.cwd(), '.env')) {
  if (!fs.existsSync(envPath)) return {};
  const content = fs.readFileSync(envPath, 'utf8').replace(/^\uFEFF/, '');
  const parsed = {};
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const eqIdx = line.indexOf('=');
    if (eqIdx === -1) continue;
    const key = line.slice(0, eqIdx).trim().replace(/^\uFEFF/, '');
    const val = line.slice(eqIdx + 1).trim().replace(/^['"]|['"]$/g, '');
    parsed[key] = val;
    if (process.env[key] === undefined) {
      process.env[key] = val;
    }
  }
  return parsed;
}

export function validateEnvConfig(env = process.env) {
  const email = env.GRAFIKALY_ADMIN_EMAIL?.trim();
  const password = env.GRAFIKALY_ADMIN_PASSWORD?.trim();
  const baseUrl = (env.GRAFIKALY_BASE_URL || 'https://www.grafikaly.mg').replace(/\/$/, '');

  if (!email) {
    throw new Error('Variable manquante : GRAFIKALY_ADMIN_EMAIL dans .env');
  }
  if (!password) {
    throw new Error('Variable manquante : GRAFIKALY_ADMIN_PASSWORD dans .env');
  }
  return { email, password, baseUrl };
}
