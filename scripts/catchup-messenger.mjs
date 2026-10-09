import { validateFbEnvConfig, callGraphApi } from '../src/lib/fb-config.mjs';

const recipients = [
  {
    name: 'Mamonjy Andry',
    psid: '26148458864828763',
    convId: 't_35684566211157648',
    text: 'Salama Mamonjy 👋 Désolé pour le délai, nous étions en pleine migration technique de notre site. Actuellement Claude Pro et Perplexity sont en rupture de stock, mais notre nouvelle plateforme est en ligne avec Google AI Pro (Gemini Advanced) et nos autres outils IA disponibles immédiatement 👉 https://www.grafikaly.mg'
  },
  {
    name: 'Hary Fidy',
    psid: '29010309858657812',
    convId: 't_2179046176349609',
    text: 'Salama Hary 👋 Toutes nos excuses pour ce silence sur Messenger, notre messagerie était en cours de migration technique. Je vérifie avec vous : avez-vous bien reçu et activé votre licence Windows 11 Pro (commande S09291) depuis, ou avez-vous encore besoin d\'assistance ?'
  },
  {
    name: 'Tatamo Herandria',
    psid: '29160942580179445',
    convId: 't_2298744297565332',
    text: 'Salama Tatamo 👋 Toutes nos excuses pour le délai, nous étions en pleine refonte de notre système. CapCut Pro est momentanément en rupture de stock, mais vous pouvez découvrir tous nos autres outils créatifs disponibles (Canva Pro, Descript...) sur notre nouveau site 👉 https://www.grafikaly.mg'
  },
  {
    name: 'BO LO',
    psid: '28684298131205749',
    convId: 't_1621552945977657',
    text: 'Bonjour 👋 Désolé pour ce retour tardif, nous finalisions la migration de notre plateforme ! Notre offre de Création de Site E-commerce clé en main en 24h est à 349 000 Ar. Notre système est de nouveau 100 % opérationnel, vous pouvez voir tous les détails ici 👉 https://www.grafikaly.mg/services/creation-site-ecommerce'
  },
  {
    name: 'Hars Ran',
    psid: '28261950203467597',
    convId: 't_1081600644733809',
    text: 'Salama tompoko 👋 Toutes nos excuses pour ce contretemps, notre système de gestion des devis était en pleine refonte et migration. Notre système est maintenant rétabli : votre demande de devis est-elle toujours d\'actualité ? Si oui, dites-le-moi et nous la traitons en priorité !'
  }
];

async function main() {
  const cfg = validateFbEnvConfig();
  console.log('=== ENVOI DU RATTRAPAGE MESSENGER (5 CONTACTS VALIDÉS) ===\n');
  const results = [];

  for (const r of recipients) {
    console.log(`Tentative pour ${r.name} (${r.psid})...`);
    let sent = false;
    let method = '';
    let reason = '';

    // 1. Essai RESPONSE standard
    try {
      await callGraphApi(cfg, `/${cfg.pageId}/messages`, {
        method: 'POST',
        body: {
          recipient: { id: r.psid },
          messaging_type: 'RESPONSE',
          message: { text: r.text }
        }
      });
      sent = true;
      method = 'API (Standard RESPONSE)';
      console.log(`  ✅ ENVOYÉ avec succès via ${method} !`);
    } catch (err1) {
      // 2. Essai avec HUMAN_AGENT tag
      try {
        await callGraphApi(cfg, `/${cfg.pageId}/messages`, {
          method: 'POST',
          body: {
            recipient: { id: r.psid },
            messaging_type: 'MESSAGE_TAG',
            tag: 'HUMAN_AGENT',
            message: { text: r.text }
          }
        });
        sent = true;
        method = 'API (Tag HUMAN_AGENT)';
        console.log(`  ✅ ENVOYÉ avec succès via ${method} !`);
      } catch (err2) {
        reason = err2.message;
        console.log(`  ℹ️ Meta bloque l'envoi API direct (>24h sans tag approuvé) : ${reason.slice(0, 75)}...`);
      }
    }

    results.push({ ...r, sent, method, reason });
    await new Promise(res => setTimeout(res, 1200));
  }

  console.log('\n=== BILAN FINAL ===');
  console.log(JSON.stringify(results.map(x => ({ name: x.name, sent: x.sent, method: x.method })), null, 2));
}

main().catch(console.error);
