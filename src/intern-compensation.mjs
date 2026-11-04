/**
 * Moteur de calcul de la rémunération hybride du stagiaire
 * Combine l'indemnité mensuelle légale de stage et les primes de performance / commissions.
 */

/**
 * Calcule le montant total à verser au stagiaire selon ses résultats mensuels.
 * @param {object} params
 * @param {number} params.baseStipendMga - Indemnité forfaitaire de base en Ariary
 * @param {number} [params.salesVolumeMga] - Volume de ventes généré sur Grafikaly
 * @param {number} [params.salesCommissionRate] - Taux de commission sur ventes (ex: 0.08 pour 8%)
 * @param {number} [params.retainedSubscribersCount] - Nombre d'abonnés fidélisés/renouvelés
 * @param {number} [params.retentionBonusPerSubMga] - Prime par abonné sauvé
 * @param {number} [params.signedContractsValueMga] - Montant des contrats de prestations signés (Digital 514 / AIZÉ)
 * @param {number} [params.contractCommissionRate] - Taux de commission sur contrat (ex: 0.07 pour 7%)
 * @returns {object} Décomposition détaillée du versement
 */
export function calculateHybridInternCompensation({
  baseStipendMga,
  salesVolumeMga = 0,
  salesCommissionRate = 0,
  retainedSubscribersCount = 0,
  retentionBonusPerSubMga = 0,
  signedContractsValueMga = 0,
  contractCommissionRate = 0,
}) {
  const salesCommissionMga = Math.round(salesVolumeMga * salesCommissionRate);
  const retentionBonusTotalMga = Math.round(retainedSubscribersCount * retentionBonusPerSubMga);
  const contractCommissionMga = Math.round(signedContractsValueMga * contractCommissionRate);

  const totalCommissionsMga = salesCommissionMga + retentionBonusTotalMga + contractCommissionMga;
  const totalPayoutMga = baseStipendMga + totalCommissionsMga;

  return {
    baseStipendMga,
    salesVolumeMga,
    salesCommissionMga,
    retainedSubscribersCount,
    retentionBonusTotalMga,
    signedContractsValueMga,
    contractCommissionMga,
    totalCommissionsMga,
    totalPayoutMga,
    isSocialChargesExempt: true,
  };
}
