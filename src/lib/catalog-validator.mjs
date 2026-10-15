export function validateProductUpdate(currentProduct, patch) {
  const merged = { ...currentProduct, ...patch };
  const price = Number(merged.price_mga);
  const compareAt =
    merged.compare_at_price_mga !== null && merged.compare_at_price_mga !== undefined
      ? Number(merged.compare_at_price_mga)
      : null;

  if (!Number.isFinite(price) || price <= 0) {
    throw new Error(`Prix invalide pour ${merged.name}: ${merged.price_mga}`);
  }
  if (compareAt !== null && compareAt <= price) {
    throw new Error(
      `compare_at_price_mga doit être strictement supérieur à price_mga (${compareAt} <= ${price})`
    );
  }
  return merged;
}

export function computeProductDiff(currentProduct, patch) {
  const validated = validateProductUpdate(currentProduct, patch);
  const changes = {};
  for (const key of Object.keys(patch)) {
    if (currentProduct[key] !== validated[key]) {
      changes[key] = { from: currentProduct[key], to: validated[key] };
    }
  }
  return { id: currentProduct.id, name: currentProduct.name, changes, merged: validated };
}

export function validateCategoryUpdate(currentCategory = {}, patch = {}) {
  const merged = { ...currentCategory, ...patch };
  if (!merged.name || !String(merged.name).trim()) {
    throw new Error('Le nom de la catégorie est obligatoire.');
  }
  if (!merged.slug || !String(merged.slug).trim()) {
    throw new Error('Le slug de la catégorie est obligatoire.');
  }
  return merged;
}

export function computeCategoryDiff(currentCategory, patch) {
  const validated = validateCategoryUpdate(currentCategory, patch);
  const changes = {};
  for (const key of Object.keys(patch)) {
    if (currentCategory[key] !== validated[key]) {
      changes[key] = { from: currentCategory[key] ?? null, to: validated[key] };
    }
  }
  return { id: currentCategory.id, name: currentCategory.name, changes, merged: validated };
}

export function mapCategoryToMutationPayload(category = {}, patch = {}) {
  const merged = validateCategoryUpdate(category, patch);
  return {
    ...(merged.id ? { id: merged.id } : {}),
    name: String(merged.name).trim(),
    slug: String(merged.slug).trim(),
    description: merged.description ?? null,
    icon: merged.icon ?? null,
    imageUrl: merged.imageUrl ?? merged.image_url ?? null,
    displayOrder: Number(merged.displayOrder ?? merged.display_order ?? 0),
    metaTitle: merged.metaTitle ?? merged.meta_title ?? null,
    metaDescription: merged.metaDescription ?? merged.meta_description ?? null,
    isActive: Boolean(merged.isActive ?? merged.is_active ?? true),
  };
}
