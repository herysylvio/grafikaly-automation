import test from 'node:test';
import assert from 'node:assert/strict';
import { validateEnvConfig } from '../src/lib/config.mjs';

test('validateEnvConfig rejette si email ou mot de passe manquant', () => {
  assert.throws(
    () => validateEnvConfig({}),
    /GRAFIKALY_ADMIN_EMAIL/
  );
});

test('validateEnvConfig retourne la configuration normalisée', () => {
  const cfg = validateEnvConfig({
    GRAFIKALY_ADMIN_EMAIL: 'admin@grafikaly.mg',
    GRAFIKALY_ADMIN_PASSWORD: 'secret-password',
  });
  assert.equal(cfg.baseUrl, 'https://www.grafikaly.mg');
  assert.equal(cfg.email, 'admin@grafikaly.mg');
});
