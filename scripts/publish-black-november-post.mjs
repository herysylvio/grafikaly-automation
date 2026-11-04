import fs from 'node:fs';
import path from 'node:path';
import { validateFbEnvConfig } from '../src/lib/fb-config.mjs';

async function main() {
  const cfg = validateFbEnvConfig();
  const imagePath = path.resolve('backups/visuals/nb-09-black-november-week1.jpg');
  const imageBuf = fs.readFileSync(imagePath);

  const caption = `🔥 C'EST PARTI POUR LE BLACK NOVEMBER CHEZ GRAFIKALY !

Pourquoi attendre le dernier vendredi du mois pour débloquer votre plein potentiel créatif ?
Pendant tout le mois de novembre, profitez des plus gros avantages de l'année sur vos outils indispensables.

🎬 SEMAINE 1 : SPÉCIAL CRÉATEURS DE CONTENU & IA
Pour tous ceux qui publient sur TikTok, Instagram Reels, YouTube Shorts, ou qui gèrent une page Facebook professionnelle à Madagascar :

✅ CAPCUT PRO : Export 4K 60 FPS sans filigrane, sous-titres automatiques IA en 1 clic, effets et ralentis ultra-fluides débloqués.
✅ CANVA PRO (Magic Studio IA) : Détourage photo/vidéo instantané, gomme magique et millions de templates premium sans restriction.
✅ Accès sécurisé et personnel sur vos propres comptes
✅ Activation express en quelques minutes

🇲🇬 Aucun besoin de carte bancaire internationale : paiement 100 % local en Ariary via Mvola et Orange Money.

⚠️ Quantités limitées pour la Semaine 1.

👇 Commentez "BLACK" ou "INFO" ci-dessous et je vous envoie immédiatement tous les détails des offres en message privé (MP) !`;

  const form = new FormData();
  form.append('access_token', cfg.pageAccessToken);
  form.append('caption', caption);
  form.append('published', 'true');
  form.append('source', new Blob([imageBuf], { type: 'image/jpeg' }), 'nb-09-black-november-week1.jpg');

  console.log('Publication LIVE du lancement Black November sur la Page Facebook Grafikaly...');
  const res = await fetch(`https://graph.facebook.com/v21.0/${cfg.pageId}/photos`, {
    method: 'POST',
    body: form,
  });

  const data = await res.json();
  if (!res.ok || data.error) {
    throw new Error(`Erreur Graph API (${res.status}): ${data.error?.message || JSON.stringify(data)}`);
  }

  console.log('✅ Publication Black November réussie (LIVE) !');
  console.log(`Photo ID: ${data.id}`);
  console.log(`Post ID: ${data.post_id || data.id}`);
}

main().catch((err) => {
  console.error('❌ Erreur :', err);
  process.exit(1);
});
