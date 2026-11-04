import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { calculatePayrollMadagascar, calculateInternshipCost } from '../src/social-madagascar.mjs';

describe('Calcul des charges sociales et paie à Madagascar', () => {
  const SMIG_M1 = 262680; // SMIG de référence secteur M1 Madagascar

  it('calcule correctement les cotisations pour un salaire brut standard sous le plafond CNaPS', () => {
    const grossSalary = 500000;
    const result = calculatePayrollMadagascar(grossSalary, { smig: SMIG_M1 });

    assert.equal(result.grossSalary, 500000);
    assert.equal(result.cnapsBase, 500000);
    assert.equal(result.cnapsEmployee, 5000); // 1%
    assert.equal(result.cnapsEmployer, 65000); // 13%
    assert.equal(result.healthBase, 500000);
    assert.equal(result.healthEmployee, 5000); // 1%
    assert.equal(result.healthEmployer, 25000); // 5%
    assert.equal(result.netBeforeTax, 490000); // 500 000 - 5 000 - 5 000
    assert.equal(result.totalEmployerCharges, 90000); // 65 000 + 25 000
    assert.equal(result.totalCostToEmployer, 590000); // 500 000 + 90 000 (118% du brut)
  });

  it('applique rigoureusement le plafonnement CNaPS à 8x le SMIG pour les salaires élevés', () => {
    const grossSalary = 3000000;
    const result = calculatePayrollMadagascar(grossSalary, { smig: SMIG_M1 });

    const expectedCnapsCeiling = 8 * SMIG_M1; // 2 101 440
    assert.equal(result.cnapsBase, expectedCnapsCeiling);
    assert.equal(result.cnapsEmployee, Math.round(expectedCnapsCeiling * 0.01));
    assert.equal(result.cnapsEmployer, Math.round(expectedCnapsCeiling * 0.13));

    // L'organisme sanitaire reste assis sur l'intégralité du brut
    assert.equal(result.healthBase, 3000000);
    assert.equal(result.healthEmployee, 30000); // 1%
    assert.equal(result.healthEmployer, 150000); // 5%
  });

  it('calcule correctement le coût forfaitaire d\'un stagiaire sous convention (exonération sociale)', () => {
    const stipend = 250000;
    const internCost = calculateInternshipCost(stipend);

    assert.equal(internCost.stipend, 250000);
    assert.equal(internCost.cnapsTotal, 0);
    assert.equal(internCost.healthTotal, 0);
    assert.equal(internCost.totalCostToEmployer, 250000);
    assert.equal(internCost.isExemptFromSocialCharges, true);
  });
});
