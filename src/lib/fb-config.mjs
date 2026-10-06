import fs from 'node:fs';
import path from 'node:path';

export function loadLocalEnv(envPath = path.resolve('.env')) {
  const out = { ...process.env };
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    for (const line of content.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx > 0) {
        const key = trimmed.slice(0, eqIdx).trim();
        const val = trimmed.slice(eqIdx + 1).trim().replace(/^['"]|['"]$/g, '');
        if (!out[key]) out[key] = val;
      }
    }
  }
  return out;
}

export function validateFbEnvConfig(env = loadLocalEnv()) {
  const pageId = env.FB_PAGE_ID?.trim() || 'me';
  const pageAccessToken = env.FB_PAGE_ACCESS_TOKEN?.trim();
  const apiVersion = env.FB_API_VERSION?.trim() || 'v21.0';
  const siteBaseUrl = (env.GRAFIKALY_BASE_URL || 'https://www.grafikaly.mg').replace(/\/$/, '');

  if (!pageAccessToken) {
    throw new Error('Variable manquante : FB_PAGE_ACCESS_TOKEN dans .env');
  }

  return { pageId, pageAccessToken, apiVersion, siteBaseUrl };
}

export function buildGraphUrl(cfg, endpoint) {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `https://graph.facebook.com/${cfg.apiVersion}${cleanEndpoint}`;
}

export async function callGraphApi(cfg, endpoint, { method = 'GET', params = {}, body = null } = {}) {
  const url = new URL(buildGraphUrl(cfg, endpoint));
  url.searchParams.set('access_token', cfg.pageAccessToken);
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null) {
      url.searchParams.set(k, String(v));
    }
  }

  const options = { method, headers: {} };
  if (body && method !== 'GET') {
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(body);
  }

  const res = await fetch(url, options);
  const data = await res.json();
  if (!res.ok || data.error) {
    const errMsg = data.error?.message || `HTTP ${res.status}`;
    const errCode = data.error?.code || res.status;
    const err = new Error(`Meta Graph API Error (${errCode}): ${errMsg}`);
    err.code = errCode;
    throw err;
  }
  return data;
}
