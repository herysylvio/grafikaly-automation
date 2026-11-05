import fs from 'node:fs';
import path from 'node:path';
import { validateFbEnvConfig } from '../src/lib/fb-config.mjs';

async function main() {
  const cfg = validateFbEnvConfig();
  const imagePath = path.resolve('backups/visuals/nb-10-coursera-plus.jpg');
  const imageBuf = fs.readFileSync(imagePath);

  const caption = `🎓 Combien d'opportunités professionnelles à l'international vous sont déjà passées sous le nez par manque de certifications reconnues ?

La nouvelle offre officielle COURSERA PLUS (accès illimité pendant 12 mois) est disponible chez Grafikaly !
Formez-vous à votre propre rythme et décrochez des diplômes professionnels vérifiés qui valorisent immédiatement votre CV auprès des recruteurs et clients étrangers.

✅ Tout ce qui est débloqué avec votre accès Coursera Plus 12 mois :
• Accès illimité à plus de 7 000 cours, spécialisations et formations certifiantes
• Tous les certificats officiels vérifiés inclus (Google, Meta, IBM, Yale, HEC, Stanford...)
• Ajout direct de vos diplômes certifiés sur votre profil LinkedIn et votre CV
• Compte personnel activé pour 12 mois complets
• Idéal pour développeurs, data analysts, marketeurs, managers, freelances et étudiants à Madagascar

🎁 OFFRE DE LANCEMENT (5 PLACES UNIQUEMENT) :
Bénéficiez de -10% de réduction immédiate avec le code promo exclusif COURSERA10, valable pour les 5 premiers inscrits uniquement !

🇲🇬 Paiement 100 % local en Ariary par Mvola ou Orange Money (aucun besoin de carte bancaire internationale).

👇 Commentez "COURSERA" ou "INFO" ci-dessous et je vous envoie immédiatement le code promo + le lien d'accès direct en message privé (MP) !`;

  const form = new FormData();
  form.append('access_token', cfg.pageAccessToken);
  form.append('caption', caption);
  form.append('published', 'true');
  form.append('source', new Blob([imageBuf], { type: 'image/jpeg' }), 'nb-10-coursera-plus.jpg');

  console.log('Publication LIVE de la nouvelle offre Coursera Plus sur la Page Facebook Grafikaly...');
  const res = await fetch(`https://graph.facebook.com/v21.0/${cfg.pageId}/photos`, {
    method: 'POST',
    body: form,
  });

  const data = await res.json();
  if (!res.ok || data.error) {
    throw new Error(`Erreur Graph API (${res.status}): ${data.error?.message || JSON.stringify(data)}`);
  }

  console.log('✅ Publication Coursera Plus réussie (LIVE) !');
  console.log(`Photo ID: ${data.id}`);
  console.log(`Post ID: ${data.post_id || data.id}`);
}

main().catch((err) => {
  console.error('❌ Erreur :', err);
  process.exit(1);
});
