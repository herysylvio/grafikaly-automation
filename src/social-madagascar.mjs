/**
 * Moteur de calcul des cotisations sociales et de la paie à Madagascar
 * Conforme au Code du Travail malgache (Loi n° 2003-044) et décrets CNaPS / Santé.
 */

export const DEFAULT_SMIG = 262680; // SMIG M1 de référence à Madagascar
export const CNAPS_CEILING_MULTIPLIER = 8; // Plafond CNaPS = 8 x SMIG
export const CNAPS_EMPLOYEE_RATE = 0.01; // 1%
export const CNAPS_EMPLOYER_RATE = 0.13; // 13%
export const HEALTH_EMPLOYEE_RATE = 0.01; // 1% (OSTIE / AMIT)
export const HEALTH_EMPLOYER_RATE = 0.05; // 5% (OSTIE / AMIT)

/**
 * Calcule les cotisations sociales et la paie brute/nette d'un salarié à Madagascar.
 * @param {number} grossSalary - Salaire brut en Ariary (MGA)
 * @param {object} options - Options de calcul (smig, taux personnalisés)
 * @returns {object} Décomposition détaillée de la paie
 */
export function calculatePayrollMadagascar(grossSalary, options = {}) {
  const smig = options.smig || DEFAULT_SMIG;
  const cnapsCeiling = smig * CNAPS_CEILING_MULTIPLIER;

  // L'assiette CNaPS est plafonnée à 8 x SMIG
  const cnapsBase = Math.min(grossSalary, cnapsCeiling);
  const cnapsEmployee = Math.round(cnapsBase * CNAPS_EMPLOYEE_RATE);
  const cnapsEmployer = Math.round(cnapsBase * CNAPS_EMPLOYER_RATE);

  // L'assiette santé (OSTIE/AMIT) est assise sur le brut intégral
  const healthBase = grossSalary;
  const healthEmployee = Math.round(healthBase * HEALTH_EMPLOYEE_RATE);
  const healthEmployer = Math.round(healthBase * HEALTH_EMPLOYER_RATE);

  const netBeforeTax = grossSalary - cnapsEmployee - healthEmployee;
  const totalEmployerCharges = cnapsEmployer + healthEmployer;
  const totalCostToEmployer = grossSalary + totalEmployerCharges;

  return {
    grossSalary,
    smig,
    cnapsCeiling,
    cnapsBase,
    cnapsEmployee,
    cnapsEmployer,
    healthBase,
    healthEmployee,
    healthEmployer,
    netBeforeTax,
    totalEmployerCharges,
    totalCostToEmployer,
  };
}

/**
 * Calcule le coût forfaitaire d'un stage sous convention universitaire.
 * @param {number} stipend - Montant de l'indemnité mensuelle de stage en Ariary
 * @returns {object} Synthèse financière du stage
 */
export function calculateInternshipCost(stipend) {
  return {
    stipend,
    cnapsTotal: 0,
    healthTotal: 0,
    totalCostToEmployer: stipend,
    isExemptFromSocialCharges: true,
  };
}
