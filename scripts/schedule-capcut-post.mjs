import fs from 'node:fs';
import path from 'node:path';
import { validateFbEnvConfig, callGraphApi } from '../src/lib/fb-config.mjs';

async function main() {
  const cfg = validateFbEnvConfig();
  const imagePath = path.resolve('backups/visuals/nb-07-capcut-pro.jpg');
  const imageBuf = fs.readFileSync(imagePath);

  // Programmation pour demain matin Lundi 19/10/2026 à 09h00 (Heure de Madagascar, GMT+3)
  const scheduledDate = new Date('2026-10-19T09:00:00+03:00');
  const scheduledUnixTime = Math.floor(scheduledDate.getTime() / 1000);

  const caption = `🎬 Vous passez encore des heures à caler vos sous-titres mot par mot ou vous êtes bloqué par les meilleurs effets réservés aux comptes Pro ?

Passez au niveau supérieur sur TikTok, Instagram Reels, YouTube Shorts et vos vidéos professionnelles avec CAPCUT PRO !

✅ Tout ce que vous débloquez immédiatement :
• Sous-titres automatiques dynamiques par IA en un clic
• Détourage et suppression automatique de l'arrière-plan sans fond vert
• Effets visuels, filtres tendance, transitions et voix IA Pro
• Ralentis ultra-fluides (Optical Flow) et amélioration qualité vidéo IA
• Export en 4K 60 FPS sans filigrane
• Compatible sur PC, Mac et Mobile (Android / iPhone)

🇲🇬 Activation rapide et paiement local simplifié en Ariary via Mvola ou Orange Money (pas besoin de carte bancaire internationale).

👇 Commentez "CAPCUT" ou "INFO" ci-dessous et je vous envoie immédiatement tous les détails de l'offre en message privé (MP) !`;

  const form = new FormData();
  form.append('access_token', cfg.pageAccessToken);
  form.append('caption', caption);
  form.append('published', 'false');
  form.append('scheduled_publish_time', String(scheduledUnixTime));
  form.append('temporary', 'false');
  form.append('source', new Blob([imageBuf], { type: 'image/jpeg' }), 'nb-07-capcut-pro.jpg');

  console.log(`Programmation du post CapCut Pro sur la Page Facebook Grafikaly (${scheduledDate.toLocaleString('fr-FR', { timeZone: 'Indian/Antananarivo' })})...`);
  const res = await fetch(`https://graph.facebook.com/v21.0/${cfg.pageId}/photos`, {
    method: 'POST',
    body: form,
  });

  const data = await res.json();
  if (!res.ok || data.error) {
    throw new Error(`Erreur Graph API (${res.status}): ${data.error?.message || JSON.stringify(data)}`);
  }

  console.log('✅ Publication CapCut Pro programmée avec succès pour demain matin !');
  console.log(`Photo ID: ${data.id}`);
  console.log(`Post ID: ${data.post_id || data.id}`);
  console.log(`Date programmée: ${scheduledDate.toISOString()}`);
}

main().catch((err) => {
  console.error('❌ Erreur :', err);
  process.exit(1);
});
