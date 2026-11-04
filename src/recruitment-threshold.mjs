/**
 * Simulateur d'arbitrage de recrutement (Agent RAF)
 * Détermine le point de bascule où le recours à un humain (stagiaire administratif terrain)
 * devient financièrement rentable face au coût d'opportunité du temps du CEO.
 */

export const DEFAULT_CEO_HOURLY_RATE_MGA = 50000; // Taux horaire d'opportunité du CEO
export const DEFAULT_INTERN_MONTHLY_STIPEND_MGA = 250000; // Indemnité mensuelle de stage recommandée

/**
 * Évalue la rentabilité d'embauche d'un stagiaire administratif pour décharger le CEO.
 * @param {object} params
 * @param {number} params.monthlyPhysicalHours - Heures mensuelles consacrées à des courses/démarches physiques
 * @param {number} [params.ceoHourlyRateMga] - Valeur horaire estimée du temps du CEO
 * @param {number} [params.monthlyStipendMga] - Indemnité de stage mensuelle
 * @returns {object} Décision argumentée et métriques financières
 */
export function evaluateRecruitmentThreshold({
  monthlyPhysicalHours,
  ceoHourlyRateMga = DEFAULT_CEO_HOURLY_RATE_MGA,
  monthlyStipendMga = DEFAULT_INTERN_MONTHLY_STIPEND_MGA,
}) {
  const ceovalueSpentMga = monthlyPhysicalHours * ceoHourlyRateMga;
  const netMonthlySavingMga = ceovalueSpentMga - monthlyStipendMga;
  const roiMultiplier = monthlyStipendMga > 0 ? (ceovalueSpentMga / monthlyStipendMga) : 0;

  const recommendInternHire = netMonthlySavingMga > 0;

  const decisionReason = recommendInternHire
    ? `Recrutement recommandé : le temps CEO libéré (${monthlyPhysicalHours}h valorisées à ${ceovalueSpentMga.toLocaleString()} Ar) couvre largement l'indemnité de stage (${monthlyStipendMga.toLocaleString()} Ar), générant un gain net de ${netMonthlySavingMga.toLocaleString()} Ar/mois.`
    : `Maintien 100% IA : Le volume physique actuel (${monthlyPhysicalHours}h valorisées à ${ceovalueSpentMga.toLocaleString()} Ar) ne justifie pas encore le coût d'une indemnité mensuelle (${monthlyStipendMga.toLocaleString()} Ar).`;

  return {
    monthlyPhysicalHours,
    ceoHourlyRateMga,
    monthlyStipendMga,
    ceovalueSpentMga,
    netMonthlySavingMga,
    roiMultiplier: Number(roiMultiplier.toFixed(2)),
    recommendInternHire,
    decisionReason,
  };
}
