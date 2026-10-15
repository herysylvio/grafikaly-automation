import { GrafikalyAdminClient, SERVER_FNS } from '../src/lib/client.mjs';
import { prepareSafeCampaignPayload } from '../src/lib/marketing-validator.mjs';
import { saveSnapshot } from '../src/lib/backup.mjs';

const PROMO_CODES_TO_CREATE = [
  {
    productId: null,
    code: 'PANIER10',
    discountType: 'percentage',
    discountValue: 10,
    endsAt: null,
    maxRedemptions: null,
    oncePerCustomer: true,
    isActive: true,
    notes: 'Relance automatique panier abandonné (3e étape J+3)',
  },
  {
    productId: null,
    code: 'RETOUR10',
    discountType: 'percentage',
    discountValue: 10,
    endsAt: null,
    maxRedemptions: null,
    oncePerCustomer: true,
    isActive: true,
    notes: 'Campagne de réactivation des abonnements coupés et cross-sell',
  },
  {
    productId: null,
    code: 'BIENVENUE10',
    discountType: 'percentage',
    discountValue: 10,
    endsAt: null,
    maxRedemptions: null,
    oncePerCustomer: true,
    isActive: true,
    notes: 'Campagne accord marketing (consent_pending) & réveil clients historiques',
  },
  {
    productId: '766434fc-7ff3-45f8-9852-d92bbdf9544f', // NETFLIX | SMARTPHONE/PC Uniquement
    code: 'NETFLX15',
    discountType: 'percentage',
    discountValue: 15,
    endsAt: '2026-10-30T21:00:00.000Z',
    maxRedemptions: null,
    oncePerCustomer: true,
    isActive: true,
    notes: 'Correctif coquille email Info Mailbox Netflix du 17/09 (NETFLX15 vs NETFLIX15)',
  },
];

const CAMPAIGN_DRAFTS = [
  {
    name: '[Campagne #1] Réactivation Abonnements Coupés (-10% RETOUR10)',
    segmentKey: 'subscriptions_cut',
    segmentParams: { minDays: 1, maxDays: 365 },
    promoCode: 'RETOUR10',
    bodyMode: 'auto',
    subject: '{{customer_name}}, votre place sur Grafikaly vous attend (avec -10 % pour votre retour 🎁)',
    body: `Bonjour {{customer_name}},

Cela fait quelque temps que votre abonnement sur {{site_name}} s'est arrêté, et nous voulions prendre de vos nouvelles !

Depuis votre dernier passage, nous avons :
✅ Renforcé la stabilité et la rapidité de livraison de tous nos comptes (Netflix, Canva Pro, Prime Video, Spotify Premium, Crunchyroll…).
✅ Ajouté les meilleurs outils IA & Pro du moment (Claude Pro, Google AI Pro, Lovable, Gamma, Notion Business, Coursera, LinkedIn Premium) jusqu'à -85 % moins cher que les tarifs officiels en Dollars.
✅ Simplifié l'espace client pour suivre vos accès et factures en un clic, toujours payable en Ariary via Mvola et Orange Money.

Pour fêter votre retour, nous vous avons réservé un code de réduction personnel de -10 % valable sur toute la boutique :

🎁 Code promo : {{promo_code}}

Réactivez votre abonnement préféré en moins de 2 minutes ici :
👉 {{shop_url}}

Une question sur un produit ou sur la disponibilité d'une place ? Écrivez-nous directement sur WhatsApp : {{whatsapp_url}}

Bon retour parmi nous,
L'équipe {{site_name}}`,
  },
  {
    name: '[Campagne #2] Accord Marketing & Cadeau Clients Historiques (BIENVENUE10)',
    segmentKey: 'consent_pending',
    segmentParams: {},
    promoCode: 'BIENVENUE10',
    bodyMode: 'auto',
    subject: '🎁 {{customer_name}}, le nouveau site Grafikaly est là (+ votre cadeau client fidèle)',
    body: `Bonjour {{customer_name}},

Merci de faire partie des clients historiques de {{site_name}} !

Notre plateforme a fait peau neuve sur {{site_url}} pour vous offrir :
- Une livraison encore plus rapide de vos abonnements (Netflix, Canva Pro, Spotify, Prime Video, Outils IA & Licences Pro).
- Des tarifs en Ariary jusqu'à 8 fois moins chers que les prix officiels en Dollars/Euros, payables simplement par Mvola et Orange Money.
- Des ventes flash et des codes de réduction réservés uniquement à nos membres.

Pour continuer à recevoir nos offres privées, nos alertes de retour en stock et débloquer votre code cadeau de -10 % ({{promo_code}}), confirmez simplement votre accord en 1 clic ci-dessous :

👉 OUI, je veux recevoir les offres privées Grafikaly : {{consent_url}}

Et si vous avez besoin de renouveler un abonnement dès aujourd'hui, utilisez directement votre code {{promo_code}} sur la boutique :
👉 {{shop_url}}

Merci pour votre fidélité,
L'équipe {{site_name}}
Support WhatsApp : {{whatsapp_url}}`,
  },
  {
    name: '[Campagne #3] Cross-Sell Streaming (Clients Netflix -> Prime Video & Spotify)',
    segmentKey: 'product_customers',
    segmentParams: {
      productId: '766434fc-7ff3-45f8-9852-d92bbdf9544f', // NETFLIX | SMARTPHONE/PC
      status: 'active',
    },
    promoCode: 'RETOUR10',
    bodyMode: 'auto',
    subject: '🍿 Vous aimez votre accès Netflix ? Ajoutez Prime Video ou Spotify dès 480 Ar / jour',
    body: `Bonjour {{customer_name}},

Nous sommes ravis de vous compter parmi nos abonnés actifs sur {{product_name}} !

Saviez-vous que la majorité de nos membres combinent leur abonnement Netflix avec un second service pour toute la maison ou leurs déplacements, sans jamais utiliser de carte bancaire ?

En ce moment, des places sont disponibles immédiatement sur :
🎬 PRIME VIDEO (Smart TV, PC & Smartphone) : dès 19 500 Ar / mois (ou 49 000 Ar pour 3 mois, soit seulement 540 Ar / jour !).
🎵 SPOTIFY PREMIUM (activé directement sur votre propre compte personnel) : 49 000 Ar pour 3 mois ou 129 000 Ar pour 12 mois complets (10 750 Ar / mois).
🔥 CRUNCHYROLL MEGAFAN : dès 14 500 Ar / mois.

En tant qu'abonné actif Grafikaly, profitez de -10 % de remise immédiate sur votre prochain ajout avec le code : {{promo_code}}

Découvrir les places disponibles en boutique :
👉 {{shop_url}}

Bon divertissement,
L'équipe {{site_name}}`,
  },
  {
    name: '[Campagne #4] Cross-Sell B2B (Clients Canva Pro -> Outils IA & Site E-commerce 24h)',
    segmentKey: 'product_customers',
    segmentParams: {
      productId: 'd52589b0-8f3c-43b8-95d8-5903d825c76f', // Canva Pro Éducation
      status: null,
    },
    promoCode: 'RETOUR10',
    bodyMode: 'auto',
    subject: '🚀 {{customer_name}}, vous utilisez Canva Pro : découvrez comment aller 5x plus vite (IA & Site Web en 24h)',
    body: `Bonjour {{customer_name}},

En tant qu'utilisateur de {{product_name}} chez Grafikaly, vous savez déjà à quel point les bons outils professionnels font gagner du temps et des clients.

Beaucoup de nos membres créateurs, freelances et entrepreneurs à Madagascar nous ont demandé comment aller encore plus loin sans payer des abonnements en Dollars hors de prix. Voici 2 nouveautés majeures disponibles dès aujourd'hui :

1️⃣ LES MEILLEURS OUTILS IA & PRO JUSQU'À -85 % (Payables en Mvola / Orange Money) :
- Gamma Pro (12 mois) : créez des présentations et dossiers clients par IA en 2 minutes (289 000 Ar/an au lieu de 955 000 Ar).
- Notion Business avec IA (3 ou 12 mois) : organisez tous vos projets et clients dès 69 000 Ar.
- Descript Creator, Framer Pro, Lovable Pro & Google AI Pro (Gemini Advanced + 2 To) : activés directement sur votre compte personnel.
👉 Voir tous les outils Pro : {{shop_url}}

2️⃣ NOUVEAU SERVICE : VOTRE SITE E-COMMERCE OPÉRATIONNEL EN 24H (Dès 349 000 Ar/an hébergement inclus !)
Vous vendez sur Facebook ou WhatsApp et vous voulez une vraie boutique professionnelle comme Grafikaly, livrée clé en main en 24h par notre équipe ?
👉 Découvrir l'offre Création de Site en 24h : {{site_url}}/services/creation-site-ecommerce

En tant que membre Canva Pro, utilisez le code {{promo_code}} (-10 %) sur votre prochain outil Pro en boutique.

Vous avez une question ou souhaitez un conseil personnalisé pour votre activité ? Écrivez-nous directement sur WhatsApp : {{whatsapp_url}}

À votre succès,
L'équipe {{site_name}}`,
  },
  {
    name: '[Campagne #5] Grand Réveil des Clients Dormants (-10% RETOUR10)',
    segmentKey: 'dormant_customers',
    segmentParams: { minDays: 30 },
    promoCode: 'RETOUR10',
    bodyMode: 'auto',
    subject: '🔥 {{customer_name}}, vos abonnements préférés jusqu’à -85 % en Ariary (sans carte Visa)',
    body: `Bonjour {{customer_name}},

Cela fait un moment que nous ne vous avons pas vu sur {{site_name}} !

Saviez-vous que vous pouvez désormais accéder à plus de 25 abonnements officiels et outils IA directement en Ariary (Mvola / Orange Money), sans carte bancaire internationale et jusqu'à 8 fois moins cher que le prix officiel en Dollars ?

Voici nos offres les plus demandées cette semaine à Madagascar :
🎬 STREAMING & MUSIQUE :
- Netflix (Smartphone/PC ou Smart TV) : dès 24 500 Ar / mois
- Prime Video (TV, PC & Mobile) : dès 19 500 Ar / mois (ou 49 000 Ar pour 3 mois)
- Spotify Premium (sur votre propre compte) : 49 000 Ar (3 mois) ou 129 000 Ar (12 mois, soit 10 750 Ar/mois !)
- Crunchyroll MegaFan : dès 14 500 Ar / mois

🎨 DESIGN, IA & CARRIÈRE :
- Canva Pro Éducation : dès 14 500 Ar (1 mois) ou 98 000 Ar (12 mois complets, soit 270 Ar / jour !)
- Outils IA & Pro (Notion Business, Gamma Pro, Descript, Framer, Lovable, Google AI Pro, Coursera, LinkedIn Premium, Windows 11 Pro).

🎁 OFFRE DE RETOUR : Bénéficiez de -10 % supplémentaires sur toute la boutique avec votre code personnel : {{promo_code}}

Découvrez tout le catalogue et activez vos accès ici :
👉 {{shop_url}}

Une question ? Notre équipe vous répond sur WhatsApp : {{whatsapp_url}}

À très vite,
L'équipe {{site_name}}`,
  },
];

async function run() {
  const client = new GrafikalyAdminClient();
  await client.login();

  // 1. Snapshot avant création des codes promo et brouillons
  const existingPromos = await client.callServerFn(SERVER_FNS.promos.listPromoCodes, {
    filter: 'all',
    search: '',
  });
  const existingCampaigns = await client.callServerFn(SERVER_FNS.marketing.listCampaigns);
  await saveSnapshot('pre-marketing-drafts-and-promos', {
    promoCodes: existingPromos?.codes ?? [],
    campaigns: existingCampaigns?.campaigns ?? [],
  });

  // 2. Création idempotente des codes promo
  const existingCodesMap = new Map(
    (existingPromos?.codes ?? []).map((c) => [c.code.toUpperCase(), c])
  );
  for (const promo of PROMO_CODES_TO_CREATE) {
    const found = existingCodesMap.get(promo.code.toUpperCase());
    const payload = {
      ...(found?.id ? { id: found.id } : {}),
      ...promo,
    };
    await client.callServerFn(SERVER_FNS.promos.upsertPromoCode, payload);
    console.log(`✅ Code promo prêt : ${promo.code} (-${promo.discountValue}%)`);
  }

  // 3. Création idempotente des 4 campagnes en statut Brouillon (draft) + comptage exact
  const existingCampMap = new Map(
    (existingCampaigns?.campaigns ?? []).map((c) => [c.name, c])
  );
  for (const draft of CAMPAIGN_DRAFTS) {
    const safe = prepareSafeCampaignPayload({
      ...draft,
      htmlContent: draft.body,
    });
    const found = existingCampMap.get(draft.name);
    const segPreview = await client.callServerFn(SERVER_FNS.marketing.previewSegment, {
      segmentKey: draft.segmentKey,
      segmentParams: draft.segmentParams,
    });
    const saved = await client.callServerFn(SERVER_FNS.marketing.saveCampaignDraft, {
      ...(found?.id ? { id: found.id } : {}),
      name: safe.name,
      subject: safe.subject,
      body: draft.body,
      bodyMode: draft.bodyMode,
      bodyHtml: '',
      segmentKey: draft.segmentKey,
      segmentParams: draft.segmentParams,
      promoCode: draft.promoCode,
      scheduledAt: null, // Strictement en Brouillon (draft)
    });
    console.log(
      `✅ Brouillon enregistré : "${draft.name}" | ID: ${saved.id} | Destinataires ciblés: ${segPreview?.count ?? '?'}`
    );
  }
}

run().catch((err) => {
  console.error('❌ Erreur :', err);
  process.exit(1);
});
