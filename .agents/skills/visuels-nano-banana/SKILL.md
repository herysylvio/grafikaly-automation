---
name: visuels-nano-banana
description: >-
  Génère les prompts JSON structurés (13 sections Product Hero Shot) et les visuels
  publicitaires carrés (1080x1080) pour les produits Grafikaly via Nano Banana (generate_image).
  À utiliser systématiquement dès que l'utilisateur demande des visuels pour Facebook,
  Instagram ou le catalogue Grafikaly. Ne jamais utiliser Canva create-design pour ces visuels.
---

# Génération de Visuels Produits Grafikaly (Workflow Nano Banana)

## 1. Interdiction de Canva `create-design`
Ne jamais utiliser l'outil MCP `canva:create-design` pour générer des affiches produits Grafikaly (résultat aléatoire et incohérent). Toujours utiliser le template **Product Hero Shot (13 sections)** ci-dessous avec **Nano Banana** (`generate_image`).

## 2. Structure obligatoire du Prompt JSON (13 sections)
Pour chaque produit, construire un objet JSON `{ "prompt": "...", "size": "1024x1024" }` respectant strictement ces 13 paragraphes :

1. **Intro** : `Create a high-end, ultra-realistic, product-focused advertisement for the [NOM DU PRODUIT] in square format (1080x1080), optimized for social media.`
2. **Scene** : Bureau tech sombre haut de gamme (`sleek dark desk`) avec un écran principal (laptop/moniteur) au centre-droit affichant l'interface réelle de l'outil et un badge `[PRODUIT] PRO`.
3. **Foreground elements** : Tablette secondaire, post-its avec 3 mots-clés courts liés à l'outil, mug sobrement brandé au nom du produit, carnet avec schémas/wireframes.
4. **Additional elements** : 3 cartes/badges flottants mettant en avant 3 fonctionnalités clés du produit.
5. **Background** : Studio tech légèrement flouté (bokeh) avec éclairage RGB aux couleurs de la marque du produit.
6. **Lighting** : Éclairage studio cinématique aux couleurs de la marque, reflets maîtrisés sur le bureau sombre.
7. **Branding** : Logo officiel exact et nom du produit en haut à gauche (`top left corner`), palette sombre + couleurs d'accentuation propres à la marque.
   - **Référence Logo Officiel Lovable** : Icône en forme de cœur géométrique en "L" arrondi avec un dégradé chaud orange vif (haut) -> rose/magenta (milieu) -> bleu-violet électrique (bas gauche), suivi du texte **"Lovable"** en blanc gras sans-serif (`resources/lovable-logo.jpg`).
8. **Typography** : Titre gras en majuscules en Français (`Bold headline: "..."`) + sous-texte (`Subtext: "Offre exclusive [PRODUIT] : ..."`), positionnés à gauche sans masquer l'écran. (Sans prix si post organique d'engagement).
9. **Offer highlight** : Badge sobre `"Offre Exclusive"` et `"Accès Pro"` (ou remise si promo demandée) près du bloc produit.
10. **Design (Bande inférieure)** : Bande horizontale dégradée en bas aux couleurs du produit comportant **4 icônes avec textes courts en Français** résumant les 4 bénéfices majeurs.
11. **Signature** : `"www.grafikaly.mg"` en bas à droite (`bottom right corner`), subtil et premium.
12. **Style** : `Ultra-realistic, cinematic tech/product photography aesthetic, high detail, sharp focus on the interface and branding, shallow depth of field.`
13. **Camera** : `Square framing (1080x1080), slight front angle (hero shot de l'écran et de l'offre), composition professionnelle avec profondeur et layering.`

## 3. Exécution (Nano Banana natif + Références Logos + JSON de secours)
1. **Toujours afficher les blocs JSON** dans la réponse ou un artefact pour que l'utilisateur puisse les copier-coller au besoin.
2. Lors de l'appel à `generate_image` (`AspectRatio: "1:1"`), **passer l'image du logo officiel dans `ImagePaths`** lorsqu'elle est disponible dans [`.agents/skills/visuels-nano-banana/resources/`](./resources/) (ex: `lovable-logo.jpg`) afin que Nano Banana reproduise le logo officiel exact.
3. Appeler `generate_image` **séquentiellement (une image après l'autre, jamais en parallèle)** pour éviter l'erreur `429 RATE_LIMIT_EXCEEDED`.
4. Si le quota intégré (`QUOTA_EXHAUSTED`, ~3 images / 5h) est atteint, fournir immédiatement les prompts JSON restants prêts à être collés dans Nano Banana.
5. Sauvegarder chaque image générée dans `backups/visuals/`.
