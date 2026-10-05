# Journal d'État & Synchronisation Inter-Discussions — GRAFIKALY

> **Instruction pour l'IA** : Ce fichier est le tableau de bord central partagé entre toutes les conversations du projet `GRAFIKALY`. Lis-le au début de chaque nouvelle discussion et mets-le à jour dès qu'une étape clé ou une décision stratégique est validée.

---

## 1. État Actuel du Projet (Mis à jour le 2026-10-05)

| Pôle / Chantier | Statut | Document de référence | Prochaine action prioritaire |
| :--- | :--- | :--- | :--- |
| **1. Audit Global (Site, Catalogue, Admin, CRM)** | ✅ Terminé | [01-audit-complet-et-plan-30j.md](file:///c:/Users/sylvi/DEV/GRAFIKALY/docs/contexte/01-audit-complet-et-plan-30j.md) | Exploiter les conclusions dans les discussions dédiées |
| **2. Benchmark Prix Officiels & Psychologie Locale (28 offres)** | ✅ Terminé | [02-benchmark-prix-et-psychologie-madagascar.md](file:///c:/Users/sylvi/DEV/GRAFIKALY/docs/contexte/02-benchmark-prix-et-psychologie-madagascar.md) | Appliquer les prix d'ancrage (`compare_at_price_mga`) et le copywriting en Ariary/jour |
| **3. Architecture & Outil CLI Copilote Admin** | ✅ Opérationnel & Connecté (`admin`) | [2026-10-02-copilote-admin-plan.md](file:///c:/Users/sylvi/DEV/GRAFIKALY/docs/plans/2026-10-02-copilote-admin-plan.md) & [src/cli.mjs](file:///c:/Users/sylvi/DEV/GRAFIKALY/src/cli.mjs) | Prêt à exécuter les diff/apply Catalogue & les brouillons Marketing |
| **4. Optimisation Catalogue, Prix d'ancrage & Combos** | ⏳ Prêt à démarrer | [02-benchmark-prix-et-psychologie-madagascar.md](file:///c:/Users/sylvi/DEV/GRAFIKALY/docs/contexte/02-benchmark-prix-et-psychologie-madagascar.md) | Mettre à jour les prix barrés, créer la catégorie IA, activer `promo_code_enabled` sur les produits phares |
| **5. Stratégie Emailing & Automatisations (J-7, J-3, J+1)** | 🔄 En cours ([Discussion Email Marketing](conversation://5087f294-e94d-48d3-af5f-ec047c802fc7)) | [03-strategie-email-marketing.md](file:///c:/Users/sylvi/DEV/GRAFIKALY/docs/contexte/03-strategie-email-marketing.md) | Déployer Étape 1 (Codes Promo `PANIER10`/`RETOUR10`/`BIENVENUE10`), Étape 2 (7 Automatisations) & Étape 3 (Campagnes sur les **2 391 contacts**) |
| **6. Stratégie Marketing & Automatisation Facebook** | 🔄 En cours ([Discussion Marketing & FB](conversation://448d6684-25b0-4957-8ba2-b6f812e51e80)) | [01-audit-complet-et-plan-30j.md](file:///c:/Users/sylvi/DEV/GRAFIKALY/docs/contexte/01-audit-complet-et-plan-30j.md) & [02-benchmark-prix-et-psychologie-madagascar.md](file:///c:/Users/sylvi/DEV/GRAFIKALY/docs/contexte/02-benchmark-prix-et-psychologie-madagascar.md) | Cadrer l'écosystème Facebook (Contenu, Ads, Automatisation Messenger/Commentaires/Publication) + Synergie Emailing |

---

## 2. Organisation Recommandée des Discussions (Multi-Conversations)

Tu peux ouvrir autant de nouvelles discussions que nécessaire dans ce projet (`c:\Users\sylvi\DEV\GRAFIKALY`). Voici comment les découper proprement si tu le souhaites :

- **Discussion #1 (Fondatrice — [`347c4a3c-3729-41b8-9897-bf2eaa1ae215`](conversation://347c4a3c-3729-41b8-9897-bf2eaa1ae215))** : Audit initial, Benchmark des prix officiels, Conception et connexion opérationnelle du Copilote Admin CLI (`.env`, Seroval, `backups/`) et mémoire partagée.
- **Discussion Catalogue, Pricing & Copywriting** : Travail produit par produit sur les prix d'ancrage barrés, les descriptions psychologiques (coût par jour en Ariary, aversion à la perte), les packs et les Order Bumps (`/admin/combos`).
- **Discussion Stratégie Email Marketing ([`5087f294-e94d-48d3-af5f-ec047c802fc7`](conversation://5087f294-e94d-48d3-af5f-ec047c802fc7))** : Pilotage complet de `/admin/marketing`, `/admin/emails` et `/admin/codes-promo` (Base confirmée : **2 391 contacts**, Automatisations Panier & Pré-renouvellement, Campagnes sur les 6 segments).
- **Discussion Marketing & Automatisation Facebook ([`448d6684-25b0-4957-8ba2-b6f812e51e80`](conversation://448d6684-25b0-4957-8ba2-b6f812e51e80))** : Stratégie d'acquisition et d'automatisation Facebook (posts, réponses commentaires/Messenger, conversion vers `grafikaly.mg` ou WhatsApp).

---

## 3. Historique des Décisions Validées & Chiffres Réels Admin

- **2026-10-01** ([Discussion #1](conversation://347c4a3c-3729-41b8-9897-bf2eaa1ae215)) :
  - Audit complet de `grafikaly.mg` (28 produits actifs / 31 en base, 2 packs actifs / 5 en base, 1 service web 24h à `300 000 Ar`, stack TanStack Start + Supabase).
  - Benchmark complet des prix par rapport aux tarifs officiels USD/EUR convertis en Ariary (`1 USD = 4 426 Ar`, `1 EUR = 4 965 Ar` + frais bancaires locaux) : économie moyenne de **-70 % à -93 %** pour le client malgache.
- **2026-10-02** ([Discussion #1](conversation://347c4a3c-3729-41b8-9897-bf2eaa1ae215)) :
  - Validation du **Mode Copilote Sécurisé** (Approche C Hybride : CLI locale + mode `draft` et `dryRun: true` natifs).
  - Périmètre confié : **Catalogue, Prix & Copywriting** + **Marketing & Emailing**.
- **2026-10-05** ([Discussion #1](conversation://347c4a3c-3729-41b8-9897-bf2eaa1ae215) & [Discussion Email Marketing](conversation://5087f294-e94d-48d3-af5f-ec047c802fc7)) :
  - Mise en place de l'architecture multi-conversations interconnectée via `AGENTS.md`, `docs/JOURNAL_ETAT.md` et `docs/contexte/`.
  - **Connexion Admin CLI (`src/cli.mjs`) validée et opérationnelle** + Snapshot initial complet enregistré dans `backups/2026-10-05T17-32-14-928Z-full-admin-backup.json`.
  - **Chiffres réels extraits de `/admin/marketing` et `/admin/codes-promo`** :
    - `all_consented` (Tous les clients de la base) : **2 391 clients**
    - `dormant_customers` (Clients dormants) : **2 284 clients**
    - `subscriptions_active` (Abonnés actifs) : **150 clients**
    - `subscriptions_cut` (Abonnements coupés à réactiver) : **58 clients**
    - `consent_pending` (Clients à qui demander l'accord) : **99 clients**
    - `automations.settings` : `{}` (0 automatisation configurée actuellement)
    - Codes promo actifs : `NETFLIX15` (-15%, 0 utilisation — *note : l'email envoyé le 17/09 contenait une coquille `NETFLX15` et le produit Netflix avait `promo_code_enabled: false`*) + 2 codes récompenses d'avis (`MERCI-FLNMHP`, `MERCI-VB44KK`).
  - Création du kit complet d'exécution Email Marketing dans [03-strategie-email-marketing.md](file:///c:/Users/sylvi/DEV/GRAFIKALY/docs/contexte/03-strategie-email-marketing.md) (3 codes promo piliers, 7 templates d'automatisation avec variables exactes, et 4 campagnes ciblées).
