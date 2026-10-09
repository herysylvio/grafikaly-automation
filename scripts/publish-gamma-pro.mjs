import fs from 'node:fs/promises';
import path from 'node:path';
import { validateFbEnvConfig } from '../src/lib/fb-config.mjs';

async function main() {
  const cfg = validateFbEnvConfig();
  const imagePath = path.resolve('backups/visuals/nb-04-gamma-pro.jpg');
  const fileBuf = await fs.readFile(imagePath);

  const caption = `📊 Fini de passer 4 heures sur PowerPoint à aligner des blocs et chercher des icônes.

Avec GAMMA PRO, vous décrivez simplement votre idée ou vous collez vos notes brutes : l'IA génère une présentation complète, professionnelle et magnifiquement mise en page en 60 secondes chrono.

✅ Ce que Gamma Pro débloque pour vous :
• Diaporamas, pitch decks et rapports générés par l'IA en 1 clic
• Zéro filigrane ni badge Gamma sur vos exports
• Export direct en PowerPoint (.pptx) et PDF Haute Définition
• Idéal pour consultants, formateurs, dirigeants et étudiants à Madagascar

🇲🇬 Activation rapide et assistance locale via Mvola ou Orange Money.

👇 Commentez "GAMMA" ou "INFO" ci-dessous et je vous envoie immédiatement tous les détails de l'accès en message privé (MP) !`;

  const form = new FormData();
  form.append('access_token', cfg.pageAccessToken);
  form.append('caption', caption);
  form.append('published', 'true');
  form.append('source', new Blob([fileBuf], { type: 'image/jpeg' }), 'gamma-pro-hero.jpg');

  console.log('🚀 Publication immédiate de GAMMA PRO sur Grafikaly...');
  const res = await fetch(`https://graph.facebook.com/v22.0/${cfg.pageId}/photos`, { method: 'POST', body: form });
  const data = await res.json();
  if (!res.ok || data.error) {
    throw new Error(`Erreur upload photo: ${data.error?.message || JSON.stringify(data)}`);
  }
  console.log('✅ Publication réussie !');
  console.log('Photo ID:', data.id);
  console.log('Post ID :', data.post_id || data.id);
}

main().catch(console.error);
