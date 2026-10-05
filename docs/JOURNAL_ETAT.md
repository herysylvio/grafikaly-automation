# Journal d'État & Synchronisation Inter-Discussions — GRAFIKALY

> **Instruction pour l'IA** : Ce fichier est le tableau de bord central partagé entre toutes les conversations du projet `GRAFIKALY`. Lis-le au début de chaque nouvelle discussion et mets-le à jour dès qu'une étape clé ou une décision stratégique est validée.

---

## 1. État Actuel du Projet (Mis à jour le 2026-10-05)

| Pôle / Chantier | Statut | Document de référence | Prochaine action prioritaire |
| :--- | :--- | :--- | :--- |
| **1. Audit Global (Site, Catalogue, Admin, CRM)** | ✅ Terminé | [01-audit-complet-et-plan-30j.md](file:///c:/Users/sylvi/DEV/GRAFIKALY/docs/contexte/01-audit-complet-et-plan-30j.md) | Exploiter les conclusions dans les discussions dédiées |
| **2. Benchmark Prix Officiels & Psychologie Locale (28 offres)** | ✅ Terminé | [02-benchmark-prix-et-psychologie-madagascar.md](file:///c:/Users/sylvi/DEV/GRAFIKALY/docs/contexte/02-benchmark-prix-et-psychologie-madagascar.md) | Appliquer les prix d'ancrage (`compare_at_price_mga`) et le copywriting en Ariary/jour |
| **3. Architecture & Plan du Copilote Admin (CLI)** | ✅ Validé | [2026-10-02-copilote-admin-design.md](file:///c:/Users/sylvi/DEV/GRAFIKALY/docs/plans/2026-10-02-copilote-admin-design.md) & [2026-10-02-copilote-admin-plan.md](file:///c:/Users/sylvi/DEV/GRAFIKALY/docs/plans/2026-10-02-copilote-admin-plan.md) | Configurer `.env` + Coder les 5 micro-tâches TDD + Faire le `backup-all` initial |
| **4. Optimisation Catalogue, Prix d'ancrage & Combos** | ⏳ Prêt à démarrer | [02-benchmark-prix-et-psychologie-madagascar.md](file:///c:/Users/sylvi/DEV/GRAFIKALY/docs/contexte/02-benchmark-prix-et-psychologie-madagascar.md) | Mettre à jour les prix barrés, créer la catégorie IA, activer `promo_code_enabled` sur les produits phares |
| **5. Stratégie Emailing & Automatisations (J-7, J-3, J+1)** | ⏳ Prêt à démarrer | [01-audit-complet-et-plan-30j.md](file:///c:/Users/sylvi/DEV/GRAFIKALY/docs/contexte/01-audit-complet-et-plan-30j.md) | Auditer les segments réels, préparer les brouillons d'emails et simuler (`dryRun: true`) les relances d'expiration |

---

## 2. Organisation Recommandée des Discussions (Multi-Conversations)

Tu peux ouvrir autant de nouvelles discussions que nécessaire dans ce projet (`c:\Users\sylvi\DEV\GRAFIKALY`). Voici comment les découper proprement si tu le souhaites :

- **Discussion #1 (Fondatrice — `347c4a3c-3729-41b8-9897-bf2eaa1ae215`)** : Audit initial, Benchmark des prix officiels, Conception de l'architecture Copilote Admin et mise en place de la mémoire partagée.
- **Discussion Technique / Connexion Admin** : Développement et exécution des scripts CLI (`src/`), connexion `.env` et sauvegardes (`backups/`).
- **Discussion Catalogue, Pricing & Copywriting** : Travail produit par produit sur les prix d'ancrage barrés, les descriptions psychologiques (coût par jour en Ariary, aversion à la perte), les packs et les Order Bumps (`/admin/combos`).
- **Discussion Marketing, Emailing & Rétention** : Rédaction des campagnes (en brouillon), configuration des automatisations de renouvellement d'abonnements, codes promo et ventes flash.

---

## 3. Historique des Décisions Validées

- **2026-10-01** ([Discussion #1](conversation://347c4a3c-3729-41b8-9897-bf2eaa1ae215)) :
  - Audit complet de `grafikaly.mg` (28 produits, 2 packs, 1 service web 24h à `300 000 Ar`, stack TanStack Start + Supabase).
  - Benchmark complet des prix par rapport aux tarifs officiels USD/EUR convertis en Ariary (`1 USD = 4 426 Ar`, `1 EUR = 4 965 Ar` + frais bancaires locaux) : économie moyenne de **-70 % à -93 %** pour le client malgache.
- **2026-10-02** ([Discussion #1](conversation://347c4a3c-3729-41b8-9897-bf2eaa1ae215)) :
  - Validation du **Mode Copilote Sécurisé** (Approche C Hybride : CLI locale + mode `draft` et `dryRun: true` natifs).
  - Périmètre confié : **Catalogue, Prix & Copywriting** + **Marketing & Emailing**.
- **2026-10-05** ([Discussion #1](conversation://347c4a3c-3729-41b8-9897-bf2eaa1ae215)) :
  - Mise en place de l'architecture multi-conversations interconnectée via `AGENTS.md`, `docs/JOURNAL_ETAT.md` et `docs/contexte/`.
