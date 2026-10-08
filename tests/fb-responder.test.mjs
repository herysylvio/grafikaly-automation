import test from 'node:test';
import assert from 'node:assert/strict';
import { classifyCommentIntent, buildCommentActions, detectProductSlugFromText } from '../src/lib/fb-responder.mjs';

test('classifyCommentIntent détecte les demandes de prix en français et malgache', () => {
  assert.equal(classifyCommentIntent('Prix svp ?'), 'PRICE_OR_INFO');
  assert.equal(classifyCommentIntent('Mp azafady, ohatrinona ?'), 'PRICE_OR_INFO');
  assert.equal(classifyCommentIntent('Mbola misy ve ? Dispo ?'), 'PRICE_OR_INFO');
  assert.equal(classifyCommentIntent('Mon compte ne marche plus depuis hier'), 'SUPPORT_ALERT');
});

test('detectProductSlugFromText identifie le produit Grafikaly dans un post ou message', () => {
  assert.equal(detectProductSlugFromText('Abonnement Canva Pro 12 mois à 270 Ar/jour'), 'canva-pro-education');
  assert.equal(detectProductSlugFromText('Netflix Smart TV 4K disponible'), 'netflix-smart-TV');
  assert.equal(detectProductSlugFromText('Création de site e-commerce en 24h'), 'service-site-ecommerce');
});

test('buildCommentActions génère une réponse publique et un DM avec lien UTM et ancrage prix', () => {
  const comment = {
    id: 'cmt_1',
    message: 'Prix svp',
    created_time: new Date().toISOString(),
    from: { name: 'Rova Rakoto' },
  };
  const product = {
    name: 'Canva Pro Éducation',
    slug: 'canva-pro-education',
    price_mga: 14500,
    compare_at_price_mga: 59600,
    availability: 'available',
    remaining_slots: 14,
  };

  const plan = buildCommentActions({ comment, product, dryRun: true, variantIndex: 0 });
  assert.equal(plan.actionType, 'PUBLIC_AND_PRIVATE_REPLY');
  assert.equal(plan.dryRun, true);
  assert.match(plan.publicReply, /Rova/);
  assert.match(plan.privateReply, /14 500 Ar/);
  assert.match(plan.privateReply, /https:\/\/www\.grafikaly\.mg\/produit\/canva-pro-education\?utm_source=facebook&utm_medium=comment_dm/);
});

test('buildCommentActions bascule en réponse publique avec lien si le commentaire a plus de 7 jours', () => {
  const eightDaysAgo = new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString();
  const comment = {
    id: 'cmt_old',
    message: 'Mp',
    created_time: eightDaysAgo,
    from: { name: 'Tiana' },
  };
  const product = {
    name: 'PRIME VIDEO',
    slug: 'prime-video',
    price_mga: 19500,
    compare_at_price_mga: 30000,
    availability: 'available',
  };

  const plan = buildCommentActions({ comment, product, dryRun: true });
  assert.equal(plan.actionType, 'PUBLIC_ONLY_OLDER_THAN_7D');
  assert.equal(plan.privateReply, null);
  assert.match(plan.publicReply, /https:\/\/www\.grafikaly\.mg\/produit\/prime-video/);
});

test('buildCommentActions informe de la rupture de stock et redirige vers https://www.grafikaly.mg si le produit est indisponible', () => {
  const comment = {
    id: 'cmt_unavail',
    message: 'Salama tompoko, saika hanao abonnement Claude svp',
    created_time: new Date().toISOString(),
    from: { name: 'Santatra Nomenjanahary' },
  };
  const product = {
    name: 'Claude PRO | Compte partagé',
    slug: 'claude-pro-compte-partage',
    price_mga: 45000,
    availability: 'unavailable',
    is_active: true,
  };

  const plan = buildCommentActions({ comment, product, dryRun: true });
  assert.equal(plan.actionType, 'OUT_OF_STOCK_REDIRECT');
  assert.match(plan.publicReply, /rupture de stock/i);
  assert.match(plan.publicReply, /https:\/\/www\.grafikaly\.mg/);
  assert.match(plan.privateReply, /rupture de stock/i);
  assert.match(plan.privateReply, /https:\/\/www\.grafikaly\.mg/);
});

