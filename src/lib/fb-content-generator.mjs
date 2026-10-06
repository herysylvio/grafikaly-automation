const STREAMING_AND_GAMING_SLUGS = new Set([
  'netflix-smartphone-pc-uniquement',
  'netflix-smart-tv',
  'prime-video',
  'spotify-premium',
  'crunchyroll',
  'crunchyroll-megafan',
  'dramabox-vip',
  'gta-vi-ps5-pre-commande',
  'duolingo-super',
]);

export function filterAvailableProducts(products = [], { onlyAiAndPro = true } = {}) {
  return products.filter((p) => {
    if (p.availability === 'unavailable' || p.is_active === false) return false;
    if (onlyAiAndPro && STREAMING_AND_GAMING_SLUGS.has(String(p.slug).toLowerCase())) return false;
    return true;
  });
}

const AI_COPY_TEMPLATES = {
  'google-ai-pro': {
    hook: `🚨 Et si un seul abonnement réglait à la fois vos besoins en Intelligence Artificielle avancée ET votre problème de stockage saturé ?`,
    body: `Avec Google AI PRO pendant 12 mois, débloquez toute la puissance de Gemini Advanced couplée à 2 To de stockage Cloud pour Drive, Gmail et Google Photos.`,
    bullets: [
      `Accès à Gemini Advanced (rédaction, code, analyse de longs documents)`,
      `IA intégrée directement dans Gmail, Docs et Sheets`,
      `2 To (2 000 Go) d'espace sécurisé sur votre compte`,
      `Accès complet pendant 12 mois sur votre propre compte Google`,
    ],
    cta: `💬 Commentez "GEMINI" ou "INFO" ci-dessous (ou écrivez-nous en MP) pour recevoir les détails de l'offre.`,
  },
  'canva-pro-education': {
    hook: `🎨 Combien d'heures perdez-vous chaque semaine à chercher les bons visuels ou à être bloqué par les éléments réservés aux comptes Pro ?`,
    body: `Passez à la vitesse supérieure avec Canva Pro et ses outils d'Intelligence Artificielle (Magic Studio) activés directement sur votre compte personnel.`,
    bullets: [
      `Détourage photo et vidéo en un seul clic`,
      `Outils IA Magic Studio pour générer et modifier vos visuels`,
      `Accès illimité aux millions de templates, photos et polices Premium`,
      `Activation directe sur votre adresse e-mail personnelle`,
    ],
    cta: `💬 Commentez "CANVA" ou "INFO" ci-dessous pour recevoir tous les détails en message privé.`,
  },
  'lovable-pro': {
    hook: `💻 Vous avez une idée d'application web, de SaaS ou de site client, mais le développement classique vous prend des semaines ?`,
    body: `Avec Lovable PRO, transformez vos instructions en applications web complètes, modernes et prêtes pour la production grâce à l'IA, pendant 12 mois.`,
    bullets: [
      `Création d'interfaces et de backends complets par simple prompt`,
      `Synchronisation GitHub et déploiement ultra-rapide`,
      `Idéal pour les développeurs, freelances, agences et entrepreneurs`,
      `Accès PRO pendant 12 mois`,
    ],
    cta: `💬 Commentez "LOVABLE" ou "INFO" ci-dessous pour recevoir les détails de l'offre en MP.`,
  },
  'framer-pro': {
    hook: `⚡ Pourquoi certains designers et freelances livrent des sites web dignes des meilleures startups en quelques jours seulement ?`,
    body: `Avec Framer PRO pendant 12 mois, concevez et publiez des sites web ultra-fluides, responsives et animés sans écrire une seule ligne de code.`,
    bullets: [
      `Génération et mise en page assistées par l'IA`,
      `Animations et effets visuels de niveau agence`,
      `Optimisation SEO et performances ultra-rapides`,
      `Accès complet pendant 12 mois sur votre compte`,
    ],
    cta: `💬 Commentez "FRAMER" ou "INFO" ci-dessous pour connaître les détails de l'offre.`,
  },
  'descript-creator': {
    hook: `🎬 Monter une vidéo ou un podcast vous prend encore des heures de découpage minutieux sur une timeline complexe ?`,
    body: `Avec Descript Creator pendant 12 mois, montez vos vidéos et vos audios aussi simplement que si vous modifiez un document texte grâce à l'IA.`,
    bullets: [
      `Suppression automatique des blancs ("euh", silences) en un clic`,
      `Amélioration audio qualité studio par IA (Studio Sound)`,
      `Sous-titrage automatique dynamique et clonage/correction vocale`,
      `Accès Creator pendant 12 mois`,
    ],
    cta: `💬 Commentez "DESCRIPT" ou "INFO" ci-dessous pour recevoir les détails en message privé.`,
  },
  'gamma-pro': {
    hook: `📊 Vous passez encore vos soirées à aligner des zones de texte sur PowerPoint avant une réunion ou une présentation client ?`,
    body: `Avec Gamma PRO, générez des présentations professionnelles, des dossiers clients et des documents structurés en quelques secondes grâce à l'IA.`,
    bullets: [
      `Génération complète de slides et documents à partir d'une simple idée`,
      `Mise en page automatique, moderne et interactive`,
      `Export PDF et PowerPoint sans filigrane`,
      `Accès PRO pendant 12 mois`,
    ],
    cta: `💬 Commentez "GAMMA" ou "INFO" ci-dessous pour recevoir les détails de l'offre.`,
  },
  'n8n-starter': {
    hook: `🤖 Combien de tâches répétitives votre équipe effectue encore à la main chaque jour alors qu'un workflow IA pourrait les gérer 24h/24 ?`,
    body: `Avec n8n Starter Cloud pendant 12 mois, connectez vos applications, créez des agents IA autonomes et automatisez vos processus métiers sans limite.`,
    bullets: [
      `Création de workflows d'automatisation et d'agents IA sur mesure`,
      `Intégration native avec des centaines d'outils (OpenAI, Google, CRM, Webhooks)`,
      `Hébergement Cloud officiel prêt à l'emploi pendant 12 mois`,
    ],
    cta: `💬 Commentez "N8N" ou "INFO" ci-dessous pour recevoir les détails en message privé.`,
  },
  'notion-business': {
    hook: `💼 Votre équipe travaille encore avec des documents éparpillés, des fichiers introuvables et des tâches qui se perdent ?`,
    body: `Avec Notion Business + Notion AI, centralisez tous vos projets, clients, processus et bases de données dans un seul espace de travail intelligent.`,
    bullets: [
      `Espaces d'équipe (Teamspaces) structurés pour chaque pôle`,
      `Notion AI inclus pour rédiger, résumer et organiser vos notes instantanément`,
      `Suivi de projets, CRM et documentation au même endroit`,
      `Activation directe sur votre compte`,
    ],
    cta: `💬 Commentez "NOTION" ou "INFO" ci-dessous pour recevoir les détails de l'offre.`,
  },
};

export function generatePsychologicalPost(product, angle = 'NO_PRICE_CURIOSITY') {
  if (product.availability === 'unavailable' || product.is_active === false) {
    throw new Error(`Impossible de générer un post promotionnel pour un produit en rupture : ${product.name}`);
  }

  const slug = String(product.slug).toLowerCase();
  const tpl = AI_COPY_TEMPLATES[slug];
  const isServiceWeb = slug === 'service-site-ecommerce';
  const basePath = isServiceWeb ? '/services/creation-site-ecommerce' : `/produit/${product.slug}`;
  const url = `https://www.grafikaly.mg${basePath}?utm_source=facebook&utm_medium=organic_post&utm_campaign=ai_curiosity`;

  let caption = '';
  if (tpl) {
    const bulletsText = tpl.bullets.map((b) => `✅ ${b}`).join('\n');
    caption =
      `${tpl.hook}\n\n` +
      `${tpl.body}\n\n` +
      `${bulletsText}\n\n` +
      `🔥 Offre exclusive disponible dès maintenant chez Grafikaly.\n` +
      `${tpl.cta}\n\n` +
      `#Grafikaly #IntelligenceArtificielle #Productivite #Madagascar`;
  } else {
    caption =
      `🚀 Passez à la vitesse supérieure avec ${product.name} grâce à l'Intelligence Artificielle.\n\n` +
      `✅ Gain de temps immédiat au quotidien\n` +
      `✅ Rendus et fonctionnalités de niveau professionnel\n` +
      `✅ Activation simple et rapide avec l'accompagnement Grafikaly\n\n` +
      `🔥 Offre exclusive disponible en quantité limitée.\n` +
      `💬 Commentez "INFO" ou écrivez-nous en message privé pour connaître tous les détails de l'offre.\n\n` +
      `#Grafikaly #IA #Productivite`;
  }

  return {
    productSlug: product.slug,
    productName: product.name,
    angle,
    priceRevealedInPost: false,
    caption,
    targetUrl: url,
    published: false,
  };
}
