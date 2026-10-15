import fs from 'node:fs/promises';
import {
  GrafikalyAdminClient,
  SERVER_FNS,
  mapDbProductToMutationPayload,
} from '../src/lib/client.mjs';
import { saveSnapshot } from '../src/lib/backup.mjs';

const EMAIL_TEMPLATES_SERVER_FNS = {
  listTemplates: {
    id: '8463a3fd9e2d46275b804b1f6f95c3d1832a5f09c461adfa58786775eb7d3c4f',
    method: 'GET',
  },
  updateTemplate: {
    id: '3dadb915330b3182edced1ae2eeaa0d0c051cb5e3d34ca37578086cf9ba9c6f0',
    method: 'POST',
  },
};

export const TEMPLATE_UPDATES = {
  abandoned_cart_step_1: {
    subject: '{{customer_name}}, un souci pour activer votre accès sur Grafikaly ?',
    bodyMode: 'auto',
    body: `Bonjour {{customer_name}},

Nous avons remarqué que vous avez sélectionné vos accès sur Grafikaly, mais que votre commande n'est pas encore finalisée :

{{cart_items_html}}

Total réservé : {{cart_total}}

Chez Grafikaly, tout est pensé pour être simple et 100 % adapté à Madagascar :
- Pas besoin de carte Visa/Mastercard internationale ni de payer en Dollars/Euros.
- Paiement direct en Ariary par Mvola ou Orange Money.
- Livraison et activation rapide par notre équipe locale après validation.

Votre panier et votre place en stock sont toujours réservés ici :
👉 {{cart_url}}

Vous avez une question avant de valider ou besoin d'aide pour le paiement Mobile Money ? Répondez directement à cet email ou écrivez-nous sur WhatsApp : {{whatsapp_url}}

À tout de suite,
L'équipe {{site_name}}`,
  },
  abandoned_cart_step_2: {
    subject: 'Votre place est encore réservée (économisez jusqu’à -80 % en Ariary)',
    bodyMode: 'auto',
    body: `Bonjour {{customer_name}},

Vos articles vous attendent toujours dans votre panier Grafikaly :

{{cart_items_html}}

Total : {{cart_total}}

Pourquoi payer le plein tarif en Dollars ou en Euros avec des frais bancaires quand vous pouvez profiter exactement du même service officiel, en Ariary, jusqu'à 5 à 8 fois moins cher ?

⚠️ Attention : nos places sur les comptes maîtres (Netflix, Canva Pro, Spotify, Prime Video et outils IA) sont limitées pour garantir une qualité irréprochable à chaque abonné.

Reprenez votre commande en 30 secondes avant que votre place ne soit attribuée à un autre membre :
👉 {{cart_url}}

Une question ? Notre support WhatsApp est disponible ici : {{whatsapp_url}}

L'équipe {{site_name}}`,
  },
  abandoned_cart_step_3: {
    subject: '🎁 Dernier rappel {{customer_name}} : -10 % immédiat sur votre panier (Code : {{promo_code}})',
    bodyMode: 'auto',
    body: `Bonjour {{customer_name}},

C'est notre dernier message concernant votre panier en attente :

{{cart_items_html}}

Total initial : {{cart_total}}

Pour vous permettre de tester la qualité du service Grafikaly dès aujourd'hui, nous vous offrons une remise exceptionnelle de -10 % supplémentaires sur votre commande !

🎁 Votre code promo personnel : {{promo_code}}
(À saisir directement dans votre panier avant de valider votre paiement Mvola ou Orange Money).

Cliquez ici pour appliquer votre code {{promo_code}} et recevoir vos accès :
👉 {{cart_url}}

Attention : ce code est valable une seule fois et votre réservation expire très bientôt.

À très vite sur {{site_name}},
L'équipe {{site_name}}
Support WhatsApp : {{whatsapp_url}}`,
  },
  pre_renewal_j30: {
    subject: 'Info abonnement : votre accès {{product_name}} arrive à échéance dans 30 jours',
    bodyMode: 'auto',
    body: `Bonjour {{customer_name}},

Nous espérons que vous profitez pleinement de votre abonnement {{product_name}} ({{variant_label}}).

Ceci est un message d'anticipation : votre période actuelle arrivera à échéance le {{subscription_end_date}} (dans {{days_remaining}} jours).

Pour rappel, le renouvellement s'effectue manuellement (par Mvola ou Orange Money) : pensez à prolonger votre accès avant la date d'échéance pour conserver votre place et éviter toute coupure.

Si vous souhaitez sécuriser votre prochaine période dès maintenant :
👉 Renouveler en 1 clic : {{renewal_url}}

Besoin de passer sur une durée plus longue (3 mois, 6 mois ou 12 mois) pour économiser encore plus en Ariary ? Écrivez-nous sur WhatsApp : {{whatsapp_url}}

Merci pour votre confiance,
L'équipe {{site_name}}`,
  },
  pre_renewal_j7: {
    subject: '⏳ Plus que 7 jours sur votre abonnement {{product_name}} ({{customer_name}})',
    bodyMode: 'auto',
    body: `Bonjour {{customer_name}},

Votre abonnement {{product_name}} ({{variant_label}} — commande #{{order_number}}) expire dans exactement 7 jours, le {{subscription_end_date}}.

Pourquoi renouveler avant la date d'échéance ?
1. Vous conservez votre place et votre profil actuel sans aucune interruption.
2. Vous évitez que votre slot ne soit réattribué à la liste d'attente le jour de l'expiration.
3. Le règlement prend moins de 2 minutes par Mvola ou Orange Money.

Sécurisez la continuité de votre accès dès aujourd'hui :
👉 {{renewal_url}}

Une question ? Notre équipe est là sur WhatsApp : {{whatsapp_url}}

À très vite,
L'équipe {{site_name}}`,
  },
  pre_renewal_j1: {
    subject: '⚠️ URGENT {{customer_name}} : votre accès {{product_name}} expire demain ({{subscription_end_date}})',
    bodyMode: 'auto',
    body: `Bonjour {{customer_name}},

Attention, votre abonnement {{product_name}} ({{variant_label}}) arrive à échéance DEMAIN ({{subscription_end_date}}).

Au vu de la forte demande sur nos comptes maîtres, toute place non renouvelée à l'échéance est libérée pour les clients en liste d'attente.

Pour ne pas perdre votre profil, vos préférences et votre accès dès demain :
👉 Renouvelez maintenant par Mvola ou Orange Money : {{renewal_url}}

Si vous avez déjà effectué votre renouvellement aujourd'hui, merci d'ignorer ce message. En cas de besoin, contactez-nous vite sur WhatsApp : {{whatsapp_url}}

L'équipe {{site_name}}`,
  },
};

async function main() {
  const confirmed = process.argv.includes('--confirm');
  const client = new GrafikalyAdminClient();
  await client.login();

  const emailsRes = await client.callServerFn(EMAIL_TEMPLATES_SERVER_FNS.listTemplates, {});
  const templates = emailsRes?.templates ?? [];

  console.log('📋 Comparatif Avant / Après des 6 modèles d’emails d’automatisation :\n');
  for (const [key, patch] of Object.entries(TEMPLATE_UPDATES)) {
    const current = templates.find((t) => t.key === key);
    if (!current) {
      console.warn(`⚠️ Modèle introuvable : ${key}`);
      continue;
    }
    console.log(`🔹 [${key}] (${current.id})`);
    console.log(`   Objet AVANT : ${current.subject}`);
    console.log(`   Objet APRÈS : ${patch.subject}\n`);
  }

  if (!confirmed) {
    console.log('ℹ️ Mode aperçu : ajoutez --confirm après le "GO" de l’utilisateur pour appliquer.');
    return;
  }

  await saveSnapshot('pre-automation-templates-update', templates);

  // 1. Mise à jour des 6 templates d'automatisation
  for (const [key, patch] of Object.entries(TEMPLATE_UPDATES)) {
    const current = templates.find((t) => t.key === key);
    if (!current) continue;
    await client.callServerFn(EMAIL_TEMPLATES_SERVER_FNS.updateTemplate, {
      id: current.id,
      subject: patch.subject,
      body: patch.body,
      isActive: true,
      bodyMode: patch.bodyMode,
      bodyHtml: current.body_html ?? '',
    });
    console.log(`✅ Modèle mis à jour : ${key}`);
  }

  // 2. Configuration et activation des 2 automatisations
  await client.callServerFn(SERVER_FNS.marketing.updateAutomationSettings, {
    key: 'abandoned_cart',
    enabled: true,
    settings: {
      steps: JSON.stringify([
        { delay_minutes: 60 },
        { delay_minutes: 1440 },
        { delay_minutes: 4320 },
      ]),
      promo_code: 'PANIER10',
    },
  });
  console.log('✅ Automatisation "abandoned_cart" activée (H+1, J+1, J+3 avec code PANIER10)');

  await client.callServerFn(SERVER_FNS.marketing.updateAutomationSettings, {
    key: 'pre_renewal',
    enabled: true,
    settings: {
      steps: JSON.stringify([
        { days_before: 30 },
        { days_before: 7 },
        { days_before: 1 },
      ]),
    },
  });
  console.log('✅ Automatisation "pre_renewal" activée (J-30, J-7, J-1)');

  // 3. Simulation à sec (dryRun: true) pour vérifier combien d'emails sont prêts
  const [simCart, simRenewal] = await Promise.all([
    client.callServerFn(SERVER_FNS.marketing.runAutomation, {
      automationKey: 'abandoned_cart',
      dryRun: true,
    }),
    client.callServerFn(SERVER_FNS.marketing.runAutomation, {
      automationKey: 'pre_renewal',
      dryRun: true,
    }),
  ]);
  console.log('🧪 Résultat simulation (dryRun: true) :', {
    abandoned_cart: simCart,
    pre_renewal: simRenewal,
  });
}

main().catch((err) => {
  console.error('❌ Erreur :', err.message);
  process.exit(1);
});
