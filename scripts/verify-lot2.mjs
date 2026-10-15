import { GrafikalyAdminClient, SERVER_FNS } from '../src/lib/client.mjs';

async function main() {
  const client = new GrafikalyAdminClient();
  await client.login();
  const [catRes, prodRes] = await Promise.all([
    client.callServerFn(SERVER_FNS.catalog.listCategories),
    client.callServerFn(SERVER_FNS.catalog.listProducts, {}),
  ]);
  const categories = catRes?.categories ?? catRes ?? [];
  const products = prodRes?.products ?? prodRes ?? [];

  console.log('=== CATÉGORIES EN PRODUCTION ===');
  categories
    .sort((a, b) => a.display_order - b.display_order)
    .forEach((c) => {
      console.log(`[Ordre ${c.display_order}] ${c.name} (${c.slug}) - ID: ${c.id}`);
    });

  console.log('\n=== VÉRIFICATION DES ORPHELINS ===');
  const orphans = products.filter(
    (p) => !p.category_id && (!p.product_categories || p.product_categories.length === 0)
  );
  console.log(`Produits sans catégorie : ${orphans.length}`);
  if (orphans.length > 0) {
    orphans.forEach((o) => console.log(` - ${o.name} (${o.slug})`));
  } else {
    console.log('🎉 100% des produits du catalogue ont une catégorie valide !');
  }

  console.log('\n=== RÉPARTITION DES PRODUITS PAR CATÉGORIE ===');
  for (const c of categories.sort((a, b) => a.display_order - b.display_order)) {
    const prods = products.filter(
      (p) =>
        p.category_id === c.id ||
        (p.product_categories && p.product_categories.some((rel) => rel.category_id === c.id))
    );
    console.log(`\n📁 [Ordre ${c.display_order}] ${c.name} : ${prods.length} produit(s)`);
    prods.forEach((p) => console.log(`   - [${p.is_active ? 'ACTIF' : 'INACTIF'}] ${p.name}`));
  }
}

main().catch(console.error);
