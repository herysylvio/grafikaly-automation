# Plan d'implémentation du Copilote Admin Grafikaly

**Objectif :** Construire une boîte à outils CLI locale et sécurisée permettant au copilote d'auditer, prévisualiser (Avant/Après ou Brouillon) et mettre à jour le catalogue, les prix et les campagnes marketing de `grafikaly.mg` après validation de l'utilisateur.

**Architecture :** Une suite de modules Node.js (ESM natif sans dépendances lourdes) qui s'authentifie sur `grafikaly.mg` via des variables d'environnement isolées (`.env`), interroge les Server Functions TanStack Start, génère des sauvegardes JSON automatiques avant toute écriture (`backups/`), et impose des garde-fous logiciels (`draft` obligatoire sur les emails, validation de cohérence des prix barrés).

**Stack Technique :** Node.js 20+ (`fetch` natif, `node:test`, `node:assert`, `node:fs/promises`), variables d'environnement (`.env`).

---

### Tâche 1 : Initialisation du dépôt, protection `.gitignore` et validateur de configuration (`.env`)

**Fichiers :**
- Créer : `c:\Users\sylvi\DEV\GRAFIKALY\.gitignore`
- Créer : `c:\Users\sylvi\DEV\GRAFIKALY\package.json`
- Créer : `c:\Users\sylvi\DEV\GRAFIKALY\src\lib\config.mjs`
- Tester : `c:\Users\sylvi\DEV\GRAFIKALY\tests\config.test.mjs`

**Étape 1 : Écrire le test qui échoue**
```javascript
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
```

**Étape 2 : Exécuter le test pour vérifier l'échec**
Exécuter : `node --test tests/config.test.mjs`
Résultat attendu : ÉCHEC (`ERR_MODULE_NOT_FOUND: Cannot find package '../src/lib/config.mjs'`)

**Étape 3 : Écrire l'implémentation minimale**
```javascript
// src/lib/config.mjs
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
```

**Étape 4 : Exécuter le test pour vérifier le succès**
Exécuter : `node --test tests/config.test.mjs`
Résultat attendu : SUCCÈS (2 tests passés)

**Étape 5 : Commiter les changements**
```bash
git add .gitignore package.json src/lib/config.mjs tests/config.test.mjs
git commit -m "feat(config): ajouter validation .env et protection gitignore"
```

---

### Tâche 2 : Système de sauvegarde locale (`backup`) et restauration (`rollback`)

**Fichiers :**
- Créer : `c:\Users\sylvi\DEV\GRAFIKALY\src\lib\backup.mjs`
- Tester : `c:\Users\sylvi\DEV\GRAFIKALY\tests\backup.test.mjs`

**Étape 1 : Écrire le test qui échoue**
```javascript
import test from 'node:test';
import assert from 'node:assert/strict';
import os from 'node:os';
import path from 'node:path';
import fs from 'node:fs/promises';
import { saveSnapshot, loadSnapshot } from '../src/lib/backup.mjs';

test('saveSnapshot et loadSnapshot sauvegardent et relisent un état JSON horodaté', async () => {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'grafikaly-bkp-'));
  const sampleData = [{ id: 'prod-1', name: 'Canva Pro', price_mga: 20000 }];

  const filePath = await saveSnapshot('products', sampleData, tmpDir);
  const loaded = await loadSnapshot(filePath);

  assert.equal(loaded.entity, 'products');
  assert.deepEqual(loaded.data, sampleData);
});
```

**Étape 2 : Exécuter le test pour vérifier l'échec**
Exécuter : `node --test tests/backup.test.mjs`
Résultat attendu : ÉCHEC (`Cannot find module '../src/lib/backup.mjs'`)

**Étape 3 : Écrire l'implémentation minimale**
```javascript
// src/lib/backup.mjs
import fs from 'node:fs/promises';
import path from 'node:path';

export async function saveSnapshot(entity, data, backupDir = path.resolve('backups')) {
  await fs.mkdir(backupDir, { recursive: true });
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filePath = path.join(backupDir, `${timestamp}-${entity}.json`);
  const payload = {
    entity,
    createdAt: new Date().toISOString(),
    data,
  };
  await fs.writeFile(filePath, JSON.stringify(payload, null, 2), 'utf8');
  return filePath;
}

export async function loadSnapshot(filePath) {
  const raw = await fs.readFile(filePath, 'utf8');
  return JSON.parse(raw);
}
```

**Étape 4 : Exécuter le test pour vérifier le succès**
Exécuter : `node --test tests/backup.test.mjs`
Résultat attendu : SUCCÈS

**Étape 5 : Commiter les changements**
```bash
git add src/lib/backup.mjs tests/backup.test.mjs
git commit -m "feat(backup): ajouter sauvegarde JSON automatique et chargement rollback"
```

---

### Tâche 3 : Garde-fous du Catalogue (Validation des prix barrés & Diff Avant/Après)

**Fichiers :**
- Créer : `c:\Users\sylvi\DEV\GRAFIKALY\src\lib\catalog-validator.mjs`
- Tester : `c:\Users\sylvi\DEV\GRAFIKALY\tests\catalog-validator.test.mjs`

**Étape 1 : Écrire le test qui échoue**
```javascript
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
```

**Étape 2 : Exécuter le test pour vérifier l'échec**
Exécuter : `node --test tests/catalog-validator.test.mjs`
Résultat attendu : ÉCHEC (`Cannot find module '../src/lib/catalog-validator.mjs'`)

**Étape 3 : Écrire l'implémentation minimale**
```javascript
// src/lib/catalog-validator.mjs
export function validateProductUpdate(currentProduct, patch) {
  const merged = { ...currentProduct, ...patch };
  const price = Number(merged.price_mga);
  const compareAt = merged.compare_at_price_mga !== null && merged.compare_at_price_mga !== undefined
    ? Number(merged.compare_at_price_mga)
    : null;

  if (!Number.isFinite(price) || price <= 0) {
    throw new Error(`Prix invalide pour ${merged.name}: ${merged.price_mga}`);
  }
  if (compareAt !== null && compareAt <= price) {
    throw new Error(
      `compare_at_price_mga doit être strictement supérieur à price_mga (${compareAt} <= ${price})`
    );
  }
  return merged;
}

export function computeProductDiff(currentProduct, patch) {
  const validated = validateProductUpdate(currentProduct, patch);
  const changes = {};
  for (const key of Object.keys(patch)) {
    if (currentProduct[key] !== validated[key]) {
      changes[key] = { from: currentProduct[key], to: validated[key] };
    }
  }
  return { id: currentProduct.id, name: currentProduct.name, changes, merged: validated };
}
```

**Étape 4 : Exécuter le test pour vérifier le succès**
Exécuter : `node --test tests/catalog-validator.test.mjs`
Résultat attendu : SUCCÈS

**Étape 5 : Commiter les changements**
```bash
git add src/lib/catalog-validator.mjs tests/catalog-validator.test.mjs
git commit -m "feat(catalog): ajouter validation prix d'ancrage et générateur de diff"
```

---

### Tâche 4 : Garde-fous Marketing (Forçage du mode Brouillon `draft` & Simulation `dryRun`)

**Fichiers :**
- Créer : `c:\Users\sylvi\DEV\GRAFIKALY\src\lib\marketing-validator.mjs`
- Tester : `c:\Users\sylvi\DEV\GRAFIKALY\tests\marketing-validator.test.mjs`

**Étape 1 : Écrire le test qui échoue**
```javascript
import test from 'node:test';
import assert from 'node:assert/strict';
import { prepareSafeCampaignPayload, prepareAutomationRunPayload } from '../src/lib/marketing-validator.mjs';

test('prepareSafeCampaignPayload force toujours le statut en draft', () => {
  const payload = prepareSafeCampaignPayload({
    name: 'Relance Panier',
    subject: 'Votre outil vous attend',
    htmlContent: '<p>Bonjour {{customer_name}}</p>',
    segmentType: 'all_active',
    status: 'sent', // tentative accidentelle
  });
  assert.equal(payload.status, 'draft');
});

test('prepareAutomationRunPayload force dryRun: true par défaut', () => {
  const run = prepareAutomationRunPayload({ ruleId: 'rule-1' });
  assert.equal(run.dryRun, true);
});
```

**Étape 2 : Exécuter le test pour vérifier l'échec**
Exécuter : `node --test tests/marketing-validator.test.mjs`
Résultat attendu : ÉCHEC (`Cannot find module '../src/lib/marketing-validator.mjs'`)

**Étape 3 : Écrire l'implémentation minimale**
```javascript
// src/lib/marketing-validator.mjs
export function prepareSafeCampaignPayload(input) {
  if (!input.name?.trim() || !input.subject?.trim() || !input.htmlContent?.trim()) {
    throw new Error('Une campagne nécessite name, subject et htmlContent');
  }
  return {
    ...input,
    status: 'draft',
  };
}

export function prepareAutomationRunPayload({ ruleId, allowLive = false }) {
  if (!ruleId) throw new Error('ruleId requis');
  return {
    ruleId,
    dryRun: !allowLive,
  };
}
```

**Étape 4 : Exécuter le test pour vérifier le succès**
Exécuter : `node --test tests/marketing-validator.test.mjs`
Résultat attendu : SUCCÈS

**Étape 5 : Commiter les changements**
```bash
git add src/lib/marketing-validator.mjs tests/marketing-validator.test.mjs
git commit -m "feat(marketing): verrouiller le mode draft et dryRun par défaut"
```

---

### Tâche 5 : Client d'Authentification & CLI d'Audit Initial (`snapshot`)

**Fichiers :**
- Créer : `c:\Users\sylvi\DEV\GRAFIKALY\src\lib\client.mjs`
- Créer : `c:\Users\sylvi\DEV\GRAFIKALY\src\cli.mjs`

**Étape 1 : Écrire le client d'authentification et d'appel aux Server Functions**
Le client lit `.env`, s'authentifie sur `https://www.grafikaly.mg`, conserve le cookie/token de session en mémoire, et expose :
- `node src/cli.mjs verify-auth` (vérifie la connexion et le rôle de l'utilisateur sans modifier aucune donnée)
- `node src/cli.mjs backup-all` (télécharge le snapshot initial du catalogue et des campagnes dans `backups/`)
- `node src/cli.mjs catalog-diff <fichier.json>` (affiche le comparatif Avant/Après dans le chat)
- `node src/cli.mjs catalog-apply <fichier.json> --confirm` (applique après validation)
- `node src/cli.mjs marketing-draft <fichier.json>` (crée un brouillon de campagne email dans `/admin/marketing`)
