import test from 'node:test';
import assert from 'node:assert/strict';
import { validateFbEnvConfig, buildGraphUrl } from '../src/lib/fb-config.mjs';

test('validateFbEnvConfig rejette si FB_PAGE_ACCESS_TOKEN manquant et utilise "me" par défaut pour FB_PAGE_ID', () => {
  assert.throws(
    () => validateFbEnvConfig({}),
    /FB_PAGE_ACCESS_TOKEN/
  );
  const cfg = validateFbEnvConfig({ FB_PAGE_ACCESS_TOKEN: 'EAABsb...' });
  assert.equal(cfg.pageId, 'me');
});

test('validateFbEnvConfig normalise la version API et construit une URL Graph propre', () => {
  const cfg = validateFbEnvConfig({
    FB_PAGE_ID: '987654321',
    FB_PAGE_ACCESS_TOKEN: 'EAABsbCS1iHgBO...',
  });
  assert.equal(cfg.pageId, '987654321');
  assert.equal(cfg.apiVersion, 'v21.0');
  assert.equal(
    buildGraphUrl(cfg, '/987654321/feed'),
    'https://graph.facebook.com/v21.0/987654321/feed'
  );
});
