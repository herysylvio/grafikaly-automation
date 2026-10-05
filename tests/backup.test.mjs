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
