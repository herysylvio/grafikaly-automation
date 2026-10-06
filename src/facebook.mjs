#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { loadLocalEnv, validateFbEnvConfig, callGraphApi } from './lib/fb-config.mjs';
import { classifyCommentIntent, detectProductSlugFromText, buildCommentActions } from './lib/fb-responder.mjs';
import { hasProcessedId, markAsProcessed } from './lib/fb-state.mjs';
import { filterAvailableProducts, generatePsychologicalPost } from './lib/fb-content-generator.mjs';

import fsSync from 'node:fs';

const BENCHMARK_CATALOG = [
  { name: 'Canva Pro Éducation', slug: 'canva-pro-education', price_mga: 14500, compare_at_price_mga: 59600, duration_days: 30, availability: 'available', is_active: true },
  { name: 'NETFLIX | SMARTPHONE/PC Uniquement', slug: 'netflix-smartphone-pc-uniquement', price_mga: 24500, compare_at_price_mga: 44200, duration_days: 30, availability: 'available', is_active: true },
  { name: 'NETFLIX | Smart TV', slug: 'netflix-smart-TV', price_mga: 24500, compare_at_price_mga: 49000, duration_days: 30, availability: 'low_availability', is_active: true },
  { name: 'PRIME VIDEO', slug: 'prime-video', price_mga: 19500, compare_at_price_mga: 30000, duration_days: 30, availability: 'available', is_active: true },
  { name: 'SPOTIFY PREMIUM', slug: 'spotify-premium', price_mga: 49000, compare_at_price_mga: 98000, duration_days: 90, availability: 'available', is_active: true },
  { name: 'CRUNCHYROLL MEGAFAN', slug: 'crunchyroll', price_mga: 14500, compare_at_price_mga: 32200, duration_days: 30, availability: 'available', is_active: true },
  { name: 'DUOLINGO SUPER', slug: 'duolingo-super', price_mga: 98000, compare_at_price_mga: 371700, duration_days: 365, availability: 'available', is_active: true },
  { name: 'FRAMER PRO', slug: 'framer-pro', price_mga: 189000, compare_at_price_mga: 1593400, duration_days: 365, availability: 'available', is_active: true },
  { name: 'LOVABLE PRO', slug: 'lovable-pro', price_mga: 349000, compare_at_price_mga: 1327800, duration_days: 365, availability: 'low_availability', is_active: true },
  { name: 'NOTION BUSINESS', slug: 'notion-business', price_mga: 69000, compare_at_price_mga: 349000, duration_days: 90, availability: 'low_availability', is_active: true },
  { name: 'GOOGLE AI PRO', slug: 'google-ai-pro', price_mga: 289000, compare_at_price_mga: 1061700, duration_days: 365, availability: 'available', is_active: true },
  { name: 'DESCRIPT CREATOR', slug: 'descript-creator', price_mga: 249000, compare_at_price_mga: 1274700, duration_days: 365, availability: 'low_availability', is_active: true },
  { name: 'HIGGSFIELD PRO', slug: 'higgsfield-pro', price_mga: 949000, compare_at_price_mga: 2496300, duration_days: 365, availability: 'on_demand', is_active: true },
  { name: 'GRANOLA AI BUSINESS', slug: 'granola-ai-business', price_mga: 169000, compare_at_price_mga: 743600, duration_days: 365, availability: 'available', is_active: true },
  { name: 'WISPR FLOW PRO', slug: 'wispr-flow-pro', price_mga: 249000, compare_at_price_mga: 620000, duration_days: 365, availability: 'available', is_active: true },
  { name: 'GAMMA PRO', slug: 'gamma-pro', price_mga: 289000, compare_at_price_mga: 956000, duration_days: 365, availability: 'available', is_active: true },
  { name: 'COURSERA PRO | 12 MOIS', slug: 'coursera-pro', price_mga: 249000, compare_at_price_mga: 1766000, duration_days: 365, availability: 'available', is_active: true },
  { name: 'DRAMABOX VIP', slug: 'dramabox-vip', price_mga: 24500, compare_at_price_mga: 177000, duration_days: 30, availability: 'low_availability', is_active: true },
  { name: 'LINKEDIN PREMIUM BUSINESS', slug: 'linkedin-premium-business', price_mga: 129000, compare_at_price_mga: 531000, duration_days: 60, availability: 'available', is_active: true },
  { name: 'Licence WINDOWS PRO', slug: 'licence-windows-pro', price_mga: 39000, compare_at_price_mga: 150000, duration_days: 365, availability: 'available', is_active: true },
  { name: 'Claude PRO | Compte partagé', slug: 'claude-pro-compte-partage', price_mga: 45000, compare_at_price_mga: 89000, duration_days: 30, availability: 'unavailable', is_active: true },
  { name: 'HOSTINGER BUSINESS 3 en 1', slug: 'hostinger-business-3-en-1', price_mga: 489000, compare_at_price_mga: 902400, duration_days: 365, availability: 'unavailable', is_active: true },
  { name: 'STOCKAGE GOOGLE Extension', slug: 'stockage-google-extension', price_mga: 125000, compare_at_price_mga: 200000, duration_days: 365, availability: 'unavailable', is_active: true },
  { name: 'NordVPN', slug: 'nordvpn', price_mga: 14500, compare_at_price_mga: 45000, duration_days: 30, availability: 'available', is_active: true },
  { name: 'Création de Site E-commerce en 24h', slug: 'service-site-ecommerce', price_mga: 349000, compare_at_price_mga: 1540000, duration_days: 365, availability: 'available', is_active: true }
];

function loadRealCatalog() {
  try {
    const files = fsSync.readdirSync(path.resolve('backups')).filter((f) => f.endsWith('-full-admin-backup.json')).sort().reverse();
    if (files.length > 0) {
      const raw = JSON.parse(fsSync.readFileSync(path.resolve('backups', files[0]), 'utf8'));
      const dbProds = raw.data?.products || [];
      const mapped = dbProds.map((p) => {
        const invs = p.digital_inventory || [];
        const hasAvailable = invs.some((i) => i.status === 'available' || i.status === 'low_availability' || i.status === 'on_demand');
        const allUnavailable = invs.length > 0 && invs.every((i) => i.status === 'unavailable');
        const availability = !p.is_active || allUnavailable ? 'unavailable' : (hasAvailable ? invs[0].status : 'available');
        const bench = BENCHMARK_CATALOG.find((b) => b.slug.toLowerCase() === p.slug.toLowerCase());
        return {
          name: p.name,
          slug: p.slug,
          price_mga: p.price_mga,
          compare_at_price_mga: p.compare_at_price_mga || bench?.compare_at_price_mga || null,
          duration_days: p.duration_days || bench?.duration_days || 30,
          availability,
          is_active: p.is_active,
        };
      });
      mapped.push(BENCHMARK_CATALOG.find((b) => b.slug === 'service-site-ecommerce'));
      return mapped;
    }
  } catch {
    // fallback
  }
  return BENCHMARK_CATALOG;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function findProductBySlug(slug) {
  const catalog = loadRealCatalog();
  return catalog.find((p) => p.slug.toLowerCase() === String(slug).toLowerCase()) || catalog[0];
}

async function resolvePageSession(cfg) {
  try {
    const page = await callGraphApi(cfg, `/${cfg.pageId}`, {
      params: { fields: 'id,name,fan_count,followers_count,link' },
    });
    return { pageCfg: { ...cfg, pageId: page.id }, pageInfo: page };
  } catch (err) {
    if (String(err.message).includes('fan_count')) {
      const accounts = await callGraphApi(cfg, '/me/accounts', {
        params: { fields: 'id,name,access_token,fan_count,followers_count,link,tasks' },
      });
      const pages = accounts.data || [];
      if (pages.length === 0) {
        throw new Error('Aucune Page Facebook trouvée dans /me/accounts pour ce token utilisateur.');
      }
      const target = pages.find((p) => p.name.toLowerCase().includes('grafikaly')) || pages[0];
      const { access_token, ...pageInfo } = target;
      return {
        pageCfg: { ...cfg, pageId: target.id, pageAccessToken: access_token || cfg.pageAccessToken },
        pageInfo,
        allPages: pages.map((p) => ({ id: p.id, name: p.name, followers_count: p.followers_count })),
      };
    }
    throw err;
  }
}

async function cmdVerify() {
  const cfg = validateFbEnvConfig();
  const { pageCfg, pageInfo, allPages } = await resolvePageSession(cfg);
  const dbg = await callGraphApi(cfg, '/debug_token', {
    params: { input_token: pageCfg.pageAccessToken },
  });
  console.log('✅ Connexion Meta Graph API réussie sur la Page :');
  console.log(JSON.stringify({
    ...pageInfo,
    token_type: dbg.data?.type,
    expires_at: dbg.data?.expires_at === 0 ? 'JAMAIS (Permanent ♾️)' : new Date((dbg.data?.expires_at || 0) * 1000).toISOString(),
  }, null, 2));
  if (allPages && allPages.length > 1) {
    console.log('\n📄 Pages accessibles via ce compte :', JSON.stringify(allPages, null, 2));
  }
}

async function cmdExchangePermanentToken() {
  const cfg = validateFbEnvConfig();
  const env = loadLocalEnv();
  const appId = env.FB_APP_ID?.trim() || '1585824866358288';
  const appSecret = env.FB_APP_SECRET?.trim();
  if (!appSecret) {
    throw new Error('Variable manquante : FB_APP_SECRET dans .env (nécessaire pour générer le token permanent)');
  }

  console.log(`🔄 Étape 1/3 : Échange du token court contre un User Token longue durée (App ID: ${appId})...`);
  const longUserRes = await callGraphApi(cfg, '/oauth/access_token', {
    params: {
      grant_type: 'fb_exchange_token',
      client_id: appId,
      client_secret: appSecret,
      fb_exchange_token: cfg.pageAccessToken,
    },
  });

  const longUserToken = longUserRes.access_token;
  console.log('🔄 Étape 2/3 : Extraction du Page Access Token PERMANENT pour la Page Grafikaly (939291282602301)...');
  const accounts = await callGraphApi({ ...cfg, pageAccessToken: longUserToken }, '/me/accounts', {
    params: { fields: 'id,name,access_token' },
  });
  const targetPage = (accounts.data || []).find((p) => p.id === '939291282602301' || p.name.toLowerCase().includes('grafikaly'));
  if (!targetPage || !targetPage.access_token) {
    throw new Error('Impossible de trouver la Page Grafikaly dans /me/accounts');
  }

  const permanentPageToken = targetPage.access_token;
  const dbg = await callGraphApi({ ...cfg, pageAccessToken: permanentPageToken }, '/debug_token', {
    params: { input_token: permanentPageToken },
  });

  console.log('🔄 Étape 3/3 : Sauvegarde du Page Token Permanent et du Page ID dans .env...');
  const envPath = path.resolve('.env');
  let envContent = fsSync.existsSync(envPath) ? fsSync.readFileSync(envPath, 'utf8') : '';
  envContent = envContent
    .replace(/^FB_PAGE_ID=.*$/m, '')
    .replace(/^FB_PAGE_ACCESS_TOKEN=.*$/m, '')
    .replace(/\n{2,}/g, '\n')
    .trimEnd();
  envContent += `\nFB_PAGE_ID=${targetPage.id}\nFB_PAGE_ACCESS_TOKEN=${permanentPageToken}\n`;
  fsSync.writeFileSync(envPath, envContent, 'utf8');

  console.log('✅ Token de Page PERMANENT généré et sauvegardé dans .env !');
  console.log(JSON.stringify({
    page_id: targetPage.id,
    page_name: targetPage.name,
    token_type: dbg.data?.type,
    expires_at: dbg.data?.expires_at === 0 ? '0 (N EXPIRE JAMAIS ♾️)' : dbg.data?.expires_at,
    is_valid: dbg.data?.is_valid,
  }, null, 2));
}

async function cmdSimulateComments() {
  const sampleFeed = [
    {
      postMessage: '🔥 Seulement 268 Ar / jour pour avoir Canva Pro Éducation pendant 1 an !',
      comment: { id: 'sim_1', message: 'Prix svp ?', created_time: new Date().toISOString(), from: { name: 'Rova Rakoto' } },
    },
    {
      postMessage: '🎬 Soirée cinéma : Netflix Smart TV 4K disponible immédiatement par Mvola',
      comment: { id: 'sim_2', message: 'Mp azafady, mbola misy ve ?', created_time: new Date().toISOString(), from: { name: 'Andry Randria' } },
    },
    {
      postMessage: '🤖 Claude Pro 30 jours sur Grafikaly',
      comment: { id: 'sim_3', message: 'Dispo ?', created_time: new Date().toISOString(), from: { name: 'Miora' } },
    },
    {
      postMessage: '🚀 Votre boutique e-commerce clé en main en 24h avec paiement Mvola',
      comment: { id: 'sim_4', message: 'Info création de site web svp', created_time: new Date().toISOString(), from: { name: 'Tojo Entreprise' } },
    },
  ];

  console.log('🧪 SIMULATION LOCALE (--dry-run) DU MOTEUR DE RÉPONSE FACEBOOK :\n');
  for (let i = 0; i < sampleFeed.length; i++) {
    const item = sampleFeed[i];
    const intent = classifyCommentIntent(item.comment.message);
    const slug = detectProductSlugFromText(item.comment.message) || detectProductSlugFromText(item.postMessage) || 'canva-pro-education';
    const product = findProductBySlug(slug);
    const plan = buildCommentActions({ comment: item.comment, product, dryRun: true, variantIndex: i });

    console.log(`--- Commentaire #${i + 1} (${item.comment.from.name}) : "${item.comment.message}" ---`);
    console.log(`• Intention détectée : ${intent}`);
    console.log(`• Produit associé    : ${product.name} (${product.availability})`);
    console.log(`• Action prévue      : ${plan.actionType}`);
    console.log(`• Réponse publique   : ${plan.publicReply}`);
    if (plan.privateReply) {
      console.log(`• DM Messenger       :\n  ${plan.privateReply.replace(/\n/g, '\n  ')}`);
    }
    console.log('');
  }
}

async function cmdPosts() {
  const rawCfg = validateFbEnvConfig();
  const { pageCfg: cfg, pageInfo } = await resolvePageSession(rawCfg);
  const postsRes = await callGraphApi(cfg, `/${pageInfo.id}/posts`, {
    params: { fields: 'id,message,created_time,comments.summary(true).limit(0)', limit: 15 },
  });
  console.log(`📌 15 dernières publications de la Page ${pageInfo.name} (${pageInfo.id}) :\n`);
  for (const p of postsRes.data || []) {
    const slug = detectProductSlugFromText(p.message || '') || '(non détecté -> fallback)';
    const snippet = (p.message || '[Sans texte / Photo seule]').replace(/\s+/g, ' ').slice(0, 90);
    const totalComments = p.comments?.summary?.total_count ?? 0;
    console.log(`• [${p.id}] (${p.created_time.slice(0, 10)}) | 💬 ${totalComments} cmt | 🎯 Produit: ${slug}`);
    console.log(`  "${snippet}..."\n`);
  }
}

async function cmdComments(args) {
  const confirm = args.includes('--confirm');
  const onlyRecent = args.includes('--recent-7d');
  const rawCfg = validateFbEnvConfig();
  const { pageCfg: cfg, pageInfo } = await resolvePageSession(rawCfg);
  const realPageId = pageInfo.id;

  const postsRes = await callGraphApi(cfg, `/${realPageId}/posts`, {
    params: { fields: 'id,message,created_time,comments.limit(50){id,message,created_time,from,comments{from}}', limit: 12 },
  });

  const actions = [];
  for (const post of postsRes.data || []) {
    const postSlug = detectProductSlugFromText(post.message || '') || 'canva-pro-education';
    for (const cmt of post.comments?.data || []) {
      if (cmt.from?.id === realPageId) continue;
      if (await hasProcessedId(cmt.id)) continue;
      const alreadyRepliedByPage = (cmt.comments?.data || []).some((sub) => sub.from?.id === realPageId);
      if (alreadyRepliedByPage) {
        await markAsProcessed(cmt.id, { skipped: 'already_replied_on_fb' });
        continue;
      }

      const ageDays = (Date.now() - new Date(cmt.created_time).getTime()) / (1000 * 60 * 60 * 24);
      if (onlyRecent && ageDays > 7) continue;

      const intent = classifyCommentIntent(cmt.message);
      if (intent === 'SUPPORT_ALERT') {
        console.log(`⚠️ [ALERTE SUPPORT HUMAIN] Commentaire ${cmt.id} (${cmt.from?.name || 'Client'}) : "${cmt.message}"`);
        continue;
      }
      if (intent !== 'PRICE_OR_INFO') continue;

      const cmtSlug = detectProductSlugFromText(cmt.message) || postSlug;
      const product = findProductBySlug(cmtSlug);
      if (product.availability === 'unavailable' || product.is_active === false) {
        console.log(`⏭️ [IGNORÉ - PRODUIT INDISPONIBLE SUR LE SITE] Commentaire ${cmt.id} (${product.name}) : "${cmt.message}"`);
        continue;
      }
      const plan = buildCommentActions({ comment: cmt, product, dryRun: !confirm });
      actions.push({ post, comment: cmt, product, plan, ageDays: Math.round(ageDays) });
    }
  }

  console.log(`📋 ${actions.length} commentaire(s) d'intention d'achat à traiter (Mode: ${confirm ? 'LIVE --confirm' : 'SIMULATION --dry-run'})`);
  for (const act of actions) {
    console.log(`\n[${act.comment.id}] (il y a ${act.ageDays}j) ${act.comment.from?.name || 'Client'} : "${act.comment.message}"`);
    console.log(`  -> Produit : ${act.product.name} (${act.plan.actionType})`);
    console.log(`  -> Public  : ${act.plan.publicReply}`);
    if (act.plan.privateReply) {
      console.log(`  -> DM      : ${act.plan.privateReply.split('\n')[0]} ...`);
    }

    if (confirm) {
      await callGraphApi(cfg, `/${act.comment.id}/comments`, {
        method: 'POST',
        body: { message: act.plan.publicReply },
      });
      if (act.plan.privateReply) {
        try {
          await callGraphApi(cfg, `/${act.comment.id}/private_replies`, {
            method: 'POST',
            body: { message: act.plan.privateReply },
          });
        } catch (err) {
          console.warn(`  ⚠️ Impossible d'envoyer le Private Reply sur ${act.comment.id}: ${err.message}`);
        }
      }
      await markAsProcessed(act.comment.id, { actionType: act.plan.actionType, productSlug: act.product.slug });
      console.log(`  ✅ Réponse envoyée pour ${act.comment.id} (Pause anti-spam 1.8s...)`);
      await sleep(1800);
    }
  }
}

async function cmdInbox() {
  const rawCfg = validateFbEnvConfig();
  const { pageCfg: cfg, pageInfo } = await resolvePageSession(rawCfg);
  const convRes = await callGraphApi(cfg, `/${pageInfo.id}/conversations`, {
    params: { fields: 'id,updated_time,unread_count,snippet,participants', limit: 15 },
  });

  const unread = (convRes.data || []).filter((c) => (c.unread_count || 0) > 0);
  console.log(`📬 ${unread.length} conversation(s) Messenger NON LUE(S) sur ${pageInfo.name} :\n`);
  for (const c of unread) {
    const sender = (c.participants?.data || []).find((p) => p.id !== pageInfo.id)?.name || 'Prospect';
    const intent = classifyCommentIntent(c.snippet || '');
    const slug = detectProductSlugFromText(c.snippet || '') || 'canva-pro-education';
    const prod = findProductBySlug(slug);
    console.log(`• [${c.id}] (${c.updated_time.slice(0, 10)}) 👤 ${sender} (${c.unread_count} non lu)`);
    console.log(`  💬 Message : "${c.snippet}"`);
    console.log(`  🎯 Intention : ${intent} | Produit détecté : ${prod.name} (${prod.price_mga} Ar)\n`);
  }
}

async function cmdMessages(args) {
  const confirm = args.includes('--confirm');
  const rawCfg = validateFbEnvConfig();
  const { pageCfg: cfg, pageInfo } = await resolvePageSession(rawCfg);
  const realPageId = pageInfo.id;

  const convRes = await callGraphApi(cfg, `/${realPageId}/conversations`, {
    params: {
      fields: 'id,updated_time,unread_count,snippet,participants,messages.limit(3){id,message,from,created_time}',
      limit: 15,
    },
  });

  const actions = [];
  for (const conv of convRes.data || []) {
    const lastMsg = conv.messages?.data?.[0];
    if (!lastMsg || !lastMsg.message) continue;
    // Si le dernier message vient déjà de la Page Grafikaly, on ne répond pas deux fois
    if (lastMsg.from?.id === realPageId) continue;
    if (await hasProcessedId(lastMsg.id)) continue;

    // Fenêtre standard Meta 24h pour les réponses Messenger automatiques
    const ageHours = (Date.now() - new Date(lastMsg.created_time).getTime()) / (1000 * 60 * 60);
    if (ageHours > 24) continue;

    const text = lastMsg.message;
    // Ignorer les références de commandes (ex: S09291) -> support humain
    if (/\bS\d{4,6}\b/i.test(text)) {
      console.log(`⚠️ [SUPPORT COMMANDE HUMAIN] Message ${lastMsg.id} (${lastMsg.from?.name}) : "${text}"`);
      continue;
    }

    const intent = classifyCommentIntent(text);
    if (intent === 'SUPPORT_ALERT') {
      console.log(`⚠️ [ALERTE SUPPORT HUMAIN] Message ${lastMsg.id} (${lastMsg.from?.name}) : "${text}"`);
      continue;
    }
    if (intent !== 'PRICE_OR_INFO') continue;

    const detectedSlug = detectProductSlugFromText(text);
    // En Messenger direct, on ne répond automatiquement que si un produit précis est identifié dans le message
    if (!detectedSlug) continue;

    const product = findProductBySlug(detectedSlug);
    if (!product || product.availability === 'unavailable' || product.is_active === false) {
      console.log(`⏭️ [IGNORÉ - PRODUIT INDISPONIBLE] Message ${lastMsg.id} (${product?.name || detectedSlug}) : "${text}"`);
      continue;
    }

    const plan = buildCommentActions({
      comment: { id: lastMsg.id, message: text, from: lastMsg.from },
      product,
      dryRun: !confirm,
    });
    actions.push({
      convId: conv.id,
      lastMsg,
      senderPsid: lastMsg.from?.id,
      senderName: lastMsg.from?.name || 'Client',
      product,
      replyText: plan.privateReply,
      ageHours: Math.round(ageHours * 10) / 10,
    });
  }

  console.log(`💬 ${actions.length} message(s) Messenger (<24h) à traiter automatiquement (Mode: ${confirm ? 'LIVE --confirm' : 'SIMULATION --dry-run'})`);
  for (const act of actions) {
    console.log(`\n[${act.lastMsg.id}] (il y a ${act.ageHours}h) 👤 ${act.senderName} : "${act.lastMsg.message}"`);
    console.log(`  -> Produit : ${act.product.name} (${act.product.price_mga} Ar)`);
    console.log(`  -> Réponse : ${act.replyText.split('\n')[0]} ...`);

    if (confirm && act.senderPsid && act.replyText) {
      await callGraphApi(cfg, `/${realPageId}/messages`, {
        method: 'POST',
        body: {
          recipient: { id: act.senderPsid },
          messaging_type: 'RESPONSE',
          message: { text: act.replyText },
        },
      });
      await markAsProcessed(act.lastMsg.id, { actionType: 'MESSENGER_AUTO_REPLY', productSlug: act.product.slug });
      console.log(`  ✅ Réponse Messenger envoyée à ${act.senderName} (Pause 1.5s...)`);
      await sleep(1500);
    }
  }
}

async function cmdAutoRespond(args) {
  console.log('==============================================================');
  console.log('🤖 SURVEILLANCE AUTOMATIQUE FACEBOOK & MESSENGER — GRAFIKALY');
  console.log('==============================================================\n');
  await cmdComments(args);
  console.log('\n--------------------------------------------------------------\n');
  await cmdMessages(args);
}

async function cmdGenerateCalendar() {
  const available = filterAvailableProducts(BENCHMARK_CATALOG);
  const angles = ['DAILY_COST', 'CURRENCY_SHOCK', 'STOCK_URGENCY'];
  const drafts = available.slice(0, 12).map((prod, idx) => {
    const angle = prod.availability === 'low_availability' ? 'STOCK_URGENCY' : angles[idx % 2];
    return generatePsychologicalPost(prod, angle);
  });

  const outPath = path.resolve('backups', 'fb-calendar-draft.json');
  await fs.mkdir(path.dirname(outPath), { recursive: true });
  await fs.writeFile(outPath, JSON.stringify({ generatedAt: new Date().toISOString(), posts: drafts }, null, 2), 'utf8');
  console.log(`✅ Calendrier de ${drafts.length} publications (Brouillons) généré dans : ${outPath}`);
}

async function uploadPagePhoto(cfg, pageId, { imagePath, caption, scheduledUnixTime = null }) {
  const fileBuf = await fs.readFile(path.resolve(imagePath));
  const ext = path.extname(imagePath).toLowerCase();
  const mimeType = ext === '.png' ? 'image/png' : 'image/jpeg';

  const form = new FormData();
  form.append('access_token', cfg.pageAccessToken);
  form.append('caption', caption);
  if (scheduledUnixTime) {
    form.append('published', 'false');
    form.append('scheduled_publish_time', String(scheduledUnixTime));
    form.append('temporary', 'false');
  } else {
    form.append('published', 'true');
  }
  form.append('source', new Blob([fileBuf], { type: mimeType }), path.basename(imagePath));

  const url = `https://graph.facebook.com/v22.0/${pageId}/photos`;
  const res = await fetch(url, { method: 'POST', body: form });
  const data = await res.json();
  if (!res.ok || data.error) {
    throw new Error(`Erreur upload photo Facebook (${res.status}): ${data.error?.message || JSON.stringify(data)}`);
  }
  return data;
}

async function cmdPublishWave(args) {
  const confirm = args.includes('--confirm');
  const rawCfg = validateFbEnvConfig();
  const { pageCfg: cfg, pageInfo } = await resolvePageSession(rawCfg);

  const wave = [
    {
      title: 'Post #1 — LOVABLE PRO (Publication immédiate)',
      slug: 'lovable-pro',
      imagePath: 'backups/visuals/nb-02-lovable-pro-official.png',
      scheduledIso: null,
      caption: `💻 Créer un site web complet ou une application en 10 minutes juste en écrivant en Français ? C'est le "Vibe-Coding" avec LOVABLE PRO.

Que vous soyez développeur, freelance, étudiant en informatique ou entrepreneur à Madagascar : vous n'avez plus besoin de coder chaque page à la main.

✅ Ce que Lovable Pro fait pour vous :
• Vous décrivez votre idée en Français ➡️ L'IA génère le design moderne, la base de données et le code complet
• Connexion directe à Supabase, GitHub et déploiement en 1 clic
• Idéal pour livrer des sites et applications clients 10x plus vite

⚠️ Attention : Stock très limité sur cette offre annuelle (12 mois).

👇 Commentez "LOVABLE" ou "INFO" ci-dessous et je vous envoie immédiatement la fiche complète + le tarif spécial Madagascar en message privé (MP) !`,
    },
    {
      title: 'Post #2 — GOOGLE AI PRO (Programmé Mercredi 07/10 à 11h30 Mada)',
      slug: 'google-ai-pro',
      imagePath: 'backups/visuals/nb-01-google-ai-pro.jpg',
      scheduledIso: '2026-10-07T11:30:00+03:00',
      caption: `🧠 Et si votre compte Google devenait 10x plus intelligent (avec 2 000 Go d'espace sécurisé en prime) ?

Vous utilisez déjà Gmail, Google Docs, Sheets et Google Drive tous les jours.
Mais avez-vous déjà testé GOOGLE AI PRO (Gemini Advanced + 2 To) directement intégré dans vos outils ?

✅ Ce que ça change concrètement dans votre travail :
• Gemini Pro / Advanced : rédigez vos emails, rapports, codes et analyses complexes en quelques secondes
• Intégré partout : l'IA travaille directement dans votre Gmail, votre Word (Docs) et vos tableaux Excel (Sheets)
• 2 000 Go (2 To) de stockage Cloud : sauvegardez tous vos dossiers pro, photos et vidéos 4K sans jamais voir "Stockage plein"
• 100% privé : activé sur votre propre adresse Gmail personnelle pendant 12 mois

🇲🇬 Pas besoin de carte Visa internationale : l'activation se fait localement et instantanément via Mvola ou Orange Money.

👇 Commentez "INFO" ou "GEMINI" ci-dessous et je vous envoie tous les détails + le lien d'accès direct en message privé (MP) !`,
    },
    {
      title: 'Post #3 — CANVA PRO + MAGIC STUDIO IA (Programmé Jeudi 08/10 à 11h30 Mada)',
      slug: 'canva-pro-education',
      imagePath: 'backups/visuals/nb-03-canva-pro-ia.jpg',
      scheduledIso: '2026-10-08T11:30:00+03:00',
      caption: `🎨 Arrêtez de passer 2 heures sur un visuel que l'IA de Canva Pro fait en 30 secondes.

Si vous gérez une page Facebook, une boutique en ligne ou des présentations clients à Madagascar, la version gratuite de Canva vous bloque sur le meilleur : Magic Studio IA.

✅ Tout ce que vous débloquez sur votre propre compte :
• Détourage Photo & Vidéo en 1 clic (sans fond vert)
• Gomme Magique & Agrandissement IA pour retoucher vos photos produits
• Redimensionnement instantané (Post Facebook ➡️ Story ➡️ Reel en 1 clic)
• +100 millions d'éléments, polices, vidéos et templates Premium débloqués
• 100% privé : activé sur votre adresse email personnelle (personne d'autre ne voit vos créations)

👇 Commentez "CANVA" ou "INFO" ci-dessous pour recevoir les détails de l'offre en message privé (MP) !`,
    },
  ];

  console.log(`🚀 LANCEMENT DE LA VAGUE DE PUBLICATIONS IA SUR ${pageInfo.name} (Mode: ${confirm ? 'LIVE --confirm' : 'SIMULATION --dry-run'})\n`);

  for (const item of wave) {
    const product = findProductBySlug(item.slug);
    if (!product || product.availability === 'unavailable' || product.is_active === false) {
      console.log(`⏭️ [IGNORÉ - INDISPONIBLE] ${item.title}`);
      continue;
    }

    const scheduledUnixTime = item.scheduledIso ? Math.floor(new Date(item.scheduledIso).getTime() / 1000) : null;
    console.log(`📌 ${item.title}`);
    console.log(`   • Produit : ${product.name} (${product.availability})`);
    console.log(`   • Visuel  : ${item.imagePath}`);
    console.log(`   • Statut  : ${scheduledUnixTime ? `Programmé pour ${item.scheduledIso} (Unix: ${scheduledUnixTime})` : 'Publication immédiate (LIVE)'}`);

    if (confirm) {
      const result = await uploadPagePhoto(cfg, pageInfo.id, {
        imagePath: item.imagePath,
        caption: item.caption,
        scheduledUnixTime,
      });
      console.log(`   ✅ Succès ! Photo ID: ${result.id} | Post ID: ${result.post_id || result.id}\n`);
      await sleep(2000);
    } else {
      console.log(`   🧪 [DRY-RUN] Prêt à envoyer.\n`);
    }
  }
}

async function main() {
  const [cmd, ...args] = process.argv.slice(2);
  switch (cmd) {
    case 'verify':
      await cmdVerify();
      break;
    case 'exchange-permanent-token':
      await cmdExchangePermanentToken();
      break;
    case 'posts':
      await cmdPosts();
      break;
    case 'inbox':
      await cmdInbox();
      break;
    case 'messages':
      await cmdMessages(args);
      break;
    case 'auto-respond':
      await cmdAutoRespond(args);
      break;
    case 'simulate-comments':
      await cmdSimulateComments();
      break;
    case 'comments':
      await cmdComments(args);
      break;
    case 'generate-calendar':
      await cmdGenerateCalendar();
      break;
    case 'publish-wave':
      await cmdPublishWave(args);
      break;
    default:
      console.log(`Usage: node src/facebook.mjs <commande>
Commandes disponibles :
  verify                    Vérifie la connexion Meta Graph API (.env : FB_PAGE_ID, FB_PAGE_ACCESS_TOKEN)
  posts                     Liste les 15 dernières publications de la Page Grafikaly et leur produit détecté
  inbox                     Liste les conversations Messenger non lues et qualifie l'intention produit
  messages [--confirm]      Répond automatiquement aux messages Messenger (<24h) sur les produits en stock
  auto-respond [--confirm]  Exécute comments + messages en une seule passe (idéal pour GitHub Actions)
  simulate-comments         Teste le répondeur Commentaires + DM en local (aucun appel réseau)
  comments [--confirm]      Scanne les commentaires Facebook (--dry-run par défaut, --confirm pour envoyer)
  generate-calendar         Génère 12 brouillons de posts Facebook basés sur les stocks et la psychologie Mada
  publish-wave [--confirm]  Publie/programme la vague de posts IA avec leurs visuels Nano Banana`);
  }
}

main().catch((err) => {
  console.error(`❌ Erreur : ${err.message}`);
  process.exit(1);
});
