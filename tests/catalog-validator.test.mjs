import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateProductUpdate,
  computeProductDiff,
  validateCategoryUpdate,
  computeCategoryDiff,
  mapCategoryToMutationPayload,
} from '../src/lib/catalog-validator.mjs';

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

test('validateCategoryUpdate valide la présence du nom et du slug', () => {
  assert.throws(() => validateCategoryUpdate({}, { name: '' }), /nom de la catégorie/);
  assert.throws(() => validateCategoryUpdate({ name: 'IA' }, { slug: '' }), /slug de la catégorie/);
  const ok = validateCategoryUpdate({}, { name: 'Formation & Carrière', slug: 'formation-carriere' });
  assert.equal(ok.name, 'Formation & Carrière');
});

test('computeCategoryDiff calcule les différences avant/après', () => {
  const current = { id: 'cat-1', name: 'Outils IA', slug: 'outils-ia', display_order: 4 };
  const patch = { name: 'Outils IA & Productivité', display_order: 1 };
  const diff = computeCategoryDiff(current, patch);
  assert.equal(diff.id, 'cat-1');
  assert.deepEqual(diff.changes, {
    name: { from: 'Outils IA', to: 'Outils IA & Productivité' },
    display_order: { from: 4, to: 1 },
  });
});

test('mapCategoryToMutationPayload prépare un payload camelCase propre', () => {
  const payload = mapCategoryToMutationPayload({
    id: 'cat-1',
    name: 'Outils IA & Productivité',
    slug: 'outils-ia',
    display_order: 1,
    icon: 'Sparkles',
  });
  assert.equal(payload.id, 'cat-1');
  assert.equal(payload.name, 'Outils IA & Productivité');
  assert.equal(payload.displayOrder, 1);
  assert.equal(payload.icon, 'Sparkles');
  assert.equal(payload.isActive, true);
});
