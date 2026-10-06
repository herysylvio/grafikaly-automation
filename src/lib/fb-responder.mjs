import fs from 'node:fs';
import path from 'node:path';

const RULES_PATH = path.resolve('config', 'fb-rules.json');

function loadRules() {
  try {
    return JSON.parse(fs.readFileSync(RULES_PATH, 'utf8'));
  } catch {
    return {
      supportKeywords: ['marche pas', 'marche plus', 'problème', 'probleme', 'erreur', 'coupé', 'coupe', 'mot de passe incorrect', 'remboursement', 'arnaque', 'tsy mandeha'],
      priceKeywords: ['prix', 'mp', 'pv', 'inbox', 'combien', 'ohatrinona', 'info', 'infos', 'dispo', 'disponible', 'mbola misy', 'intéressé', 'interesse', 'mvola', 'orange money', 'comment acheter', 'ahoana', 'tarif', 'lien'],
      publicReplyVariants: [
        "Bonjour {{first_name}} 👋 C'est disponible immédiatement ! Je viens de vous envoyer le tarif en Ariary et le lien d'accès direct dans vos messages privés (Messenger) 📩"
      ],
      productKeywordMap: [],
      postProductMap: {},
    };
  }
}

export function formatMga(amount) {
  return Number(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

export function classifyCommentIntent(message = '') {
  const rules = loadRules();
  const norm = message.toLowerCase().trim();
  if (!norm || !/[a-z0-9]/i.test(norm)) return 'IGNORE';
  if (rules.supportKeywords.some((kw) => norm.includes(kw))) {
    return 'SUPPORT_ALERT';
  }
  if (rules.priceKeywords.some((kw) => norm.includes(kw))) {
    return 'PRICE_OR_INFO';
  }
  return 'GENERAL_QUESTION';
}

export function detectProductSlugFromText(text = '') {
  const rules = loadRules();
  const norm = text.toLowerCase();
  for (const entry of rules.productKeywordMap) {
    if (entry.keywords.some((kw) => norm.includes(kw))) {
      return entry.slug;
    }
  }
  return null;
}

export function buildCommentActions({ comment, product, dryRun = true, variantIndex = null }) {
  const rules = loadRules();
  const rawFirst = comment.from?.name ? comment.from.name.split(' ')[0].trim() : '';
  const nameSuffix = rawFirst ? ` ${rawFirst}` : '';
  const createdMs = new Date(comment.created_time || Date.now()).getTime();
  const ageDays = (Date.now() - createdMs) / (1000 * 60 * 60 * 24);

  const isServiceWeb = product.slug === 'service-site-ecommerce';
  const basePath = isServiceWeb ? '/services/creation-site-ecommerce' : `/produit/${product.slug}`;
  const url = `https://www.grafikaly.mg${basePath}?utm_source=facebook&utm_medium=comment_dm`;
  const priceStr = `${formatMga(product.price_mga)} Ar`;

  if (product.availability === 'unavailable') {
    return {
      commentId: comment.id,
      dryRun: Boolean(dryRun),
      actionType: 'OUT_OF_STOCK_WAITLIST',
      publicReply: `Bonjour${nameSuffix} 👋 Toutes les places pour ${product.name} viennent d'être prises, mais vous pouvez rejoindre la liste d'attente prioritaire sur notre site ! Je vous ai envoyé le lien en MP 📩`,
      privateReply: `Bonjour${nameSuffix} ! Actuellement ${product.name} est victime de son succès (stock complet). 👉 Inscrivez-vous gratuitement sur la liste d'attente ici pour être alerté dès l'ouverture d'une place : ${url}`,
    };
  }

  if (ageDays > 7) {
    return {
      commentId: comment.id,
      dryRun: Boolean(dryRun),
      actionType: 'PUBLIC_ONLY_OLDER_THAN_7D',
      publicReply: `Bonjour${nameSuffix} 👋 C'est disponible dès ${priceStr} payable par Mvola/Orange Money ! Commandez directement ici : ${url}`,
      privateReply: null,
    };
  }

  const anchorText = product.compare_at_price_mga && product.compare_at_price_mga > product.price_mga
    ? ` (au lieu de ~${formatMga(product.compare_at_price_mga)} Ar en tarif officiel)`
    : '';

  const variants = rules.publicReplyVariants;
  const idx = variantIndex !== null ? variantIndex % variants.length : Math.floor(Math.random() * variants.length);
  const publicReply = variants[idx]
    .replace(/\s*\{\{first_name\}\}/g, nameSuffix);

  return {
    commentId: comment.id,
    dryRun: Boolean(dryRun),
    actionType: 'PUBLIC_AND_PRIVATE_REPLY',
    publicReply,
    privateReply:
      `Bonjour${nameSuffix} ! Voici les détails pour **${product.name}** sur Grafikaly :\n` +
      `✅ Tarif : Dès ${priceStr}${anchorText}\n` +
      `💳 Paiement 100 % local : Mvola ou Orange Money (sans carte bancaire)\n` +
      `⚡ Livraison rapide : Accès activé en moins de 2h après validation\n` +
      `👉 Commandez directement en 2 minutes ici : ${url}`,
  };
}
