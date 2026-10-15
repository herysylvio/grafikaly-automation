import fs from 'node:fs';
import path from 'node:path';
import { validateFbEnvConfig } from '../src/lib/fb-config.mjs';

async function main() {
  const cfg = validateFbEnvConfig();
  const imagePath = path.resolve('backups/visuals/nb-06-notion-business.jpg');
  const imageBuf = fs.readFileSync(imagePath);

  const caption = `💼 Votre équipe perd encore du temps avec des fichiers éparpillés, des tableaux introuvables et des tâches oubliées ?

Avec NOTION BUSINESS (et Notion AI intégré), centralisez l'intégralité de vos projets, clients, documents et processus dans un espace de travail ultra-moderne et collaboratif.

✅ Ce que Notion Business apporte à votre organisation :
• Espaces d'équipe (Teamspaces) dédiés pour chaque département (Marketing, Vente, Dév, Direction)
• Notion AI illimité : rédigez, résumez vos réunions et analysez vos données en un clic
• Tableaux Kanban, bases de données interconnectées et suivi CRM complet
• Permissions avancées, historique illimité et sécurité entreprise
• Accès sur tous vos appareils (PC, Mac, iPhone, Android)

🇲🇬 Activation rapide et paiement local en Ariary via Mvola ou Orange Money (pas besoin de carte Visa internationale).

👇 Commentez "NOTION" ou "INFO" ci-dessous et je vous envoie immédiatement tous les détails + le tarif spécial Madagascar en message privé (MP) !`;

  const form = new FormData();
  form.append('access_token', cfg.pageAccessToken);
  form.append('caption', caption);
  form.append('published', 'true');
  form.append('source', new Blob([imageBuf], { type: 'image/jpeg' }), 'nb-06-notion-business.jpg');

  console.log('Publication en cours sur la Page Facebook Grafikaly...');
  const res = await fetch(`https://graph.facebook.com/v21.0/${cfg.pageId}/photos`, {
    method: 'POST',
    body: form,
  });

  const data = await res.json();
  if (!res.ok || data.error) {
    throw new Error(`Erreur Graph API: ${data.error?.message || JSON.stringify(data)}`);
  }

  console.log('✅ Publication Notion Business réussie !');
  console.log(`Photo ID: ${data.id}`);
  console.log(`Post ID: ${data.post_id || data.id}`);
}

main().catch((err) => {
  console.error('❌ Erreur :', err);
  process.exit(1);
});
