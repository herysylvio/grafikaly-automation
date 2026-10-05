import { loadDotEnv, validateEnvConfig } from './config.mjs';
import { validateProductUpdate } from './catalog-validator.mjs';

export const SUPABASE_URL = 'https://nzlfdrtujpwqpbrdsyqj.supabase.co';
export const SUPABASE_ANON_KEY = 'sb_publishable_4jJc7v0l6qSVXciVZ4tS7Q_olVoiDFa';

/**
 * Registre strictement limité aux Server Functions autorisées (Catalogue, Promos & Marketing).
 * Aucun endpoint de paiement, comptes maîtres ou gestion utilisateurs n'est inclus.
 */
export const SERVER_FNS = Object.freeze({
  catalog: {
    listProducts: { id: 'a32abab4650c5a3b5fef5d2e251b48ad14347a9b834661483829db6b8f34e74a', method: 'GET' },
    upsertProduct: { id: '8c3278b7370c2cbb8013ad58be8dfeedfad3c47249ca4ff1bd56081d34b05c92', method: 'POST' },
    listCategories: { id: '39a242dd7971318612879f4a40705a80ba1ba10c1dd3d7b24ac2c2cf1d07b777', method: 'GET' },
    upsertCategory: { id: 'bb66ccc97856362c450eda99633a3df8328252ebbd822d25ca7f683035de20a4', method: 'POST' },
    listOffers: { id: '70a682ff02f730ddfb74fe386beb5d806bc49a2a52bee1ef841e1c6e1ac8a040', method: 'GET' },
    upsertOffer: { id: '35bf1edfe43d09f61ab039f2b20a007495fb4a8936806c880b6537cb10da512e', method: 'POST' },
  },
  promos: {
    listPromoCodes: { id: 'e2b5b0df6a1b9b429951a3ffd134aa16a97d4bd832c75a3002b575ca3879d479', method: 'GET' },
    upsertPromoCode: { id: 'd45e9fc6bcb2e19ce255afee7b68e8c67ddd8f342874e8a208bf3116f2674fb8', method: 'POST' },
    togglePromoCode: { id: 'e1de7a74864eb89a08a1dc271dad4f4cc732bc7783ba000c48a907bba8e87a16', method: 'POST' },
    listFlashSales: { id: '98dfab4e94e0673291bf04ebb916ebf0a0088a3492b8a3b7cb873d7387f7b19b', method: 'GET' },
    upsertFlashSale: { id: 'a426c732e52a8d5699e81afdacd45bbb08d8f214602e0e88969a45a2e4b33897', method: 'POST' },
    toggleFlashSale: { id: '80f45efab45ae7c2ea58689a7aff75e0b7f11c64835e784ed711e6c5d3c3227e', method: 'POST' },
  },
  marketing: {
    getOverview: { id: 'ff66ace975153ee2b38be53b02d1e5bfada4261a1b13426c60bf8a5fd4d7c392', method: 'GET' },
    previewSegment: { id: 'e2f72cf992c787af946071eb5bae70daaf23d3d4ef4921952af8acaa814cd9f5', method: 'POST' },
    listCampaigns: { id: '7b7b1ea6651cbe9e569ec60b0597204f895b1f2940e67baf316b5ce5fd49244d', method: 'GET' },
    saveCampaignDraft: { id: '9fed46a8255c1c849b5465d853e35f60b902d9485da9314b1a156a85e375a27b', method: 'POST' },
    sendTestEmail: { id: 'de126a0f872444032e0478bf9f1be697982890b1072d3abecb6574d0723fddd4', method: 'POST' },
    getAutomationSettings: { id: '7554848c35d1cb946031d9c924b5d2d5a2fc3ad3e7262c2de05e1f9b2d310733', method: 'GET' },
    updateAutomationSettings: { id: '4d204a0c40be0bd0c6c49b91f545b1fc4ba222b83b6ba9ce36ef67c6a2470924', method: 'POST' },
    runAutomation: { id: '6cfabe2accb7195fb83581352f07e43209b18417380b6d8bda851375342a535b', method: 'POST' },
  },
});

export function buildServerFnRequest(baseUrl, fnDef, data, accessToken) {
  let url = `${baseUrl.replace(/\/$/, '')}/_serverFn/${fnDef.id}`;
  const headers = {
    'x-tsr-serverFn': 'true',
    Accept: 'application/json',
  };
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  if (fnDef.method === 'GET') {
    if (data !== undefined) {
      const payload = JSON.stringify({ data });
      const qs = new URLSearchParams({ payload }).toString();
      url += `?${qs}`;
    }
    return { url, method: 'GET', headers };
  }

  headers['Content-Type'] = 'application/json';
  const body = JSON.stringify(data !== undefined ? { data } : {});
  return { url, method: 'POST', headers, body };
}

/**
 * Convertit un enregistrement produit BDD (`snake_case`) fusionné avec un patch
 * vers le format exact attendu par la mutation `upsertProduct` (`camelCase`) sans perdre aucun champ.
 */
export function mapDbProductToMutationPayload(dbProduct, patch = {}) {
  const merged = validateProductUpdate(dbProduct, patch);
  const invList = Array.isArray(merged.digital_inventory)
    ? merged.digital_inventory
    : merged.digital_inventory
    ? [merged.digital_inventory]
    : [];
  const mainInv = invList.find((i) => !('variant_id' in i) || i.variant_id === null) ?? invList[0] ?? {};
  const categoryIds = Array.isArray(merged.category_ids) && merged.category_ids.length > 0
    ? merged.category_ids
    : merged.category_id
    ? [merged.category_id]
    : [];

  return {
    id: merged.id,
    name: merged.name,
    slug: merged.slug,
    categoryId: merged.category_id || null,
    categoryIds,
    shortDescription: merged.short_description ?? '',
    fullDescription: merged.full_description ?? '',
    imageUrl: merged.image_url ?? '',
    priceMga: Number(merged.price_mga) || 0,
    ...(merged.compare_at_price_mga ? { compareAtPriceMga: Number(merged.compare_at_price_mga) } : {}),
    productType: merged.product_type ?? 'shared_credentials',
    activationType: merged.activation_type ?? 'instant_credentials',
    durationLabel: merged.duration_label ?? '',
    ...(merged.duration_days ? { durationDays: Number(merged.duration_days) } : {}),
    deliveryEta: merged.delivery_eta ?? '',
    postPurchaseInstructions: merged.post_purchase_instructions ?? '',
    additionalInfo: merged.additional_info ?? '',
    promoBadge: merged.promo_badge ?? '',
    isFeatured: Boolean(merged.is_featured),
    isActive: Boolean(merged.is_active),
    singleUnitOnly: Boolean(merged.single_unit_only),
    promoCodeEnabled: Boolean(merged.promo_code_enabled),
    promoCodes: Array.isArray(merged.promo_codes) ? merged.promo_codes : [],
    displayOrder: Number(merged.display_order) || 0,
    metaTitle: merged.meta_title ?? '',
    metaDescription: merged.meta_description ?? '',
    faq: (Array.isArray(merged.product_faqs) ? merged.product_faqs : []).map((f, idx) => ({
      ...(f.id ? { id: f.id } : {}),
      question: f.question,
      answer: f.answer,
      displayOrder: f.display_order ?? idx,
    })),
    inventory: {
      mode: mainInv.mode ?? 'slots',
      ...(mainInv.total_units !== null && mainInv.total_units !== undefined
        ? { totalUnits: Number(mainInv.total_units) }
        : {}),
      usedUnits: Number(mainInv.used_units) || 0,
      ...(mainInv.daily_quota !== null && mainInv.daily_quota !== undefined
        ? { dailyQuota: Number(mainInv.daily_quota) }
        : {}),
      lowThreshold: Number(mainInv.low_threshold) || 0,
      status: mainInv.status ?? 'available',
      notes: mainInv.notes ?? '',
    },
  };
}

export class GrafikalyAdminClient {
  constructor(options = {}) {
    loadDotEnv();
    this.config = validateEnvConfig(options.env || process.env);
    this.accessToken = null;
    this.user = null;
    this.roles = [];
  }

  async login() {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: this.config.email,
        password: this.config.password,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Échec d'authentification Supabase (${res.status}): ${errText}`);
    }

    const session = await res.json();
    this.accessToken = session.access_token;
    this.user = session.user;

    // Récupérer les rôles de l'utilisateur
    const rolesRes = await fetch(
      `${SUPABASE_URL}/rest/v1/user_roles?select=role&user_id=eq.${this.user.id}`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${this.accessToken}`,
        },
      }
    );
    if (rolesRes.ok) {
      const rows = await rolesRes.json();
      this.roles = rows.map((r) => r.role);
    }

    return {
      userId: this.user.id,
      email: this.user.email,
      roles: this.roles,
    };
  }

  async callServerFn(fnDef, data) {
    if (!this.accessToken) {
      await this.login();
    }
    const req = buildServerFnRequest(this.config.baseUrl, fnDef, data, this.accessToken);
    const res = await fetch(req.url, {
      method: req.method,
      headers: req.headers,
      body: req.body,
    });

    const text = await res.text();
    if (!res.ok) {
      throw new Error(`Erreur ServerFn ${fnDef.id.slice(0, 8)} (${res.status}): ${text}`);
    }
    try {
      const parsed = JSON.parse(text);
      return parsed?.result !== undefined ? parsed.result : parsed;
    } catch {
      return text;
    }
  }

  async restSelect(table, query = 'select=*') {
    if (!this.accessToken) {
      await this.login();
    }
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${query}`, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${this.accessToken}`,
      },
    });
    if (!res.ok) {
      throw new Error(`Erreur lecture table ${table} (${res.status}): ${await res.text()}`);
    }
    return res.json();
  }
}
