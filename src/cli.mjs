import fs from 'node:fs/promises';
import path from 'node:path';
import {
  GrafikalyAdminClient,
  SERVER_FNS,
  mapDbProductToMutationPayload,
} from './lib/client.mjs';
import { saveSnapshot } from './lib/backup.mjs';
import { computeProductDiff } from './lib/catalog-validator.mjs';
import { prepareSafeCampaignPayload } from './lib/marketing-validator.mjs';

async function main() {
  const [command, ...args] = process.argv.slice(2);

  if (!command || command === 'help' || command === '--help') {
    console.log(`
Usage : node src/cli.mjs <commande> [options]

Commandes disponibles :
  verify-auth                           Vérifie la connexion Admin (.env) et les rôles
  backup-all                            Sauvegarde un snapshot complet (Catalogue & Marketing) dans backups/
  catalog-diff <fichier.json>           Affiche un comparatif Avant / Après sans modifier la base
  catalog-apply <fichier.json> --confirm Applique les modifications catalogue après sauvegarde automatique
  marketing-status                      Affiche l'état des segments, campagnes et automatisations
  marketing-draft <fichier.json>        Enregistre une campagne email en statut Brouillon (draft)
`);
    return;
  }

  const client = new GrafikalyAdminClient();

  if (command === 'verify-auth') {
    const info = await client.login();
    console.log('✅ Connexion réussie sur Grafikaly !');
    console.log(`   Utilisateur : ${info.email} (${info.userId})`);
    console.log(`   Rôles actifs : ${info.roles.join(', ') || 'aucun rôle trouvé'}`);
    return;
  }

  if (command === 'backup-all') {
    await client.login();
    console.log('📦 Téléchargement du catalogue, des offres, codes promo et campagnes...');
    const [productsRes, categoriesRes, offersRes, promosRes, campaignsRes] = await Promise.all([
      client.callServerFn(SERVER_FNS.catalog.listProducts, {}),
      client.callServerFn(SERVER_FNS.catalog.listCategories),
      client.callServerFn(SERVER_FNS.catalog.listOffers),
      client.callServerFn(SERVER_FNS.promos.listPromoCodes, { filter: 'all', search: '' }),
      client.callServerFn(SERVER_FNS.marketing.listCampaigns),
    ]);

    const snapshot = {
      products: productsRes?.products ?? productsRes,
      categories: categoriesRes?.categories ?? categoriesRes,
      offers: offersRes?.offers ?? offersRes,
      promoCodes: promosRes?.codes ?? promosRes,
      campaigns: campaignsRes?.campaigns ?? campaignsRes,
    };

    const filePath = await saveSnapshot('full-admin-backup', snapshot);
    console.log(`✅ Sauvegarde complète enregistrée dans : ${filePath}`);
    return;
  }

  if (command === 'catalog-diff' || command === 'catalog-apply') {
    const fileArg = args.find((a) => !a.startsWith('--'));
    const confirmed = args.includes('--confirm');
    if (!fileArg) {
      throw new Error('Veuillez fournir le chemin du fichier JSON des modifications.');
    }

    const patches = JSON.parse(await fs.readFile(path.resolve(fileArg), 'utf8'));
    await client.login();
    const productsRes = await client.callServerFn(SERVER_FNS.catalog.listProducts, {});
    const products = productsRes?.products ?? [];

    const diffs = [];
    for (const patchItem of patches) {
      const current = products.find(
        (p) => p.id === patchItem.id || p.slug === patchItem.slug
      );
      if (!current) {
        throw new Error(`Produit introuvable pour : ${JSON.stringify(patchItem)}`);
      }
      const diff = computeProductDiff(current, patchItem.changes);
      diffs.push({ current, patch: patchItem.changes, diff });
    }

    console.log(`\n📋 Aperçu Avant / Après (${diffs.length} produit(s)) :\n`);
    for (const { diff } of diffs) {
      console.log(`🔹 ${diff.name} (${diff.id})`);
      for (const [field, change] of Object.entries(diff.changes)) {
        console.log(`   - ${field}: ${JSON.stringify(change.from)}  -->  ${JSON.stringify(change.to)}`);
      }
    }

    if (command === 'catalog-diff') {
      console.log('\nℹ️ Mode simulation (catalog-diff) : aucune donnée n’a été modifiée.');
      return;
    }

    if (!confirmed) {
      throw new Error('Ajout de --confirm requis après le "GO" de l’utilisateur pour appliquer.');
    }

    const bkpPath = await saveSnapshot(
      'pre-catalog-apply',
      diffs.map((d) => d.current)
    );
    console.log(`\n🛡️ Backup de sécurité créé avant écriture : ${bkpPath}`);

    for (const { current, patch } of diffs) {
      const mutationPayload = mapDbProductToMutationPayload(current, patch);
      await client.callServerFn(SERVER_FNS.catalog.upsertProduct, mutationPayload);
      console.log(`✅ Produit mis à jour : ${current.name}`);
    }
    return;
  }

  if (command === 'marketing-status') {
    await client.login();
    const [overview, campaigns, automations] = await Promise.all([
      client.callServerFn(SERVER_FNS.marketing.getOverview),
      client.callServerFn(SERVER_FNS.marketing.listCampaigns),
      client.callServerFn(SERVER_FNS.marketing.getAutomationSettings),
    ]);
    console.log(JSON.stringify({ overview, campaigns, automations }, null, 2));
    return;
  }

  if (command === 'marketing-draft') {
    const fileArg = args[0];
    if (!fileArg) {
      throw new Error('Veuillez fournir le fichier JSON du brouillon de campagne.');
    }
    const rawDraft = JSON.parse(await fs.readFile(path.resolve(fileArg), 'utf8'));
    const safeDraft = prepareSafeCampaignPayload({
      ...rawDraft,
      htmlContent: rawDraft.bodyHtml || rawDraft.body || rawDraft.htmlContent,
    });

    await client.login();
    const res = await client.callServerFn(SERVER_FNS.marketing.saveCampaignDraft, {
      ...(safeDraft.id ? { id: safeDraft.id } : {}),
      name: safeDraft.name,
      subject: safeDraft.subject,
      body: safeDraft.body ?? '',
      bodyMode: safeDraft.bodyMode ?? 'auto',
      bodyHtml: safeDraft.bodyHtml ?? '',
      segmentKey: safeDraft.segmentKey ?? 'all_consented',
      segmentParams: safeDraft.segmentParams ?? {},
      promoCode: safeDraft.promoCode ?? '',
      scheduledAt: null, // Toujours null pour rester en Brouillon (draft)
    });
    console.log(`✅ Brouillon de campagne enregistré avec succès (statut: draft) :`, res);
    return;
  }

  throw new Error(`Commande inconnue : ${command}`);
}

main().catch((err) => {
  console.error(`❌ Erreur : ${err.message}`);
  process.exit(1);
});
