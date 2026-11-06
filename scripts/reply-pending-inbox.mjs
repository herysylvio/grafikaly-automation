import { validateFbEnvConfig, callGraphApi } from '../src/lib/fb-config.mjs';
import { markAsProcessed } from '../src/lib/fb-state.mjs';

const cfg = validateFbEnvConfig();
const pageId = cfg.pageId;

async function run() {
  // 1. Angelico Dorlys
  const msgAngelico = `Bonjour Angelico 👋

En quoi pouvons-nous vous aider aujourd'hui ?
Recherchez-vous un outil d'intelligence artificielle, un logiciel de création (Canva, CapCut...), un abonnement streaming ou une formation certifiante (Coursera Plus) ?

Vous pouvez aussi consulter directement l'ensemble de nos offres disponibles avec paiement local par Mvola ou Orange Money sur notre boutique :
👉 https://www.grafikaly.mg`;

  console.log('Envoi à Angelico Dorlys...');
  await callGraphApi(cfg, `/${pageId}/messages`, {
    method: 'POST',
    body: {
      recipient: { id: '29399152006382776' },
      messaging_type: 'RESPONSE',
      message: { text: msgAngelico },
    },
  });
  await markAsProcessed('m_EFFBmXu631TKureMukULmVy9wRPkSJffoTuxyXmVs-bgIWyHAZBfNx4JBqE0Lo5V_c5ykvqbAP6G3I5CpJ_Mkg', { actionType: 'MESSENGER_GREETING_REPLY' });
  console.log('✅ Envoyé avec succès à Angelico Dorlys');

  // 2. Haja Ran
  const msgHaja = `Salama Haja 👋

Misaotra betsaka tamin'ny hafatrao !
Mba hahafahanay manome anao ny vidiny marina, inona azafady ilay tolotra na logiciel mahaliana anao (ohatra : Canva Pro, CapCut Pro, Coursera Plus, Netflix...) ?

Azonao jerena mivantana ato amin'ny tranonkalanay koa ny tolotra rehetra sy ny sarany amin'ny Ariary (fandoavana amin'ny Mvola na Orange Money) :
👉 https://www.grafikaly.mg

Mijanona ho eo am-pelatananao foana izahay raha misy fanontaniana fanampiny ! 😊`;

  console.log('Envoi à Haja Ran...');
  await callGraphApi(cfg, `/${pageId}/messages`, {
    method: 'POST',
    body: {
      recipient: { id: '38149400791370842' },
      messaging_type: 'RESPONSE',
      message: { text: msgHaja },
    },
  });
  await markAsProcessed('m_QCyxqFv5l1P2m8Wi_EuOlTnOnEawH3Urr08a1y7lDWdkxOR4IP3Rl6l6J4xpTn-jZjXCZ2rrsKFj3QiH1f2eyA', { actionType: 'MESSENGER_MALAGASY_QUALIFY_REPLY' });
  console.log('✅ Envoyé avec succès à Haja Ran');
}

run().catch((err) => {
  console.error('Erreur:', err);
  process.exit(1);
});
