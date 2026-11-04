/**
 * Moteur de Facturation & Double Journal Comptable (GRAFIKALY SARL)
 * Assure la séparation stricte entre Ventes Internes (E-commerce B2C)
 * et Factures Officielles Déclarables (DGI B2B).
 */

export const JOURNAL_TYPES = {
  INTERNAL_MGMT: 'INTERNAL_MGMT', // Vente interne / gestion réelle (non déclarable)
  OFFICIAL_DGI: 'OFFICIAL_DGI',   // Facture officielle déclarable DGI
};

export const BUSINESS_UNITS = {
  GRAFIKALY_ECOMMERCE: 'GRAFIKALY_ECOMMERCE',
  DIGITAL_514: 'DIGITAL_514',
};

export const COMPANY_IDENTITY = {
  name: 'GRAFIKALY SARL',
  legalForm: 'SARL',
  country: 'Madagascar',
};

/**
 * Génère une pièce de facturation ou de reçu selon le journal sélectionné.
 * @param {object} params
 * @param {string} params.journalType - JOURNAL_TYPES.INTERNAL_MGMT ou JOURNAL_TYPES.OFFICIAL_DGI
 * @param {string} params.businessUnit - BUSINESS_UNITS.GRAFIKALY_ECOMMERCE ou BUSINESS_UNITS.DIGITAL_514
 * @param {number} params.sequenceNumber - Numéro d'ordre séquentiel
 * @param {number} [params.year] - Année d'émission (défaut année courante)
 * @param {number} [params.month] - Mois d'émission (1-12)
 * @param {string} [params.customerName] - Nom du client
 * @param {string} [params.customerNif] - NIF du client
 * @param {string} [params.customerStat] - STAT du client
 * @param {Array<{label: string, amountMga: number, quantity: number}>} params.items - Lignes de commande
 * @param {string} [params.paymentMethod] - Mode de paiement (Mvola, Virement, Chèque, etc.)
 * @returns {object} Document structuré prêt pour archivage et affichage
 */
export function createBillingDocument({
  journalType,
  businessUnit,
  sequenceNumber,
  year = new Date().getFullYear(),
  month = new Date().getMonth() + 1,
  customerName,
  customerNif = null,
  customerStat = null,
  items = [],
  paymentMethod = 'Non spécifié',
}) {
  if (!journalType || !JOURNAL_TYPES[journalType]) {
    throw new Error(`Type de journal invalide : ${journalType}`);
  }
  if (!businessUnit || !BUSINESS_UNITS[businessUnit]) {
    throw new Error(`Business Unit invalide : ${businessUnit}`);
  }
  if (typeof sequenceNumber !== 'number' || sequenceNumber <= 0) {
    throw new Error('Le numéro de séquence doit être un entier positif.');
  }

  const paddedMonth = String(month).padStart(2, '0');
  const totalAmountMga = items.reduce((acc, item) => acc + (item.amountMga * (item.quantity || 1)), 0);

  if (journalType === JOURNAL_TYPES.OFFICIAL_DGI) {
    if (!customerName || customerName.trim() === '') {
      throw new Error('Nom du client obligatoire pour une facture officielle DGI.');
    }
    const reference = `FAC-${year}-${paddedMonth}-${String(sequenceNumber).padStart(4, '0')}`;
    return {
      reference,
      journalType,
      businessUnit,
      emitterCompany: COMPANY_IDENTITY.name,
      customerName: customerName.trim(),
      customerNif,
      customerStat,
      items,
      totalAmountMga,
      paymentMethod,
      isTaxDeductible: true,
      legalNotice: 'Facture officielle enregistrée au grand-livre fiscal — Émise par GRAFIKALY SARL conformément au Code Général des Impôts de Madagascar.',
      issuedAt: new Date().toISOString(),
    };
  }

  // Journal interne (Gestion B2C)
  const reference = `CMD-INT-${year}-${String(sequenceNumber).padStart(5, '0')}`;
  return {
    reference,
    journalType,
    businessUnit,
    emitterCompany: COMPANY_IDENTITY.name,
    customerName: customerName ? customerName.trim() : 'Client Particulier',
    items,
    totalAmountMga,
    paymentMethod,
    isTaxDeductible: false,
    legalNotice: 'Reçu de gestion interne pour activation de service numérique — Document non déductible fiscalement.',
    issuedAt: new Date().toISOString(),
  };
}
