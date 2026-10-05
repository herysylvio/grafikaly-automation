import test from 'node:test';
import assert from 'node:assert/strict';
import { validateProductUpdate, computeProductDiff } from '../src/lib/catalog-validator.mjs';

test('validateProductUpdate refuse un compare_at_price_mga inférieur ou égal à price_mga', () => {
  const current = { id: '1', name: 'Canva Pro', price_mga: 20000, compare_at_price_mga: null };
  assert.throws(
    () => validateProductUpdate(current, { compare_at_price_mga: 15000 }),
    /compare_at_price_mga doit être strictement supérieur à price_mga/
  );
});

test('computeProductDiff retourne uniquement les champs modifiés avant/après', () => {
  const current = { id: '1', name: 'Canva Pro', price_mga: 20000, compare_at_price_mga: null, promo_code_enabled: false };
  const patch = { compare_at_price_mga: 74000, promo_code_enabled: true };
  const diff = computeProductDiff(current, patch);

  assert.deepEqual(diff.changes, {
    compare_at_price_mga: { from: null, to: 74000 },
    promo_code_enabled: { from: false, to: true },
  });
});
