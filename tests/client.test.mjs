import test from 'node:test';
import assert from 'node:assert/strict';
import {
  SERVER_FNS,
  buildServerFnRequest,
  mapDbProductToMutationPayload,
  serovalSerialize,
  serovalDeserialize,
} from '../src/lib/client.mjs';

test('SERVER_FNS contient uniquement les endpoints Catalogue et Marketing autorisés', () => {
  assert.ok(SERVER_FNS.catalog.listProducts.id);
  assert.ok(SERVER_FNS.catalog.upsertProduct.id);
  assert.ok(SERVER_FNS.marketing.getOverview.id);
  assert.ok(SERVER_FNS.marketing.saveCampaignDraft.id);
  assert.equal(SERVER_FNS.payments, undefined);
  assert.equal(SERVER_FNS.masterAccounts, undefined);
});

test('serovalSerialize et serovalDeserialize font un aller-retour fidèle', () => {
  const original = {
    data: {
      segmentKey: 'all_consented',
      count: 42,
      active: true,
      nested: ['a', 'b'],
    },
  };
  const encoded = serovalSerialize(original);
  const decoded = serovalDeserialize(encoded);
  assert.deepEqual(decoded, original);
});

test('buildServerFnRequest construit les en-têtes TanStack Start et le payload GET/POST', () => {
  const getReq = buildServerFnRequest(
    'https://www.grafikaly.mg',
    SERVER_FNS.catalog.listProducts,
    { search: 'Canva' },
    'fake-jwt-token'
  );
  assert.equal(getReq.method, 'GET');
  assert.equal(getReq.headers.Authorization, 'Bearer fake-jwt-token');
  assert.equal(getReq.headers['x-tsr-serverFn'], 'true');
  assert.equal(getReq.headers['sec-fetch-site'], 'same-origin');
  assert.ok(getReq.url.startsWith('https://grafikaly.mg/_serverFn/a32abab4'));

  const postReq = buildServerFnRequest(
    'https://www.grafikaly.mg',
    SERVER_FNS.marketing.previewSegment,
    { segmentKey: 'all_consented', segmentParams: {} },
    'fake-jwt-token'
  );
  assert.equal(postReq.method, 'POST');
  assert.equal(postReq.headers['Content-Type'], 'application/json');
  assert.deepEqual(serovalDeserialize(JSON.parse(postReq.body)), {
    data: { segmentKey: 'all_consented', segmentParams: {} },
  });
});

test('mapDbProductToMutationPayload préserve tous les champs existants du produit lors d’un patch', () => {
  const dbProduct = {
    id: 'prod-123',
    name: 'Canva Pro',
    slug: 'canva-pro',
    category_id: 'cat-1',
    short_description: 'Outil design',
    full_description: 'Description complète',
    image_url: 'https://example.com/canva.png',
    price_mga: 20000,
    compare_at_price_mga: null,
    product_type: 'shared_credentials',
    activation_type: 'instant_credentials',
    duration_label: '1 mois',
    duration_days: 30,
    delivery_eta: 'Immédiat',
    post_purchase_instructions: 'Instructions',
    additional_info: 'Info',
    promo_badge: null,
    is_featured: true,
    is_active: true,
    single_unit_only: false,
    promo_code_enabled: false,
    display_order: 1,
    meta_title: 'Canva Pro MGA',
    meta_description: 'Meta',
    digital_inventory: [{ mode: 'slots', total_units: 10, used_units: 3, low_threshold: 2, status: 'available', notes: '' }],
    product_faqs: [{ id: 'faq-1', question: 'Q?', answer: 'A.' }],
  };

  const payload = mapDbProductToMutationPayload(dbProduct, {
    compare_at_price_mga: 74000,
    promo_code_enabled: true,
  });

  assert.equal(payload.id, 'prod-123');
  assert.equal(payload.priceMga, 20000);
  assert.equal(payload.compareAtPriceMga, 74000);
  assert.equal(payload.promoCodeEnabled, true);
  assert.equal(payload.inventory.mode, 'slots');
  assert.equal(payload.inventory.totalUnits, 10);
  assert.equal(payload.faq.length, 1);
});
