import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createBillingDocument, JOURNAL_TYPES, BUSINESS_UNITS } from '../src/billing-system.mjs';

describe('Système de double facturation (Ventes Internes vs Factures Officielles DGI)', () => {
  it('génère un reçu de commande interne pour un achat B2C e-commerce', () => {
    const doc = createBillingDocument({
      journalType: JOURNAL_TYPES.INTERNAL_MGMT,
      businessUnit: BUSINESS_UNITS.GRAFIKALY_ECOMMERCE,
      sequenceNumber: 42,
      year: 2026,
      customerName: 'Client Particulier Mvola',
      items: [{ label: 'Canva Pro 1 An', amountMga: 89000, quantity: 1 }],
      paymentMethod: 'Mvola',
    });

    assert.equal(doc.reference, 'CMD-INT-2026-00042');
    assert.equal(doc.journalType, JOURNAL_TYPES.INTERNAL_MGMT);
    assert.equal(doc.businessUnit, BUSINESS_UNITS.GRAFIKALY_ECOMMERCE);
    assert.equal(doc.totalAmountMga, 89000);
    assert.equal(doc.isTaxDeductible, false);
    assert.match(doc.legalNotice, /reçu de gestion interne/i);
  });

  it('génère une facture officielle DGI conforme avec mentions NIF/STAT pour une prestation B2B Digital 514', () => {
    const doc = createBillingDocument({
      journalType: JOURNAL_TYPES.OFFICIAL_DGI,
      businessUnit: BUSINESS_UNITS.DIGITAL_514,
      sequenceNumber: 7,
      year: 2026,
      month: 11,
      customerName: 'Entreprise Partenaire SARL',
      customerNif: '3001234567',
      customerStat: '62011 11 2026 0 10234',
      items: [
        { label: 'Création de site e-commerce et automatisation', amountMga: 1500000, quantity: 1 },
      ],
      paymentMethod: 'Virement Bancaire',
    });

    assert.equal(doc.reference, 'FAC-2026-11-0007');
    assert.equal(doc.journalType, JOURNAL_TYPES.OFFICIAL_DGI);
    assert.equal(doc.businessUnit, BUSINESS_UNITS.DIGITAL_514);
    assert.equal(doc.totalAmountMga, 1500000);
    assert.equal(doc.isTaxDeductible, true);
    assert.equal(doc.emitterCompany, 'GRAFIKALY SARL');
    assert.match(doc.legalNotice, /facture officielle enregistrée au grand-livre fiscal/i);
  });

  it('rejette la génération d\'une facture DGI officielle si le nom du client est manquant', () => {
    assert.throws(
      () => {
        createBillingDocument({
          journalType: JOURNAL_TYPES.OFFICIAL_DGI,
          businessUnit: BUSINESS_UNITS.DIGITAL_514,
          sequenceNumber: 8,
          items: [{ label: 'Prestation', amountMga: 100000, quantity: 1 }],
        });
      },
      {
        name: 'Error',
        message: /nom du client obligatoire pour une facture officielle DGI/i,
      }
    );
  });
});
