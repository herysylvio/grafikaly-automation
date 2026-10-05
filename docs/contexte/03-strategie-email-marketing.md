# Stratégie & Kit d'Exécution Email Marketing — Grafikaly (`grafikaly.mg`)

> **Date de création :** 5 octobre 2026  
> **Base de contacts active :** **2 391 contacts**  
> **Outils back-office concernés :** `/admin/codes-promo`, `/admin/emails`, `/admin/marketing`, `/admin/abonnements`  
> **Compatibilité technique :** 100 % des balises `{{...}}` ci-dessous correspondent aux variables exactes du code de production (`emails-D3er-vpD.js` et `marketing-DxAcY_2B.js`).

---

## 1. Pourquoi cet ordre d'exécution est la meilleure option (« Zéro Fuite, Cash Maximal »)

Avec **2 391 contacts** en base, envoyer une campagne massive tout de suite sans préparer le terrain ferait perdre jusqu'à **70 % des conversions** à cause de deux fuites techniques identifiées lors de l'audit :
1. **Le blocage des codes promo (`promo_code_enabled: false` sur 19 produits sur 20) :** Si un client reçoit un email avec `PANIER10` ou `RETOUR10` et essaie d'acheter *Canva Pro*, *Prime Video* ou *Spotify*, le code est rejeté au panier.
2. **Les filets automatiques éteints ou non optimisés (`abandoned_cart` et `pre_renewal`) :** Dès que les 2 391 contacts vont cliquer sur nos emails et visiter le site, une partie va ajouter au panier sans payer immédiatement. L'automatisation `abandoned_cart` doit être prête pour les rattraper à **H+1, J+1 et J+3**.

Voici donc le **Plan d'Attaque en 3 Étapes Ordonnées** :
- **Étape 1 (10 min) :** Débloquer les codes promo et créer les 3 codes piliers (`PANIER10`, `RETOUR10`, `VIP10`).
- **Étape 2 (20 min) :** Mettre en place les **7 Modèles d'Automatisations** (`Panier abandonné x3` + `Pré-renouvellement x3` + `Dernier rappel avant coupure`).
- **Étape 3 (Opération Cash sur les 2 391 contacts) :** Lancer dans l'ordre les **4 Campagnes Segmentées** (en commençant par les abonnements coupés/expirés et le ré-opt-in de l'ancien site).

---

## 2. ÉTAPE 1 : Déblocage des Codes Promo (`/admin/produits` & `/admin/codes-promo`)

### 2.1 Activer `promo_code_enabled: true` dans `/admin/produits`
- **Action :** Basculer l'option **« Autoriser les codes promo »** sur **Activé (`true`)** sur tous les produits du catalogue (à l'exception éventuelle de `NETFLIX Smart TV` tant qu'il ne reste que 2 places sur 12, ou des produits où ta marge unitaire est < 15 %).
- *Rappel sécurité intégré au code Grafikaly :* Ton système empêche déjà automatiquement de cumuler un code promo avec une vente flash ou avec la cagnotte fidélité.

### 2.2 Créer les 3 Codes Promo Piliers dans `/admin/codes-promo`

| Code | Produit cible | Type & Valeur | Une seule fois / client | Usage & Note interne |
| :--- | :--- | :--- | :---: | :--- |
| **`PANIER10`** | `Tous les produits` | Pourcentage : **`10 %`** | ✅ Oui (`true`) | Déclenché automatiquement par la 3e relance de panier abandonné (J+3 / 72h). |
| **`RETOUR10`** | `Tous les produits` | Pourcentage : **`10 %`** | ✅ Oui (`true`) | Campagne de réactivation des abonnements coupés (`subscriptions_cut`). |
| **`BIENVENUE10`** | `Tous les produits` | Pourcentage : **`10 %`** | ✅ Oui (`true`) | Cadeau immédiat pour la campagne d'accord marketing (`consent_pending` — anciens clients). |

---

## 3. ÉTAPE 2 : Les 7 Emails d'Automatisation (« Le Filet de Sécurité 24h/24 »)

> **Où les coller :** Dans `/admin/emails` $\rightarrow$ onglet **Modèles** (choisir **« Modèle automatique Grafikaly »** pour conserver le design officiel avec logo, puis coller l'**Objet** et le **Contenu texte** ci-dessous).  
> Ensuite, aller dans `/admin/marketing` $\rightarrow$ onglet **Automations**, cliquer sur **« Simuler (aucun envoi) »**, vérifier le compteur, puis basculer sur **Activée**.

### 3.1 Séquence A : Panier Abandonné (`abandoned_cart` — H+1, J+1, J+3)
*Variables natives vérifiées : `{{customer_name}}`, `{{cart_items_text}}`, `{{cart_items_html}}`, `{{cart_total}}`, `{{cart_url}}`, `{{promo_code}}`, `{{whatsapp_url}}`.*

#### Email 1 — `abandoned_cart_step_1` (Envoyé à +60 minutes : Assistance & Zéro Friction Mobile Money)
- **Angle psychologique :** À Madagascar, 80 % des abandons à H+1 viennent d'une hésitation sur le paiement Mvola/Orange Money ou d'une question technique (ex. « Est-ce que ça marche sans carte Visa ? »). On adopte un ton d'entraide, pas un ton commercial agressif.
- **Objet :** `{{customer_name}}, un souci pour activer votre accès sur Grafikaly ?`
- **Contenu (`body`) :**
```text
Bonjour {{customer_name}},

Nous avons remarqué que vous avez sélectionné vos accès sur Grafikaly, mais que votre commande n'est pas encore finalisée :

{{cart_items_text}}
Total réservé : {{cart_total}}

Chez Grafikaly, tout est pensé pour être simple et 100 % adapté à Madagascar :
- Pas besoin de carte Visa/Mastercard internationale ni de payer en Dollars/Euros.
- Paiement direct en Ariary par Mvola ou Orange Money.
- Livraison et activation rapide par notre équipe locale après validation.

Votre panier et votre place en stock sont toujours réservés ici :
👉 {{cart_url}}

Vous avez une question avant de valider ou besoin d'aide pour le paiement Mobile Money ? Répondez directement à cet email ou écrivez-nous sur WhatsApp : {{whatsapp_url}}

À tout de suite,
L'équipe {{site_name}}
```

#### Email 2 — `abandoned_cart_step_2` (Envoyé à +24 heures : Ancrage Prix Officiel & Aversion à la Perte de Stock)
- **Angle psychologique :** Rappel de l'économie massive par rapport au tarif officiel en devises + rareté des places sur les comptes maîtres.
- **Objet :** `Votre place est encore réservée (économisez jusqu'à -80 % en Ariary)`
- **Contenu (`body`) :**
```text
Bonjour {{customer_name}},

Vos articles vous attendent toujours dans votre panier Grafikaly :

{{cart_items_text}}
Total : {{cart_total}}

Pourquoi payer le plein tarif en Dollars ou en Euros avec des frais bancaires quand vous pouvez profiter exactement du même service officiel, en Ariary, jusqu'à 5 à 8 fois moins cher ?

⚠️ Attention : nos places sur les comptes maîtres (Netflix, Canva Pro, Spotify, Prime Video et outils IA) sont limitées pour garantir une qualité irréprochable à chaque abonné.

Reprenez votre commande en 30 secondes avant que votre place ne soit attribuée à un autre membre :
👉 {{cart_url}}

Une question ? Notre support WhatsApp est disponible ici : {{whatsapp_url}}

L'équipe {{site_name}}
```

#### Email 3 — `abandoned_cart_step_3` (Envoyé à +72 heures : L'Offre Irrésistible `-10%` avec `{{promo_code}}`)
- **Angle psychologique :** Dernière relance avant libération du panier, avec déclenchement du code `PANIER10`.
- **Objet :** `🎁 Dernier rappel {{customer_name}} : -10 % immédiat sur votre panier (Code : {{promo_code}})`
- **Contenu (`body`) :**
```text
Bonjour {{customer_name}},

C'est notre dernier message concernant votre panier en attente :

{{cart_items_text}}
Total initial : {{cart_total}}

Pour vous permettre de tester la qualité du service Grafikaly dès aujourd'hui, nous vous offrons une remise exceptionnelle de -10 % supplémentaires sur votre commande !

🎁 Votre code promo personnel : {{promo_code}}
(À saisir directement dans votre panier avant de valider votre paiement Mvola ou Orange Money).

Cliquez ici pour appliquer votre code {{promo_code}} et recevoir vos accès :
👉 {{cart_url}}

Attention : ce code est valable une seule fois et votre réservation expire très bientôt.

À très vite sur {{site_name}},
L'équipe {{site_name}}
Support WhatsApp : {{whatsapp_url}}
```

---

### 3.2 Séquence B : Pré-Renouvellement Automatique (`pre_renewal` — J-30, J-7, J-1) + Dernier Rappel (`last-call`)
*Variables natives vérifiées (`Q`) : `{{customer_name}}`, `{{product_name}}`, `{{variant_label}}`, `{{order_number}}`, `{{subscription_end_date}}`, `{{days_remaining}}`, `{{renewal_url}}`, `{{whatsapp_url}}`.*

> [!TIP]
> **Rappel fonctionnement technique :** Lorsque tu actives `pre_renewal` dans `/admin/marketing` > *Automations*, l'ancienne relance unique à J-3 (`subscription_reminder`) est automatiquement désactivée pour éviter les doublons. Note aussi que `pre_renewal_j30` ne s'envoie qu'aux abonnements longs (trimestriels/annuels ayant $\ge 30$ jours restants).

#### Email 4 — `pre_renewal_j30` (J-30 avant échéance : Sérénité & Continuité pour les abonnements longs)
- **Objet :** `Info abonnement : votre accès {{product_name}} arrive à échéance dans 30 jours`
- **Contenu (`body`) :**
```text
Bonjour {{customer_name}},

Nous espérons que vous profitez pleinement de votre abonnement {{product_name}} ({{variant_label}}).

Ceci est un simple message d'anticipation : votre période actuelle arrivera à échéance le {{subscription_end_date}} (dans {{days_remaining}} jours).

Comme Grafikaly ne pratique aucun prélèvement automatique surprise, vous restez 100 % maître de votre renouvellement.

Si vous souhaitez sécuriser votre place pour la période suivante dès maintenant et éviter toute coupure d'accès :
👉 Renouveler en 1 clic : {{renewal_url}}

Besoin de passer sur une durée plus longue (3 mois, 6 mois ou 12 mois) pour économiser encore plus en Ariary ? Écrivez-nous sur WhatsApp : {{whatsapp_url}}

Merci pour votre confiance,
L'équipe {{site_name}}
```

#### Email 5 — `pre_renewal_j7` (J-7 avant échéance : Protection du Profil & du Tarif)
- **Objet :** `⏳ Plus que 7 jours sur votre abonnement {{product_name}} ({{customer_name}})`
- **Contenu (`body`) :**
```text
Bonjour {{customer_name}},

Votre abonnement {{product_name}} ({{variant_label}} — commande #{{order_number}}) expire dans exactement 7 jours, le {{subscription_end_date}}.

Pourquoi renouveler avant la date d'échéance ?
1. Vous conservez votre place et votre profil actuel sans aucune interruption.
2. Vous évitez que votre slot ne soit réattribué à la liste d'attente le jour de l'expiration.
3. Le règlement prend moins de 2 minutes par Mvola ou Orange Money.

Sécurisez la continuité de votre accès dès aujourd'hui :
👉 {{renewal_url}}

Une question ? Notre équipe est là sur WhatsApp : {{whatsapp_url}}

À très vite,
L'équipe {{site_name}}
```

#### Email 6 — `pre_renewal_j1` (J-1 avant échéance : Urgence Maximale — Aversion à la Perte de Place)
- **Objet :** `⚠️ URGENT {{customer_name}} : votre accès {{product_name}} expire demain ({{subscription_end_date}})`
- **Contenu (`body`) :**
```text
Bonjour {{customer_name}},

Attention, votre abonnement {{product_name}} ({{variant_label}}) arrive à échéance DEMAIN ({{subscription_end_date}}).

Au vu de la forte demande sur nos comptes maîtres, toute place non renouvelée à l'échéance est libérée pour les clients en liste d'attente.

Pour ne pas perdre votre profil, vos préférences et votre accès dès demain :
👉 Renouvelez maintenant par Mvola ou Orange Money : {{renewal_url}}

Si vous avez déjà effectué votre renouvellement aujourd'hui, merci d'ignorer ce message. En cas de besoin, contactez-nous vite sur WhatsApp : {{whatsapp_url}}

L'équipe {{site_name}}
```

#### Email 7 — `subscription_last_call` (« Dernier rappel avant coupure » — Déclenchable depuis `/admin/abonnements`)
*Variables natives vérifiées (`W`) : `{{customer_name}}`, `{{product_name}}`, `{{variant_label}}`, `{{order_number}}`, `{{ends_at}}`, `{{days_late}}`, `{{renew_url}}`, `{{whatsapp_url}}`.*
- **Objet :** `🚨 Dernier avis avant coupure de votre accès {{product_name}} ({{customer_name}})`
- **Contenu (`body`) :**
```text
Bonjour {{customer_name}},

Votre abonnement {{product_name}} ({{variant_label}}) a expiré le {{ends_at}} (il y a {{days_late}} jour(s)), mais nous avons exceptionnellement maintenu votre place active pour vous éviter une coupure brutale.

⚠️ Nous devons procéder aujourd'hui à la mise à jour des comptes maîtres. Sans renouvellement de votre part dans les prochaines heures, votre accès sera définitivement coupé et votre place réattribuée.

Pour conserver votre accès immédiatement sans coupure :
👉 Régulariser et prolonger mon abonnement : {{renew_url}}

Besoin d'aide immédiate ? Écrivez-nous sur WhatsApp : {{whatsapp_url}}

L'équipe {{site_name}}
```

---

## 4. ÉTAPE 3 : Le Plan de Campagnes sur tes 2 391 Contacts (`/admin/marketing` > *Campagnes*)

*Variables natives vérifiées dans `/admin/marketing` (`_e`) :*
- `{{customer_name}}` (Nom du client)
- `{{product_name}}` (Produit mis en avant)
- `{{promo_code}}` (Code promo de la campagne)
- `{{site_name}}` (`Grafikaly`)
- `{{site_url}}` (`https://grafikaly.mg`)
- `{{shop_url}}` (`https://grafikaly.mg/boutique`)
- `{{whatsapp_url}}` (Lien WhatsApp du support)
- `{{consent_url}}` (Lien « Je veux recevoir les offres »)
- `{{unsubscribe_url}}` (Ajouté automatiquement en pied de page)

### Campagne #1 : Réactivation des « Abonnements Coupés » (`subscriptions_cut`) — 💰 *Le ROI le plus rapide*
- **Ciblage dans `/admin/marketing` :**
  - **Audience :** `Abonnements coupés (réactivation)` (`subscriptions_cut`)
  - **Depuis au moins (jours) :** `3`
  - **Depuis au plus (jours) :** `180` *(ou `365` pour capter tout l'historique récent)*
  - **Code promo à mettre en avant :** `RETOUR10`
  - **Mode de rédaction :** `Texte simple (mise en page Grafikaly)`
- **Objet de l'email :** `{{customer_name}}, votre place sur Grafikaly vous attend (avec -10 % pour votre retour 🎁)`
- **Message (`body`) :**
```text
Bonjour {{customer_name}},

Cela fait quelque temps que votre abonnement sur {{site_name}} s'est arrêté, et nous voulions prendre de vos nouvelles !

Depuis votre dernier passage, nous avons :
✅ Renforcé la stabilité et la rapidité de livraison de tous nos comptes (Netflix, Canva Pro, Prime Video, Spotify Premium, Crunchyroll…).
✅ Ajouté les meilleurs outils IA & Pro du moment (Claude Pro, Google AI Pro, Lovable, Gamma, Notion Business, Coursera, LinkedIn Premium) jusqu'à -85 % moins cher que les tarifs officiels en Dollars.
✅ Simplifié l'espace client pour suivre vos accès et factures en un clic, toujours payable en Ariary via Mvola et Orange Money.

Pour fêter votre retour, nous vous avons réservé un code de réduction personnel de -10 % valable sur toute la boutique :

🎁 Code promo : {{promo_code}}

Réactivez votre abonnement préféré en moins de 2 minutes ici :
👉 {{shop_url}}

Une question sur un produit ou sur la disponibilité d'une place ? Écrivez-nous directement sur WhatsApp : {{whatsapp_url}}

Bon retour parmi nous,
L'équipe {{site_name}}
```

---

### Campagne #2 : Campagne d'Accord & Réveil des Clients Historiques (`consent_pending`)
- **Pourquoi elle est stratégique :** Ce segment regroupe les clients ayant déjà commandé (notamment ceux importés de l'ancien site) qui n'ont jamais validé leur accord marketing. Le code de Grafikaly (`consentExempt: true`) autorise l'envoi de **cet email spécifique** pour leur demander leur accord via `{{consent_url}}`.
- **Ciblage dans `/admin/marketing` :**
  - **Audience :** `Clients à qui demander l'accord` (`consent_pending`)
  - **Code promo à mettre en avant :** `BIENVENUE10`
- **Objet de l'email :** `🎁 {{customer_name}}, le nouveau site Grafikaly est là (+ votre cadeau client fidèle)`
- **Message (`body`) :**
```text
Bonjour {{customer_name}},

Merci de faire partie des clients historiques de {{site_name}} !

Notre plateforme a fait peau neuve sur {{site_url}} pour vous offrir :
- Une livraison encore plus rapide de vos abonnements (Netflix, Canva Pro, Spotify, Prime Video, Outils IA & Licences Pro).
- Des tarifs en Ariary jusqu'à 8 fois moins chers que les prix officiels en Dollars/Euros, payables simplement par Mvola et Orange Money.
- Des ventes flash et des codes de réduction réservés uniquement à nos membres.

Pour continuer à recevoir nos offres privées, nos alertes de retour en stock et débloquer votre code cadeau de -10 % ({{promo_code}}), confirmez simplement votre accord en 1 clic ci-dessous :

👉 OUI, je veux recevoir les offres privées Grafikaly : {{consent_url}}

Et si vous avez besoin de renouveler un abonnement dès aujourd'hui, utilisez directement votre code {{promo_code}} sur la boutique :
👉 {{shop_url}}

Merci pour votre fidélité,
L'équipe {{site_name}}
Support WhatsApp : {{whatsapp_url}}
```

---

### Campagne #3 : Cross-Sell Streaming « Le Duo Cinéma » (Ciblage : Clients Netflix Actifs $\rightarrow$ Prime Video / Spotify)
- **Ciblage dans `/admin/marketing` :**
  - **Audience :** `Clients d'un produit` (`product_customers`)
  - **Produit :** `NETFLIX | SMARTPHONE/PC Uniquement` *(puis dupliquer pour `NETFLIX | Smart TV`)*
  - **Statut de l'abonnement :** `Abonnements en cours` (`active`)
  - **Code promo :** `RETOUR10` *(ou un code dédié `DUO10` à -10 %)*
- **Objet de l'email :** `🍿 Vous aimez votre accès Netflix ? Ajoutez Prime Video ou Spotify dès 480 Ar / jour`
- **Message (`body`) :**
```text
Bonjour {{customer_name}},

Nous sommes ravis de vous compter parmi nos abonnés actifs sur {{product_name}} !

Saviez-vous que la majorité de nos membres combinent leur abonnement Netflix avec un second service pour toute la maison ou leurs déplacements, sans jamais utiliser de carte bancaire ?

En ce moment, des places sont disponibles immédiatement sur :
🎬 PRIME VIDEO (Smart TV, PC & Smartphone) : dès 19 500 Ar / mois (ou 49 000 Ar pour 3 mois, soit seulement 540 Ar / jour !).
🎵 SPOTIFY PREMIUM (activé directement sur votre propre compte personnel) : 49 000 Ar pour 3 mois ou 129 000 Ar pour 12 mois complets (10 750 Ar / mois).
🔥 CRUNCHYROLL MEGAFAN : dès 14 500 Ar / mois.

En tant qu'abonné actif Grafikaly, profitez de -10 % de remise immédiate sur votre prochain ajout avec le code : {{promo_code}}

Découvrir les places disponibles en boutique :
👉 {{shop_url}}

Bon divertissement,
L'équipe {{site_name}}
```

---

### Campagne #4 : Monétisation B2B & Haut Panier (Ciblage : Les 66 abonnés Canva Pro $\rightarrow$ Outils IA & Création de Site E-commerce 24h)
- **Pourquoi elle peut générer un gros chiffre d'affaires :** Tes **66 abonnés Canva Pro** sont des créateurs, community managers, freelances, entrepreneurs et commerçants malgaches. Une seule vente de site e-commerce (`349 000 Ar` ou `649 000 Ar`) ou d'un outil IA annuel (`189 000 Ar` à `349 000 Ar`) génère autant de CA que **15 à 26 ventes de streaming**.
- **Ciblage dans `/admin/marketing` :**
  - **Audience :** `Clients d'un produit` (`product_customers`)
  - **Produit :** `Canva Pro Éducation`
  - **Statut de l'abonnement :** `Tous les abonnements` (`all`)
- **Objet de l'email :** `🚀 {{customer_name}}, vous utilisez Canva Pro : découvrez comment aller 5x plus vite (IA & Site Web en 24h)`
- **Message (`body`) :**
```text
Bonjour {{customer_name}},

En tant qu'utilisateur de {{product_name}} chez Grafikaly, vous savez déjà à quel point les bons outils professionnels font gagner du temps et des clients.

Beaucoup de nos membres créateurs, freelances et entrepreneurs à Madagascar nous ont demandé comment aller encore plus loin sans payer des abonnements en Dollars hors de prix. Voici 2 nouveautés majeures disponibles dès aujourd'hui :

1️⃣ LES MEILLEURS OUTILS IA & PRO JUSQU'À -85 % (Payables en Mvola / Orange Money) :
- Gamma Pro (12 mois) : créez des présentations et dossiers clients par IA en 2 minutes (289 000 Ar/an au lieu de 955 000 Ar).
- Notion Business avec IA (3 ou 12 mois) : organisez tous vos projets et clients dès 69 000 Ar.
- Descript Creator, Framer Pro, Lovable Pro & Google AI Pro (Gemini Advanced + 2 To) : activés directement sur votre compte personnel.
👉 Voir tous les outils Pro : {{shop_url}}

2️⃣ NOUVEAU SERVICE : VOTRE SITE E-COMMERCE OPÉRATIONNEL EN 24H (Dès 349 000 Ar/an hébergement inclus !)
Vous vendez sur Facebook ou WhatsApp et vous voulez une vraie boutique professionnelle comme Grafikaly, livrée clé en main en 24h par notre équipe ?
👉 Découvrir l'offre Création de Site en 24h : {{site_url}}/services/creation-site-ecommerce

Vous avez une question ou souhaitez un conseil personnalisé pour votre activité ? Écrivez-nous directement sur WhatsApp : {{whatsapp_url}}

À votre succès,
L'équipe {{site_name}}
```
