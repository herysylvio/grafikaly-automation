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
