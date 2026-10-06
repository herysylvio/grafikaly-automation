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
