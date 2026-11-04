import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { calculateHybridInternCompensation } from '../src/intern-compensation.mjs';

describe('Calcul de la rémunération hybride du stagiaire (Fixe + Commissions)', () => {
  it('calcule correctement l\'indemnité mensuelle de base sans commissions', () => {
    const compensation = calculateHybridInternCompensation({
      baseStipendMga: 200000,
    });

    assert.equal(compensation.baseStipendMga, 200000);
    assert.equal(compensation.totalCommissionsMga, 0);
    assert.equal(compensation.totalPayoutMga, 200000);
    assert.equal(compensation.isSocialChargesExempt, true);
  });

  it('calcule fidèlement les primes sur ventes Grafikaly, fidélisation et contrats Digital 514', () => {
    const compensation = calculateHybridInternCompensation({
      baseStipendMga: 200000,
      salesVolumeMga: 500000,
      salesCommissionRate: 0.08, // 8%
      retainedSubscribersCount: 3,
      retentionBonusPerSubMga: 3000,
      signedContractsValueMga: 1500000,
      contractCommissionRate: 0.07, // 7%
    });

    assert.equal(compensation.baseStipendMga, 200000);
    assert.equal(compensation.salesCommissionMga, 40000); // 500 000 * 8%
    assert.equal(compensation.retentionBonusTotalMga, 9000); // 3 * 3 000
    assert.equal(compensation.contractCommissionMga, 105000); // 1 500 000 * 7%
    assert.equal(compensation.totalCommissionsMga, 154000);
    assert.equal(compensation.totalPayoutMga, 354000); // 200 000 + 154 000
  });
});
