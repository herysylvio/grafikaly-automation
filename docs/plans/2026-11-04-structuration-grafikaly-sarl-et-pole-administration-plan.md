# Plan d'Implémentation : Structuration GRAFIKALY SARL & Pôle Administration

**Date** : 04 Novembre 2026  
**Objectif** : Structurer l'entreprise GRAFIKALY SARL (Madagascar), établir la gouvernance CEO / Assistant de Direction, formaliser la protection et l'incubation de Digital 514, déployer l'organigramme du Pôle Administration (Directeur RAF + 3 sous-agents : Finance, Fiscal-Légal, RH), concevoir la base documentaire légale malgache (statuts, double journal, conventions de stage) et implémenter les outils de calcul social/fiscal malgaches vérifiés par des tests unitaires automatisés.  
**Architecture** : Modulaire, locale, conforme aux normes malgaches (Code du travail, CNaPS, OSTIE/AMIT, DGI) avec scripts Node.js de simulation vérifiés en TDD.  
**Stack** : Markdown documentaire, Node.js (scripts de calculs financiers/sociaux), Node Test Runner ou Vitest.

---

## Vue d'ensemble des Tâches Découpées

| Lot | Tâche | Fichiers cibles | Type |
| :--- | :--- | :--- | :--- |
| **Lot 1** | Initialisation Git & Structure du projet | `.gitignore`, `package.json`, `README.md` | Config |
| **Lot 2** | Architecture de Gouvernance & Organigramme Global | `docs/administration/01-charte-gouvernance-organigramme.md` | Docs |
| **Lot 3** | Cadre Juridique & Fiscal Madagascar (SARL & DGI) | `docs/administration/02-cadre-juridique-et-fiscal-madagascar.md` | Docs |
| **Lot 4** | Procédure Opérationnelle du Double Journal Comptable | `docs/administration/03-procedure-double-journal-comptable.md` | Docs |
| **Lot 5** | Guide Social Madagascar (CNaPS, OSTIE, Code du Travail) | `docs/administration/04-guide-social-cnaps-ostie-stages.md` | Docs |
| **Lot 6** | Modèle Officiel de Convention de Stage GRAFIKALY (Digital 514) | `docs/administration/05-modele-convention-stage-madagascar.md` | Docs |
| **Lot 7** | Définition des Rôles & Prompts des Agents du Pôle Admin | `agents/AGENTS.md`, `agents/raf-directeur.md`, `agents/sous-agents/*.md` | Agents |
| **Lot 8** | TDD : Moteur de Calcul des Charges Sociales & Paie Malgache | `tests/social-madagascar.test.mjs`, `src/social-madagascar.mjs` | TDD Code |
| **Lot 9** | TDD : Simulateur de Seuil de Recrutement Stagiaire vs ROI | `tests/recruitment-threshold.test.mjs`, `src/recruitment-threshold.mjs` | TDD Code |
| **Lot 10** | TDD : Générateur de Numérotation & Modèle Double Facturation | `tests/billing-system.test.mjs`, `src/billing-system.mjs` | TDD Code |
| **Lot 11** | Consolidation finale & Tableau de bord opérationnel | `JOURNAL_PILOTAGE.md`, Commit global | Revue |

---

## Détail des Micro-Tâches TDD (2 à 5 min)

### Tâche 1 : Initialisation du Repo & Base Node.js
- **Fichiers** : `.gitignore`, `package.json`
- **Action** : Créer le fichier `package.json` avec `"type": "module"` et script `"test": "node --test"` pour exécuter les tests natifs Node.js sans dépendances lourdes. Initialiser Git si nécessaire.

### Tâche 2 : Charte de Gouvernance & Organigramme Global
- **Fichiers** : `docs/administration/01-charte-gouvernance-organigramme.md`
- **Contenu** : Relations CEO (Sylvio) / Assistant de Direction (IA), statut juridique de GRAFIKALY SARL, incubation de Digital 514, conditions de spin-off autonome.

### Tâche 3 : Cadre Juridique et Fiscal Madagascar
- **Fichiers** : `docs/administration/02-cadre-juridique-et-fiscal-madagascar.md`
- **Contenu** : Obligations DGI (NIF, STAT, RCS), régime fiscal (IR / IS), calendrier des acomptes et déclarations, obligations annuelles (AGO, approbation des comptes).

### Tâche 4 : Procédure Opérationnelle du Double Journal
- **Fichiers** : `docs/administration/03-procedure-double-journal-comptable.md`
- **Contenu** : Règles strictes de séparation entre Ventes Internes (gestion réelle B2C e-commerce `grafikaly.mg` via Mobile Money) et Factures Clients Déclarables (B2B, bons de commande, proforma).

### Tâche 5 : Guide Social & Protection RH Madagascar
- **Fichiers** : `docs/administration/04-guide-social-cnaps-ostie-stages.md`
- **Contenu** : Taux de cotisations sociales réels à Madagascar (CNaPS 13% patronale + 1% salariale avec plafond 8x SMIG ; Organisme sanitaire 5% patronale + 1% salariale), grille minimale, règles de stage selon Code du travail.

### Tâche 6 : Modèle Type de Convention de Stage Valide Universités Malgaches
- **Fichiers** : `docs/administration/05-modele-convention-stage-madagascar.md`
- **Contenu** : Modèle complet tripartite (Université / École - GRAFIKALY SARL - Stagiaire) avec mention de la Division Digital 514, missions, indemnité, droits et devoirs.

### Tâche 7 : Définition des Fiches de Poste des Agents
- **Fichiers** : 
  - `agents/AGENTS.md` (Hub d'orchestration du pôle)
  - `agents/raf-directeur.md` (Directeur Administratif & Financier)
  - `agents/sous-agents/finance-tresorerie.md` (Finance & Trésorerie)
  - `agents/sous-agents/fiscal-legal-madagascar.md` (Fiscalité & Juridique)
  - `agents/sous-agents/rh-social-madagascar.md` (RH & Social)

### Tâche 8 (TDD) : Moteur de Calcul des Charges Sociales Malgaches
- **Fichier Test** : `tests/social-madagascar.test.mjs`
  - Test 1 : Calcul correct des cotisations CNaPS pour un salaire inférieur au plafond (13% patronal, 1% salarial).
  - Test 2 : Calcul avec plafonnement CNaPS à 8x SMIG (salaire élevé).
  - Test 3 : Calcul Organisme sanitaire (5% patronal, 1% salarial).
  - Test 4 : Calcul du coût employeur total et du net à payer.
- **Vérification** : Échec du test (Rouge).
- **Fichier Source** : `src/social-madagascar.mjs`
- **Implémentation** : Code minimal satisfaisant le test.
- **Vérification** : Succès du test (Vert).

### Tâche 9 (TDD) : Simulateur de Seuil de Recrutement Stagiaire vs ROI
- **Fichier Test** : `tests/recruitment-threshold.test.mjs`
  - Test 1 : Détection d'un seuil critique de démarches physiques (ex: > 10 heures/mois de temps CEO dépensé en courses = recommandation positive de recrutement d'un stagiaire).
  - Test 2 : Calcul de rentabilité financière (Indemnité de stage vs valeur du temps CEO libéré).
- **Vérification** : Échec (Rouge) -> Implémentation `src/recruitment-threshold.mjs` -> Succès (Vert).

### Tâche 10 (TDD) : Générateur de Numérotation & Modèle Double Facturation
- **Fichier Test** : `tests/billing-system.test.mjs`
  - Test 1 : Génération de référence facture officielle DGI séquentielle (`FAC-YYYY-MM-XXXX`) avec validation NIF/STAT.
  - Test 2 : Génération de reçu / ticket de vente interne (`CMD-INT-XXXX`) avec mention non fiscale.
  - Test 3 : Tagging analytique automatique (Grafikaly.mg vs Digital 514).
- **Vérification** : Échec (Rouge) -> Implémentation `src/billing-system.mjs` -> Succès (Vert).

### Tâche 11 : Journal de Pilotage & Commit Git
- **Fichiers** : `JOURNAL_PILOTAGE.md`
- **Action** : Synthèse de la configuration, guide de prise en main pour le CEO, validation finale.
