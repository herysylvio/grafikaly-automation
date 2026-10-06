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
| **5. Stratégie Emailing & Automatisations (J-7, J-3, J+1)** | 🔄 Brouillons & Codes injectés ([Discussion Email Marketing](conversation://5087f294-e94d-48d3-af5f-ec047c802fc7)) | [03-strategie-email-marketing.md](file:///c:/Users/sylvi/DEV/GRAFIKALY/docs/contexte/03-strategie-email-marketing.md) | 4 codes promo + 5 campagnes `draft` en ligne. En attente du "GO" pour activer les 6 templates & 2 automatisations + `promo_code_enabled` |
| **6. Stratégie Marketing & Automatisation Facebook** | ✅ Token Permanent ♾️ + 37/37 cmt traités ([Discussion Marketing & FB](conversation://448d6684-25b0-4957-8ba2-b6f812e51e80)) | [04-kit-facebook-ads-et-calendrier-madagascar.md](file:///c:/Users/sylvi/DEV/GRAFIKALY/docs/contexte/04-kit-facebook-ads-et-calendrier-madagascar.md) & [src/facebook.mjs](file:///c:/Users/sylvi/DEV/GRAFIKALY/src/facebook.mjs) | Valider ("GO") la publication/programmation de la vague de posts de relance Facebook |

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
- **2026-10-05** ([Discussion Marketing & FB](conversation://448d6684-25b0-4957-8ba2-b6f812e51e80)) :
  - Validation et implémentation TDD complète (9/9 tests passés) du **Copilote Facebook 100 % Local** ([`src/facebook.mjs`](file:///c:/Users/sylvi/DEV/GRAFIKALY/src/facebook.mjs), [`config/fb-rules.json`](file:///c:/Users/sylvi/DEV/GRAFIKALY/config/fb-rules.json)).
  - **Token de Page Permanent (`expires_at: 0 ♾️` — n'expire jamais)** généré via `FB_APP_SECRET` et sauvegardé dans `.env` pour la Page **Grafikaly (`ID: 939291282602301`, 803 abonnés)**.
  - **37/37 commentaires d'intention d'achat traités automatiquement avec succès** (4 sur *Création de Site E-commerce 24h*, 11 sur *Coursera Pro*, 3 sur *LinkedIn Premium Business*, et 19 sur *Higgsfield Pro* avec les liens `/produit/$slug` vérifiés en `200 OK` et filtre strict d'exclusion des produits indisponibles).
  - **4 conversations Messenger non lues** identifiées (`DramaBox VIP`, `Perplexity / Claude Pro`, suivi commande `S09291 Windows 11 Pro`, et une capture photo).
- **2026-10-06** ([Discussion Marketing & FB](conversation://448d6684-25b0-4957-8ba2-b6f812e51e80)) :
  - Validation des règles éditoriales Facebook : **zéro prix**, **zéro lien externe** dans les légendes organiques, et **focus 100% Outils IA & Productivité** (pas de streaming).
  - Enregistrement de la compétence locale [`.agents/skills/visuels-nano-banana/SKILL.md`](file:///c:/Users/sylvi/DEV/GRAFIKALY/.agents/skills/visuels-nano-banana/SKILL.md) et mise à jour de [`AGENTS.md`](file:///c:/Users/sylvi/DEV/GRAFIKALY/AGENTS.md) pour le workflow de création visuelle **Nano Banana (13 sections JSON Product Hero Shot)** + logo officiel Lovable intégré dans `backups/visuals/nb-02-lovable-pro-official.png`.
  - **Vague de 3 publications IA lancée avec succès sur la Page Facebook Grafikaly (`939291282602301`)** :
    1. **Lovable Pro** (`Post ID: 939291282602301_122138524743200124`) : **Publié en direct (LIVE)** avec visuel Nano Banana + logo officiel Lovable.
    2. **Google AI Pro (Gemini Advanced + 2 To)** (`Photo ID: 122138524785200124`) : **Programmé** pour le **Mercredi 07/10/2026 à 11h30 (Mada)**.
    3. **Canva Pro + Magic Studio IA** (`Photo ID: 122138524881200124`) : **Programmé** pour le **Jeudi 08/10/2026 à 11h30 (Mada)**.


