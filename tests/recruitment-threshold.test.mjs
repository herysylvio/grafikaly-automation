import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { evaluateRecruitmentThreshold } from '../src/recruitment-threshold.mjs';

describe('Évaluation du seuil de recrutement d\'un stagiaire vs ROI', () => {
  it('ne recommande pas de recrutement si le volume physique est faible (maintien 100% IA)', () => {
    const analysis = evaluateRecruitmentThreshold({
      monthlyPhysicalHours: 3, // 3h de démarches terrain dans le mois
      ceoHourlyRateMga: 50000,
      monthlyStipendMga: 250000,
    });

    assert.equal(analysis.recommendInternHire, false);
    assert.equal(analysis.ceovalueSpentMga, 150000); // 3 * 50 000
    assert.equal(analysis.netMonthlySavingMga, -100000); // 150 000 - 250 000
    assert.match(analysis.decisionReason, /maintien 100% IA/i);
  });

  it('déclenche l\'alerte de recrutement dès que le temps CEO libéré rentabilise le stage', () => {
    const analysis = evaluateRecruitmentThreshold({
      monthlyPhysicalHours: 12, // 12h de courses administratives (banque, centre fiscal, livraisons)
      ceoHourlyRateMga: 50000,
      monthlyStipendMga: 250000,
    });

    assert.equal(analysis.recommendInternHire, true);
    assert.equal(analysis.ceovalueSpentMga, 600000); // 12 * 50 000
    assert.equal(analysis.netMonthlySavingMga, 350000); // 600 000 - 250 000
    assert.ok(analysis.roiMultiplier > 2); // Gain > 2x coût du stage
    assert.match(analysis.decisionReason, /recrutement recommandé/i);
  });
});
