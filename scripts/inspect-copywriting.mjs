import { GrafikalyAdminClient, SERVER_FNS } from '../src/lib/client.mjs';

async function main() {
  const client = new GrafikalyAdminClient();
  await client.login();
  const prodRes = await client.callServerFn(SERVER_FNS.catalog.listProducts, {});
  const products = prodRes?.products ?? prodRes ?? [];

  console.log('=== ANALYSE DU COPYWRITING ACTUEL ===');
  const needsCopy = products.filter((p) => !p.short_description || !p.full_description);
  console.log(`Produits nécessitant du copywriting : ${needsCopy.length} / ${products.length}`);
  
  for (const p of products) {
    const hasShort = Boolean(p.short_description && p.short_description.trim());
    const hasFull = Boolean(p.full_description && p.full_description.trim());
    console.log(
      `- [${p.is_active ? 'ACTIF' : 'INACTIF'}] ${p.name} (${p.slug})\n  Short: ${
        hasShort ? p.short_description.slice(0, 70) + '...' : '❌ VIDE'
      }\n  Full: ${hasFull ? p.full_description.slice(0, 70) + '...' : '❌ VIDE'}`
    );
  }
}

main().catch(console.error);
