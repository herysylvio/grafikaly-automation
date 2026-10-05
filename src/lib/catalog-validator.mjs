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
