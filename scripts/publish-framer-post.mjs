import fs from 'node:fs';
import path from 'node:path';
import { validateFbEnvConfig } from '../src/lib/fb-config.mjs';

async function main() {
  const cfg = validateFbEnvConfig();
  const imagePath = path.resolve('backups/visuals/nb-05-framer-pro.jpg');
  const imageBuf = fs.readFileSync(imagePath);

  const caption = `⚡ Pourquoi continuer à coder des sites web à la main pendant des semaines quand vos concurrents livrent des projets en 48h grâce à l'IA ?

Avec FRAMER PRO (accès 12 mois), concevez, animez et mettez en ligne des sites web dignes des meilleures agences internationales sans écrire une seule ligne de code.

✅ Ce que Framer Pro change concrètement pour vos projets :
• Génération et mise en page assistées par l'Intelligence Artificielle
• Effets visuels, micro-interactions et animations 3D ultra-fluides
• Vitesse de chargement optimale et SEO technique déjà configuré
• Hébergement mondial ultra-rapide inclus
• Idéal pour freelances, agences, designers et créateurs à Madagascar

🇲🇬 Paiement local simplifié par Mvola et Orange Money (pas besoin de carte bancaire internationale).

👇 Commentez "FRAMER" ou "INFO" ci-dessous et je vous envoie immédiatement tous les détails + le tarif spécial Madagascar en message privé (MP) !`;

  const form = new FormData();
  form.append('access_token', cfg.pageAccessToken);
  form.append('caption', caption);
  form.append('published', 'true');
  form.append('source', new Blob([imageBuf], { type: 'image/jpeg' }), 'nb-05-framer-pro.jpg');

  console.log('Publication en cours sur la Page Facebook Grafikaly...');
  const res = await fetch(`https://graph.facebook.com/v21.0/${cfg.pageId}/photos`, {
    method: 'POST',
    body: form,
  });

  const data = await res.json();
  if (!res.ok || data.error) {
    throw new Error(`Erreur Graph API: ${data.error?.message || JSON.stringify(data)}`);
  }

  console.log('✅ Publication réussie !');
  console.log(`Photo ID: ${data.id}`);
  console.log(`Post ID: ${data.post_id || data.id}`);
}

main().catch((err) => {
  console.error('❌ Erreur :', err);
  process.exit(1);
});
