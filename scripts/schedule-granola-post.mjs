import fs from 'node:fs';
import path from 'node:path';
import { validateFbEnvConfig } from '../src/lib/fb-config.mjs';

async function main() {
  const cfg = validateFbEnvConfig();
  const imagePath = path.resolve('backups/visuals/nb-08-granola-ai-business.jpg');
  const imageBuf = fs.readFileSync(imagePath);

  // Programmation pour ce matin Vendredi 23/10/2026 à 09h00 (Heure de Madagascar, GMT+3)
  const scheduledDate = new Date('2026-10-23T09:00:00+03:00');
  const scheduledUnixTime = Math.floor(scheduledDate.getTime() / 1000);

  const caption = `🎙️ Combien de décisions importantes et d'actions concrètes se perdent chaque semaine après vos réunions faute de compte-rendu clair ?

Pendant que vous échangez avec vos clients, partenaires ou équipes, GRANOLA AI BUSINESS écoute, transcrit et transforme automatiquement vos réunions en comptes-rendus structurés et ultra-professionnels.

✅ Ce que Granola AI change concrètement pour votre quotidien :
• Transcription audio ultra-précise et détection automatique des intervenants
• Synthèse intelligente par IA : extrait automatiquement les décisions clés, les points d'accord et les to-do listes
• Prise de notes discrète sans bot visible dans vos visioconférences
• Compatible avec Zoom, Google Meet, Microsoft Teams et vos réunions en présentiel
• Accès Business complet pendant 12 mois sur votre propre compte

🇲🇬 Activation rapide et paiement local simplifié en Ariary via Mvola ou Orange Money (sans carte bancaire internationale).

👇 Commentez "GRANOLA" ou "INFO" ci-dessous et je vous envoie immédiatement tous les détails de l'offre en message privé (MP) !`;

  const form = new FormData();
  form.append('access_token', cfg.pageAccessToken);
  form.append('caption', caption);
  form.append('published', 'false');
  form.append('scheduled_publish_time', String(scheduledUnixTime));
  form.append('temporary', 'false');
  form.append('source', new Blob([imageBuf], { type: 'image/jpeg' }), 'nb-08-granola-ai-business.jpg');

  console.log(`Programmation du post Granola AI sur la Page Facebook Grafikaly (${scheduledDate.toLocaleString('fr-FR', { timeZone: 'Indian/Antananarivo' })})...`);
  const res = await fetch(`https://graph.facebook.com/v21.0/${cfg.pageId}/photos`, {
    method: 'POST',
    body: form,
  });

  const data = await res.json();
  if (!res.ok || data.error) {
    throw new Error(`Erreur Graph API (${res.status}): ${data.error?.message || JSON.stringify(data)}`);
  }

  console.log('✅ Publication Granola AI programmée avec succès pour 09h00 ce matin !');
  console.log(`Photo ID: ${data.id}`);
  console.log(`Post ID: ${data.post_id || data.id}`);
  console.log(`Date programmée: ${scheduledDate.toISOString()}`);
}

main().catch((err) => {
  console.error('❌ Erreur :', err);
  process.exit(1);
});
