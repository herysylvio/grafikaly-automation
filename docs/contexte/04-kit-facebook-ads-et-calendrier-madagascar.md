# Kit Opérationnel : Stratégie Facebook, Automatisations & Campagnes Ads (Marché Madagascar)

> **Date** : 5 octobre 2026  
> **Outil CLI associé** : [`src/facebook.mjs`](file:///c:/Users/sylvi/DEV/GRAFIKALY/src/facebook.mjs)  
> **Règles de détection FR/MG** : [`config/fb-rules.json`](file:///c:/Users/sylvi/DEV/GRAFIKALY/config/fb-rules.json)  
> **Calendrier généré** : `backups/fb-calendar-draft.json`

---

## 1. Branchement Rapide de l'API Meta Graph dans `.env` (100 % Local)

Pour que [`src/facebook.mjs`](file:///c:/Users/sylvi/DEV/GRAFIKALY/src/facebook.mjs) puisse lire les commentaires de votre Page et envoyer les réponses publiques + messages privés (`Private Reply`), ajoutez ces 2 lignes dans votre fichier local `c:\Users\sylvi\DEV\GRAFIKALY\.env` :

```ini
FB_PAGE_ID=votre_id_de_page_facebook
FB_PAGE_ACCESS_TOKEN=EAA...votre_token_de_page_permanent
```

### Comment récupérer votre `FB_PAGE_ACCESS_TOKEN` en 2 minutes sur Meta for Developers :
1. Ouvrez [Graph API Explorer](https://developers.facebook.com/tools/explorer/).
2. Dans **Meta App**, sélectionnez votre application (type *Business*).
3. Dans **User or Page**, sélectionnez votre **Page Facebook Grafikaly** et cochez les permissions :
   - `pages_Show_list`
   - `pages_read_engagement`
   - `pages_manage_engagement` *(pour répondre aux commentaires)*
   - `pages_manage_posts` *(pour programmer les posts)*
   - `pages_messaging` *(pour envoyer le Private Reply dans Messenger)*
4. Cliquez sur **Generate Access Token**, copiez-le dans `.env`, puis lancez dans votre terminal :
   ```powershell
   node src/facebook.mjs verify
   ```

---

## 2. Configuration « 24h/24 Sans Serveur » dans Meta Business Suite (À copier-coller)

Pour que vos prospects reçoivent une réponse immédiate **même lorsque votre PC est éteint**, allez dans **Meta Business Suite > Boîte de réception > Automatisations** et configurez ces 2 briques natives :

### 2.1 Message d'accueil instantané (Instant Reply)
```text
Salama & Bienvenue chez Grafikaly Madagascar 🇲🇬✨
Vos abonnements Premium (Netflix, Canva Pro, Spotify, Prime Video, Outils IA) et licences officielles payables directement en Ariary par Mvola et Orange Money — sans carte bancaire !

⚡ Commandez en 2 minutes 24h/24 sur notre site officiel :
👉 https://www.grafikaly.mg?utm_source=facebook&utm_medium=instant_reply

Cliquez sur l'une des questions ci-dessous ou écrivez-nous le nom de l'outil que vous cherchez 👇
```

### 2.2 Les 4 Questions Fréquentes (Icebreakers Messenger)

#### Question 1 : `🎬 Tarifs Netflix, Prime Video & Spotify (en Ariary)`
**Réponse automatique :**
```text
Voici nos tarifs Streaming & Musique payables par Mvola / Orange Money (activation rapide en moins de 2h) :

🎬 NETFLIX (Smartphone/PC ou Smart TV 4K) :
• 1 mois : 24 500 Ar
• 3 mois : 69 000 Ar (au lieu de 135 000 Ar en devise !)
👉 https://www.grafikaly.mg/produit/netflix-smartphone-pc-uniquement?utm_source=facebook&utm_medium=icebreaker

📺 AMAZON PRIME VIDEO (TV & Mobile inclus) :
• 1 mois : 19 500 Ar | 3 mois : 49 000 Ar
👉 https://www.grafikaly.mg/produit/prime-video?utm_source=facebook&utm_medium=icebreaker

🎵 SPOTIFY PREMIUM (Sur votre compte personnel !) :
• 3 mois : 49 000 Ar | 12 mois : 129 000 Ar (seulement 10 750 Ar/mois !)
👉 https://www.grafikaly.mg/produit/spotify-premium?utm_source=facebook&utm_medium=icebreaker
```

#### Question 2 : `🎨 Tarifs Canva Pro & Outils IA (Claude, Lovable, Notion...)`
**Réponse automatique :**
```text
Travaillez avec les meilleurs outils Pro sur votre propre compte, jusqu'à -85 % moins cher qu'en Dollars :

🎨 CANVA PRO ÉDUCATION (Sur votre email personnel) :
• 1 mois : 14 500 Ar | 3 mois : 39 000 Ar
• 12 mois : 98 000 Ar (Revient à seulement 270 Ar / jour !)
👉 https://www.grafikaly.mg/produit/canva-pro-education?utm_source=facebook&utm_medium=icebreaker

🤖 NOS OUTILS IA & NO-CODE (12 mois) :
• Google AI Pro (Gemini Adv + 2To) : 289 000 Ar (au lieu de 1 060 000 Ar)
• Notion Business + IA : Dès 69 000 Ar (3m) / 249 000 Ar (12m)
• Framer Pro (12m) : 189 000 Ar (-88 % !)
• Lovable Pro / Descript Creator : 349 000 Ar
👉 Voir tout le catalogue IA : https://www.grafikaly.mg/boutique?utm_source=facebook&utm_medium=icebreaker
```

#### Question 3 : `📱 Comment payer par Mvola ou Orange Money ?`
**Réponse automatique :**
```text
C'est 100 % simple, sécurisé et sans carte bancaire :

1️⃣ Choisissez votre abonnement sur https://www.grafikaly.mg/boutique
2️⃣ À l'étape du paiement, envoyez le montant exact en Ariary par Mvola ou Orange Money aux numéros affichés sur la page.
3️⃣ Indiquez la référence de transaction (et la capture d'écran) sur le site.
4️⃣ Notre équipe valide votre paiement en moins d'1h et active votre accès sous 2h !

👉 Guide complet étape par étape : https://www.grafikaly.mg/comment-ca-marche?utm_source=facebook&utm_medium=icebreaker
```

#### Question 4 : `🚀 Créer mon site E-commerce en 24h (Dès 349 000 Ar)`
**Réponse automatique :**
```text
Vous vendez sur Facebook à Madagascar ? Passez au niveau supérieur avec votre propre boutique en ligne livrée en 24h (paiement Mvola/Orange Money intégré, gestion des stocks et commandes) !

💎 Formule Essentiel : 349 000 Ar / an (Hébergement 1 an inclus !)
🔥 Formule Business (Recommandée) : 649 000 Ar / an (Jusqu'à 100 produits + formation incluse)

👉 Découvrez la démo et configurez votre projet ici :
https://www.grafikaly.mg/services/creation-site-ecommerce?utm_source=facebook&utm_medium=icebreaker

💬 Ou discutez directement avec notre équipe projet sur WhatsApp : +261 38 42 080 80
```

---

## 3. Architecture des 4 Campagnes Facebook Ads (Spécial Madagascar)

Pour rentabiliser chaque Ariary investi en publicité Meta Ads, ne mélangez jamais le Streaming grand public et les offres B2B/IA dans le même ensemble de publicités :

| Campagne | Objectif Meta | Audience & Ciblage Madagascar | Produits mis en avant | Angle Créatif & Copywriting |
| :--- | :--- | :--- | :--- | :--- |
| **Campagne 1 : Acquisition Volume (Grand Public)** | **Ventes / Trafic Site** *(+ Engagement Commentaires)* | • **Lieu** : Madagascar (Antananarivo, Tamatave, Majunga, Fianarantsoa, Diego)<br>• **Intérêts** : Netflix, Anime, Crunchyroll, Spotify, Cinéma, Canva | `Canva Pro` (`14 500 Ar` / `98 000 Ar`), `Netflix` (`24 500 Ar`), `Prime Video` (`19 500 Ar`), `Spotify` | **L'Effet « 270 Ar / jour » (Le prix d'un Mofo Gasy)** + Paiement Mvola sans carte Visa. |
| **Campagne 2 : Freelances, Créateurs & Cadres (Forte Marge)** | **Trafic / Messages** | • **Lieu** : Antananarivo + grandes villes<br>• **Intérêts** : Freelancer, Upwork, Design graphique, Développement Web, Intelligence Artificielle, Marketing digital, LinkedIn | `Framer Pro`, `Lovable Pro`, `Notion Business`, `Google AI Pro`, `Coursera Pro`, `LinkedIn Premium`, `ULTIMATE IA PACK` | **Le Choc des Devises (-75 % à -88 %)** : *« Économisez 1 000 000 Ar sur vos outils de travail et rentabilisez l'abonnement dès votre 1er client »*. |
| **Campagne 3 : Commerçants Facebook $\rightarrow$ Site E-commerce 24h** | **Prospects (Messenger / WhatsApp / Tunnel Web)** | • **Comportement** : **Administrateurs de Pages Facebook** (Commerce / Vente au détail) à Madagascar | Service `Création de site e-commerce en 24h` (`349 000 Ar` / `649 000 Ar`) | **Douleur des vendeurs FB** : *« Fatigué de répondre "Mp" à 200 curieux qui n'achètent pas ? Automatisez vos ventes Mvola avec votre propre site livré en 24h pour 349 000 Ar/an »*. |
| **Campagne 4 : Retargeting « Panier & Visiteurs Tièdes »** | **Conversions / Messages** | • Visiteurs de `grafikaly.mg` (30 derniers jours) + Personnes ayant interagi avec la Page Facebook ou Instagram (90 jours) | Carrousel Best-Sellers + Code Promo **`BIENVENUE10` (-10 %)** *(une fois `promo_code_enabled` activé)* | **Urgence de Stock & Réassurance** : *« Plus que quelques places sur nos comptes maîtres de la semaine — Livraison garantie en moins de 2h »*. |

---

## 4. Les 4 Textes Publicitaires (Ad Copies) Prêts à Copier-Coller

### Publicité #1 — Canva Pro 12 mois (« L'Angle 270 Ar / jour »)
- **Titre du visuel Canva** : `CANVA PRO 1 AN = 270 AR / JOUR 🎨`
- **Sous-titre du visuel** : `98 000 Ar/an au lieu de 531 000 Ar (120 $) • Paiement Mvola & Orange Money`
- **Texte principal** :
  > 🔥 **270 Ar par jour.** C'est le prix d'un mofo gasy, et ça vous donne accès à **Canva Pro sur votre compte personnel pendant 12 mois complets** !
  >
  > Pourquoi payer **120 $/an (~531 000 Ar + frais bancaires Visa)** sur le site international quand **Grafikaly Madagascar** vous l'active à seulement **98 000 Ar pour 1 an** (ou dès **14 500 Ar pour 1 mois**) ?
  >
  > ✅ Activé directement sur votre propre adresse email  
  > ✅ Détourage photo en 1 clic, millions de templates Pro, polices et exports HD  
  > ✅ Paiement 100 % local par **Mvola** ou **Orange Money** (sans carte bancaire)  
  >
  > 👉 **Commandez votre accès en 2 minutes ici :**  
  > https://www.grafikaly.mg/produit/canva-pro-education?utm_source=facebook&utm_medium=cpc&utm_campaign=canva_270ar
  >
  > 💬 *Ou commentez **"CANVA"** ci-dessous pour recevoir le lien direct dans Messenger !*

---

### Publicité #2 — Streaming 4K : Netflix & Prime Video (« Sans Carte Visa, Sans Coupure »)
- **Titre du visuel Canva** : `VOS SÉRIES EN 4K SANS CARTE VISA 🍿`
- **Sous-titre du visuel** : `Netflix dès 24 500 Ar • Prime Video dès 19 500 Ar • Livraison < 2h`
- **Texte principal** :
  > 🍿 **Envie de regarder vos séries et films ce soir sans galérer avec une carte bancaire internationale ?**
  >
  > Sur **Grafikaly.mg**, réservez votre profil privé en moins de 2 minutes et payez simplement en Ariary via **Mvola** ou **Orange Money** :
  >
  > 🔴 **NETFLIX Premium HD/4K** : Dès **24 500 Ar / mois** *(69 000 Ar pour 3 mois)*  
  > 🔵 **AMAZON PRIME VIDEO** : Dès **19 500 Ar / mois** *(49 000 Ar pour 3 mois)*  
  > 🟠 **CRUNCHYROLL MEGAFAN (Anime)** : Dès **14 500 Ar / mois**  
  > 🟢 **SPOTIFY PREMIUM (Sur votre compte)** : **129 000 Ar pour 12 mois** *(10 750 Ar/mois !)*
  >
  > ⚠️ *Attention : Il ne reste plus que **2 places** disponibles sur nos comptes Netflix Smart TV cette semaine.*
  >
  > 👉 **Choisissez votre abonnement maintenant sur :**  
  > https://www.grafikaly.mg/boutique?utm_source=facebook&utm_medium=cpc&utm_campaign=streaming_mada
  >
  > 💬 *Commentez **"PRIX"** ou **"MP"** et notre assistant vous envoie le lien immédiatement !*

---

### Publicité #3 — Outils IA, Carrière & Freelances (« Le Choc des Devises -75 % à -88 % »)
- **Titre du visuel Canva** : `LES OUTILS IA & PRO JUSQU'À -88 % EN ARIARY 🤖`
- **Sous-titre du visuel** : `Payez en Mvola au lieu de payer en Dollars !`
- **Texte principal** :
  > 🚨 **Freelances, Développeurs, Créateurs & Cadres à Madagascar : arrêtez de laisser les tarifs en Dollars et les banques avaler votre marge !**
  >
  > Comparez ce que vous payez avec une carte Visa vs le tarif officiel **Grafikaly.mg** (sur votre compte personnel, payable par Mvola/Orange Money) :
  >
  > ⚡ **Framer Pro (12 mois)** : **189 000 Ar** ~~au lieu de 1 593 000 Ar (360 $)~~ $\rightarrow$ **-88 %**  
  > 🎓 **Coursera Plus (12 mois - Certificats illimités)** : **249 000 Ar** ~~au lieu de 1 766 000 Ar (399 $)~~ $\rightarrow$ **-86 %**  
  > 🧠 **Google AI Pro (Gemini Advanced + 2 To - 12m)** : **289 000 Ar** ~~au lieu de 1 062 000 Ar~~ $\rightarrow$ **-73 %**  
  > 💻 **Lovable Pro / Descript Creator (12 mois)** : **349 000 Ar** ~~au lieu de 1 328 000 Ar~~ $\rightarrow$ **-74 %**  
  > 📝 **Notion Business + IA (12 mois)** : **249 000 Ar** ~~au lieu de 1 062 000 Ar~~ $\rightarrow$ **-77 %**  
  > 💼 **LinkedIn Premium Business / Career (2 à 12m)** : Dès **129 000 Ar**
  >
  > 💡 *Un seul contrat client à 200 000 Ar rembourse votre abonnement pour toute l'année !*
  >
  > 👉 **Équipez-vous dès aujourd'hui sur :**  
  > https://www.grafikaly.mg/boutique?utm_source=facebook&utm_medium=cpc&utm_campaign=ia_b2b_mada
  >
  > 💬 *Commentez **"IA"** ou le nom de l'outil souhaité pour recevoir sa fiche directe en MP !*

---

### Publicité #4 — Création de Site E-commerce en 24h (« Spécial Vendeurs Facebook Mada »)
- **Titre du visuel Canva** : `VOTRE SITE E-COMMERCE LIVRÉ EN 24H 🚀`
- **Sous-titre du visuel** : `Dès 349 000 Ar/an (Hébergement inclus) • Paiement Mvola & Orange Money`
- **Texte principal** :
  > 🇲🇬 **Vous vendez sur Facebook à Madagascar ? Combien de commandes perdez-vous chaque soir parce que les clients attendent que vous répondiez "Mp" ?**
  >
  > Alors qu'une agence web classique facture entre **1 500 000 et 4 000 000 Ar** avec 1 mois d'attente (et que Shopify coûte **1 540 000 Ar/an** en Dollars), **Grafikaly** crée et met en ligne votre **boutique e-commerce clé en main en 24 heures** :
  >
  > ✅ **Catalogue produits + Panier d'achat fluide sur mobile**  
  > ✅ **Paiement Mvola & Orange Money intégré**  
  > ✅ **Hébergement 1 an + Nom de domaine inclus**  
  > ✅ **Formule Essentiel à 349 000 Ar/an** ou **Formule Business à 649 000 Ar/an**
  >
  > 👉 **Découvrez l'offre et lancez votre boutique en 24h ici :**  
  > https://www.grafikaly.mg/services/creation-site-ecommerce?utm_source=facebook&utm_medium=cpc&utm_campaign=site_ecommerce_24h
  >
  > 💬 *Commentez **"SITE"** ci-dessous pour recevoir la présentation complète dans Messenger !*
