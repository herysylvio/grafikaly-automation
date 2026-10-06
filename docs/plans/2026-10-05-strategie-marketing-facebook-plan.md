# Plan d'implémentation de la Stratégie Marketing & Automatisation Facebook

**Objectif :** Construire une suite CLI locale et sécurisée (`src/facebook.mjs` et ses modules TDD) permettant d'automatiser les réponses aux commentaires Facebook (`Private Reply` + commentaire public), la qualification Messenger vers `grafikaly.mg`, la génération du calendrier éditorial psychologique (Ariary/jour, Double Ancrage USD/MGA) et les kits de campagnes Facebook Ads.

**Architecture :** Modules Node.js ESM sans dépendances lourdes (`node:test`, `node:assert`, `fetch` natif) connectés à l'API Meta Graph (`v21.0`) via `.env` (`FB_PAGE_ID`, `FB_PAGE_ACCESS_TOKEN`), couplés à un moteur de règles bilingue FR/MG (`config/fb-rules.json`), un registre anti-doublon (`backups/fb-processed-state.json`) et un mode `--dry-run` par défaut obligatoire.

**Stack Technique :** Node.js 20+ (ESM natif, `node:test`, `node:assert/strict`, `node:fs/promises`), Meta Graph API v21.0, MCP Canva (pour la génération des visuels).

---

### Tâche 1 : Validateur de configuration Facebook (`.env`) et Client Meta Graph (`fb-client.mjs`)

**Fichiers :**
- Créer : `c:\Users\sylvi\DEV\GRAFIKALY\src\lib\fb-config.mjs`
- Tester : `c:\Users\sylvi\DEV\GRAFIKALY\tests\fb-config.test.mjs`

**Étape 1 : Écrire le test qui échoue**
```javascript
import test from 'node:test';
import assert from 'node:assert/strict';
import { validateFbEnvConfig, buildGraphUrl } from '../src/lib/fb-config.mjs';

test('validateFbEnvConfig rejette si FB_PAGE_ID ou FB_PAGE_ACCESS_TOKEN manquant', () => {
  assert.throws(
    () => validateFbEnvConfig({}),
    /FB_PAGE_ID/
  );
  assert.throws(
    () => validateFbEnvConfig({ FB_PAGE_ID: '12345' }),
    /FB_PAGE_ACCESS_TOKEN/
  );
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
```

**Étape 2 : Exécuter le test pour vérifier l'échec**
Exécuter : `node --test tests/fb-config.test.mjs`
Résultat attendu : ÉCHEC (`Cannot find module '../src/lib/fb-config.mjs'`)

**Étape 3 : Écrire l'implémentation minimale**
```javascript
// src/lib/fb-config.mjs
export function validateFbEnvConfig(env = process.env) {
  const pageId = env.FB_PAGE_ID?.trim();
  const pageAccessToken = env.FB_PAGE_ACCESS_TOKEN?.trim();
  const apiVersion = env.FB_API_VERSION?.trim() || 'v21.0';
  const siteBaseUrl = (env.GRAFIKALY_BASE_URL || 'https://www.grafikaly.mg').replace(/\/$/, '');

  if (!pageId) {
    throw new Error('Variable manquante : FB_PAGE_ID dans .env');
  }
  if (!pageAccessToken) {
    throw new Error('Variable manquante : FB_PAGE_ACCESS_TOKEN dans .env');
  }

  return { pageId, pageAccessToken, apiVersion, siteBaseUrl };
}

export function buildGraphUrl(cfg, endpoint) {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `https://graph.facebook.com/${cfg.apiVersion}${cleanEndpoint}`;
}
```

**Étape 4 : Exécuter le test pour vérifier le succès**
Exécuter : `node --test tests/fb-config.test.mjs`
Résultat attendu : SUCCÈS (2 tests passés)

**Étape 5 : Commiter les changements**
```bash
git add src/lib/fb-config.mjs tests/fb-config.test.mjs
git commit -m "feat(fb): ajouter validation .env et constructeur URL Meta Graph API"
```

---

### Tâche 2 : Moteur de détection d'intentions (FR/MG) et Générateur de réponses Commentaires & DM (`fb-responder.mjs`)

**Fichiers :**
- Créer : `c:\Users\sylvi\DEV\GRAFIKALY\config\fb-rules.json`
- Créer : `c:\Users\sylvi\DEV\GRAFIKALY\src\lib\fb-responder.mjs`
- Tester : `c:\Users\sylvi\DEV\GRAFIKALY\tests\fb-responder.test.mjs`

**Étape 1 : Écrire le test qui échoue**
```javascript
import test from 'node:test';
import assert from 'node:assert/strict';
import { classifyCommentIntent, buildCommentActions } from '../src/lib/fb-responder.mjs';

test('classifyCommentIntent détecte les demandes de prix en français et malgache', () => {
  assert.equal(classifyCommentIntent('Prix svp ?'), 'PRICE_OR_INFO');
  assert.equal(classifyCommentIntent('Mp azafady, ohatrinona ?'), 'PRICE_OR_INFO');
  assert.equal(classifyCommentIntent('Mbola misy ve ? Dispo ?'), 'PRICE_OR_INFO');
  assert.equal(classifyCommentIntent('Mon compte ne marche plus depuis hier'), 'SUPPORT_ALERT');
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

  const plan = buildCommentActions({ comment, product, dryRun: true });
  assert.equal(plan.actionType, 'PUBLIC_AND_PRIVATE_REPLY');
  assert.equal(plan.dryRun, true);
  assert.match(plan.publicReply, /Rova/);
  assert.match(plan.privateReply, /14 500 Ar/);
  assert.match(plan.privateReply, /https:\/\/www\.grafikaly\.mg\/produits\/canva-pro-education\?utm_source=facebook&utm_medium=comment_dm/);
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
  assert.match(plan.publicReply, /https:\/\/www\.grafikaly\.mg\/produits\/prime-video/);
});
```

**Étape 2 : Exécuter le test pour vérifier l'échec**
Exécuter : `node --test tests/fb-responder.test.mjs`
Résultat attendu : ÉCHEC (`Cannot find module '../src/lib/fb-responder.mjs'`)

**Étape 3 : Écrire l'implémentation minimale**
```javascript
// src/lib/fb-responder.mjs
const SUPPORT_KEYWORDS = [
  'marche pas', 'marche plus', 'problème', 'probleme', 'erreur',
  'coupé', 'coupe', 'mot de passe incorrect', 'remboursement', 'arnaque', 'tsy mandeha'
];

const PRICE_KEYWORDS = [
  'prix', 'mp', 'pv', 'inbox', 'combien', 'ohatrinona', 'info', 'infos',
  'dispo', 'disponible', 'mbola misy', 'intéressé', 'interesse', 'mvola',
  'orange money', 'comment acheter', 'ahoana', 'tarif', 'lien'
];

export function formatMga(amount) {
  return Number(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

export function classifyCommentIntent(message = '') {
  const norm = message.toLowerCase().trim();
  if (!norm) return 'IGNORE';
  if (SUPPORT_KEYWORDS.some((kw) => norm.includes(kw))) {
    return 'SUPPORT_ALERT';
  }
  if (PRICE_KEYWORDS.some((kw) => norm.includes(kw)) || norm.length <= 15) {
    return 'PRICE_OR_INFO';
  }
  return 'GENERAL_QUESTION';
}

export function buildCommentActions({ comment, product, dryRun = true }) {
  const firstName = (comment.from?.name || 'Client').split(' ')[0];
  const createdMs = new Date(comment.created_time).getTime();
  const ageDays = (Date.now() - createdMs) / (1000 * 60 * 60 * 24);
  const url = `https://www.grafikaly.mg/produits/${product.slug}?utm_source=facebook&utm_medium=comment_dm`;
  const priceStr = `${formatMga(product.price_mga)} Ar`;

  if (product.availability === 'unavailable') {
    return {
      commentId: comment.id,
      dryRun: Boolean(dryRun),
      actionType: 'OUT_OF_STOCK_WAITLIST',
      publicReply: `Bonjour ${firstName} 👋 Toutes les places pour ${product.name} viennent d'être prises, mais vous pouvez rejoindre la liste d'attente prioritaire sur notre site ! Je vous ai envoyé le lien en MP 📩`,
      privateReply: `Bonjour ${firstName} ! Actuellement ${product.name} est victime de son succès (stock complet). 👉 Inscrivez-vous gratuitement sur la liste d'attente ici pour être alerté dès l'ouverture d'une place : ${url}`,
    };
  }

  if (ageDays > 7) {
    return {
      commentId: comment.id,
      dryRun: Boolean(dryRun),
      actionType: 'PUBLIC_ONLY_OLDER_THAN_7D',
      publicReply: `Bonjour ${firstName} 👋 C'est disponible dès ${priceStr} payable par Mvola/Orange Money ! Commandez directement ici : ${url}`,
      privateReply: null,
    };
  }

  const anchorText = product.compare_at_price_mga && product.compare_at_price_mga > product.price_mga
    ? ` (au lieu de ~${formatMga(product.compare_at_price_mga)} Ar en tarif officiel)`
    : '';

  return {
    commentId: comment.id,
    dryRun: Boolean(dryRun),
    actionType: 'PUBLIC_AND_PRIVATE_REPLY',
    publicReply: `Bonjour ${firstName} 👋 C'est disponible immédiatement ! Je viens de vous envoyer le tarif en Ariary et le lien d'accès direct dans vos messages privés (Messenger) 📩`,
    privateReply:
      `Bonjour ${firstName} ! Voici les détails pour **${product.name}** sur Grafikaly :\n` +
      `✅ Tarif : Dès ${priceStr}${anchorText}\n` +
      `💳 Paiement 100 % local : Mvola ou Orange Money (sans carte bancaire)\n` +
      `⚡ Livraison rapide : Accès activé en moins de 2h après validation\n` +
      `👉 Commandez directement en 2 minutes ici : ${url}`,
  };
}
```

**Étape 4 : Exécuter le test pour vérifier le succès**
Exécuter : `node --test tests/fb-responder.test.mjs`
Résultat attendu : SUCCÈS (3 tests passés)

**Étape 5 : Commiter les changements**
```bash
git add config/fb-rules.json src/lib/fb-responder.mjs tests/fb-responder.test.mjs
git commit -m "feat(fb): ajouter classifieur d'intention FR/MG et générateur de réponses commentaires + DM"
```

---

### Tâche 3 : Registre d'Idempotence Anti-Doublon (`fb-state.mjs`)

**Fichiers :**
- Créer : `c:\Users\sylvi\DEV\GRAFIKALY\src\lib\fb-state.mjs`
- Tester : `c:\Users\sylvi\DEV\GRAFIKALY\tests\fb-state.test.mjs`

**Étape 1 : Écrire le test qui échoue**
```javascript
import test from 'node:test';
import assert from 'node:assert/strict';
import os from 'node:os';
import path from 'node:path';
import fs from 'node:fs/promises';
import { hasProcessedId, markAsProcessed } from '../src/lib/fb-state.mjs';

test('markAsProcessed et hasProcessedId empêchent de répondre deux fois au même commentaire', async () => {
  const tmpFile = path.join(await fs.mkdtemp(path.join(os.tmpdir(), 'fb-state-')), 'state.json');

  assert.equal(await hasProcessedId('cmt_123', tmpFile), false);
  await markAsProcessed('cmt_123', { actionType: 'PUBLIC_AND_PRIVATE_REPLY' }, tmpFile);
  assert.equal(await hasProcessedId('cmt_123', tmpFile), true);
});
```

**Étape 2 : Exécuter le test pour vérifier l'échec**
Exécuter : `node --test tests/fb-state.test.mjs`
Résultat attendu : ÉCHEC (`Cannot find module '../src/lib/fb-state.mjs'`)

**Étape 3 : Écrire l'implémentation minimale**
```javascript
// src/lib/fb-state.mjs
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
```

**Étape 4 : Exécuter le test pour vérifier le succès**
Exécuter : `node --test tests/fb-state.test.mjs`
Résultat attendu : SUCCÈS

**Étape 5 : Commiter les changements**
```bash
git add src/lib/fb-state.mjs tests/fb-state.test.mjs
git commit -m "feat(fb): ajouter registre anti-doublon pour les commentaires et messages traités"
```

---

### Tâche 4 : Générateur de Contenus Psychologiques & Kits Facebook Ads (`fb-content-generator.mjs`)

**Fichiers :**
- Créer : `c:\Users\sylvi\DEV\GRAFIKALY\src\lib\fb-content-generator.mjs`
- Tester : `c:\Users\sylvi\DEV\GRAFIKALY\tests\fb-content-generator.test.mjs`

**Étape 1 : Écrire le test qui échoue**
```javascript
import test from 'node:test';
import assert from 'node:assert/strict';
import { generatePsychologicalPost, filterAvailableProducts } from '../src/lib/fb-content-generator.mjs';

test('filterAvailableProducts exclut strictement les produits en rupture', () => {
  const products = [
    { slug: 'canva-pro', availability: 'available' },
    { slug: 'hostinger', availability: 'unavailable' },
  ];
  const valid = filterAvailableProducts(products);
  assert.equal(valid.length, 1);
  assert.equal(valid[0].slug, 'canva-pro');
});

test('generatePsychologicalPost calcule le coût par jour en Ariary et l économie en %', () => {
  const product = {
    name: 'Canva Pro Éducation (12 mois)',
    slug: 'canva-pro-education',
    price_mga: 98000,
    compare_at_price_mga: 531000,
    duration_days: 365,
    availability: 'available',
  };

  const post = generatePsychologicalPost(product, 'DAILY_COST');
  assert.equal(post.dailyCostMga, 268);
  assert.equal(post.savingsPct, 82);
  assert.match(post.caption, /268 Ar \/ jour/);
  assert.match(post.caption, /531 000 Ar/);
  assert.equal(post.published, false); // toujours programmé/brouillon par défaut
});
```

**Étape 2 : Exécuter le test pour vérifier l'échec**
Exécuter : `node --test tests/fb-content-generator.test.mjs`
Résultat attendu : ÉCHEC (`Cannot find module '../src/lib/fb-content-generator.mjs'`)

**Étape 3 : Écrire l'implémentation minimale**
```javascript
// src/lib/fb-content-generator.mjs
import { formatMga } from './fb-responder.mjs';

export function filterAvailableProducts(products = []) {
  return products.filter((p) => p.availability !== 'unavailable');
}

export function generatePsychologicalPost(product, angle = 'DAILY_COST') {
  if (product.availability === 'unavailable') {
    throw new Error(`Impossible de générer un post promotionnel pour un produit en rupture : ${product.name}`);
  }

  const days = product.duration_days || 30;
  const dailyCostMga = Math.round(product.price_mga / days);
  const savingsMga = product.compare_at_price_mga ? product.compare_at_price_mga - product.price_mga : 0;
  const savingsPct = product.compare_at_price_mga
    ? Math.round((savingsMga / product.compare_at_price_mga) * 100)
    : 0;
  const url = `https://www.grafikaly.mg/produits/${product.slug}?utm_source=facebook&utm_medium=organic_post&utm_campaign=${angle.toLowerCase()}`;

  let caption = '';
  if (angle === 'DAILY_COST') {
    caption =
      `🔥 Seulement ${formatMga(dailyCostMga)} Ar / jour pour avoir ${product.name} !\n\n` +
      `Pourquoi payer le tarif international de ${formatMga(product.compare_at_price_mga)} Ar en devise avec une carte Visa quand Grafikaly vous l'active à seulement ${formatMga(product.price_mga)} Ar (-${savingsPct} %) ?\n\n` +
      `✅ Paiement direct par Mvola ou Orange Money\n` +
      `⚡ Activation rapide en moins de 2h\n` +
      `👉 Commandez maintenant sur : ${url}\n\n` +
      `💬 Commentez "PRIX" ou "MP" ci-dessous pour recevoir le lien direct dans Messenger !`;
  } else {
    caption =
      `💡 Économisez ${formatMga(savingsMga)} Ar (-${savingsPct} %) sur ${product.name} !\n` +
      `👉 Accès immédiat via Mvola / Orange Money sur : ${url}`;
  }

  return {
    productSlug: product.slug,
    angle,
    dailyCostMga,
    savingsMga,
    savingsPct,
    caption,
    published: false,
  };
}
```

**Étape 4 : Exécuter le test pour vérifier le succès**
Exécuter : `node --test tests/fb-content-generator.test.mjs`
Résultat attendu : SUCCÈS

**Étape 5 : Commiter les changements**
```bash
git add src/lib/fb-content-generator.mjs tests/fb-content-generator.test.mjs
git commit -m "feat(fb): ajouter générateur de posts psychologiques Ariary/jour et filtre stock"
```

---

### Tâche 5 : CLI Unifiée `src/facebook.mjs` & Kit d'Automatisations Meta Business Suite

**Fichiers :**
- Créer : `c:\Users\sylvi\DEV\GRAFIKALY\src\facebook.mjs`
- Créer : `c:\Users\sylvi\DEV\GRAFIKALY\docs\contexte\04-kit-facebook-ads-et-calendrier-madagascar.md`

**Étape 1 : Implémenter la CLI `src/facebook.mjs` avec garde-fou `--dry-run` par défaut**
Commandes disponibles :
- `node src/facebook.mjs verify` : Vérifie la connexion à la Page Facebook via Meta Graph API (`GET /v21.0/{FB_PAGE_ID}?fields=name,fan_count,followers_count`).
- `node src/facebook.mjs comments [--post-id <id>] [--confirm]` : Scanne les commentaires récents, affiche le tableau de simulation (`--dry-run`) et, si `--confirm` est présent, envoie la réponse publique + le DM privé avec un délai de sécurité de `3500ms` entre chaque client.
- `node src/facebook.mjs generate-calendar` : Génère la semaine de publications Facebook (Textes + Prompts/Visuels Canva) dans `backups/fb-calendar-draft.json`.
- `node src/facebook.mjs schedule-posts <fichier.json> --confirm` : Programme les posts validés sur la Page Facebook.

**Étape 2 : Rédiger le Kit opérationnel immédiat (`04-kit-facebook-ads-et-calendrier-madagascar.md`)**
Contient :
- Les **4 Icebreakers prêts à copier-coller** dans Meta Business Suite > Automatisations (pour le 24h/24 sans serveur).
- Les **12 premiers Posts Facebook & Publicités Ads prêts à l'emploi** (Streaming, Canva Pro à `270 Ar/j`, Packs IA, et Service Création de site E-commerce en 24h à `349 000 Ar`).
