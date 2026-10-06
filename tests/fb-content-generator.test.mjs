import test from 'node:test';
import assert from 'node:assert/strict';
import { generatePsychologicalPost, filterAvailableProducts } from '../src/lib/fb-content-generator.mjs';

test('filterAvailableProducts exclut les produits en rupture ET les produits streaming', () => {
  const products = [
    { slug: 'canva-pro-education', availability: 'available', is_active: true },
    { slug: 'hostinger-business-3-en-1', availability: 'unavailable', is_active: true },
    { slug: 'netflix-smartphone-pc-uniquement', availability: 'available', is_active: true },
    { slug: 'spotify-premium', availability: 'available', is_active: true },
  ];
  const valid = filterAvailableProducts(products);
  assert.equal(valid.length, 1);
  assert.equal(valid[0].slug, 'canva-pro-education');
});

test('generatePsychologicalPost génère un post IA sans dévoiler le prix ni de lien externe dans le texte', () => {
  const product = {
    name: 'Canva Pro Éducation',
    slug: 'canva-pro-education',
    price_mga: 98000,
    compare_at_price_mga: 531000,
    duration_days: 365,
    availability: 'available',
    is_active: true,
  };

  const post = generatePsychologicalPost(product);
  assert.equal(post.priceRevealedInPost, false);
  assert.doesNotMatch(post.caption, /98 000/);
  assert.doesNotMatch(post.caption, /https:\/\//);
  assert.match(post.caption, /Commentez "CANVA" ou "INFO"/);
  assert.equal(post.published, false);
});
