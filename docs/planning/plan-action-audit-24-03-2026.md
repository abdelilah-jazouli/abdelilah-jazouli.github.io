# Plan d'action — Audit site vitrine Azeka Consulting

**Date de creation** : 24 mars 2026
**Base** : [Audit etat actuel du 24-03-2026](../audit/audit-etat-actuel-24-03-2026.md)
**Branche** : `feature/version-officielle-23-02-2026`

---

## Outils de design assisté par IA

Ce plan s'appuie sur deux skills Claude Code pour accelerer les taches de design :

| Skill | Role | Quand l'utiliser |
|-------|------|------------------|
| **`stitch-ui-design`** | Crafter des prompts Stitch precis pour generer des maquettes UI, explorer des variantes visuelles, valider des directions de design | En amont de chaque tache design : prototyper le composant/page avant d'implementer |
| **`stitch-loop`** | Boucle autonome qui genere des pages HTML completes via Stitch MCP, les integre au site, et enchaine sur la page suivante | Pour produire des pages entieres (pages legales, 404, pages i18n) |

**Workflow recommande** :
1. Creer `.stitch/DESIGN.md` a partir du design system Azeka (palette, fonts, glassmorphism, dark mode)
2. Utiliser `stitch-ui-design` pour concevoir le prompt et generer des variantes
3. Valider visuellement, puis soit integrer manuellement, soit lancer `stitch-loop` pour les pages completes

Les taches concernees sont marquees avec les badges : `🎨 ui-design` et/ou `🔁 loop`.

---

## Sommaire

- [0. Prerequis Stitch](#0-prerequis-stitch)
- [1. Tableau de suivi global](#1-tableau-de-suivi-global)
- [2. Phase 1 — Urgences (S13)](#2-phase-1--urgences-s13)
  - [2.1 Formulaire de contact fonctionnel](#21-formulaire-de-contact-fonctionnel)
  - [2.2 Conformite legale](#22-conformite-legale)
  - [2.3 Liens morts et incoherences](#23-liens-morts-et-incoherences)
- [3. Phase 2 — SEO & Metadonnees (S14)](#3-phase-2--seo--metadonnees-s14)
  - [3.1 Open Graph et Twitter Cards](#31-open-graph-et-twitter-cards)
  - [3.2 Indexation et crawl](#32-indexation-et-crawl)
  - [3.3 Donnees structurees](#33-donnees-structurees)
  - [3.4 Contenu blog](#34-contenu-blog)
- [4. Phase 3 — Securite & Performance (S14-S15)](#4-phase-3--securite--performance-s14-s15)
  - [4.1 Securite des scripts](#41-securite-des-scripts)
  - [4.2 Performance chargement](#42-performance-chargement)
  - [4.3 Performance runtime](#43-performance-runtime)
- [5. Phase 4 — Design & Credibilite (S15-S16)](#5-phase-4--design--credibilite-s15-s16)
  - [5.1 Icones et assets visuels](#51-icones-et-assets-visuels)
  - [5.2 Preuve sociale](#52-preuve-sociale)
  - [5.3 Integration Google Calendar](#53-integration-google-calendar)
- [6. Phase 5 — Accessibilite (S16-S17)](#6-phase-5--accessibilite-s16-s17)
- [7. Phase 6 — UX & Navigation (S17)](#7-phase-6--ux--navigation-s17)
- [8. Phase 7 — Evolutions futures (backlog)](#8-phase-7--evolutions-futures-backlog)

---

## 0. Prerequis Stitch

> A realiser une seule fois avant d'utiliser les skills Stitch dans les phases suivantes.

| # | Tache | Fichier(s) | Statut |
|---|-------|------------|--------|
| 0.1 | Activer les skills `stitch-ui-design` et `stitch-loop` (`manage-claude-skills.sh add stitch-ui-design stitch-loop`) | `~/.claude/skills/` | `[x]` |
| 0.2 | Creer un projet Stitch pour Azeka Consulting (via MCP `create_project`) et sauvegarder les metadonnees dans `.stitch/metadata.json` | `.stitch/metadata.json` | `[x]` |
| 0.3 | Generer `.stitch/DESIGN.md` encodant le design system Azeka : palette V2 (Bleu Nuit #0A1E3F, Cyan #00D4FF, Violet #8C3DFF, Vert #39C27D), fonts (Montserrat/Sora), glassmorphism, dark mode, border-radius, spacing | `.stitch/DESIGN.md` | `[x]` |
| 0.4 | Creer `.stitch/SITE.md` avec la vision du site, le sitemap existant et le roadmap des pages a generer | `.stitch/SITE.md` | `[x]` |

---

## 1. Tableau de suivi global

| Phase | Intitule | Taches | dont Stitch | Terminees | Progression |
|-------|----------|--------|-------------|-----------|-------------|
| 0 | Prerequis Stitch | 4 | 4 | 4 | ██████████ 100% |
| 1 | Urgences | 11 | 3 | 11 | ██████████ 100% |
| 2 | SEO & Metadonnees | 9 | 0 | 9 | ██████████ 100% |
| 3 | Securite & Performance | 8 | 0 | 8 | ██████████ 100% |
| 4 | Design & Credibilite | 10 | 3 | 0 | ░░░░░░░░░░ 0% |
| 5 | Accessibilite | 6 | 0 | 0 | ░░░░░░░░░░ 0% |
| 6 | UX & Navigation | 8 | 3 | 0 | ░░░░░░░░░░ 0% |
| 7 | Evolutions futures | 7 | 2 | 0 | ░░░░░░░░░░ 0% |
| **Total** | | **63** | **15** | **32** | **█████░░░░░ 51%** |

**Legende des indicateurs** :
- `[ ]` A faire
- `[~]` En cours
- `[x]` Termine
- `[!]` Bloque (prerequis manquant ou decision necessaire)

---

## 2. Phase 1 — Urgences (S13)

> Priorite maximale. Problemes bloquants pour le business et la conformite legale.
> **Objectif** : site fonctionnel et conforme en fin de semaine.

### 2.1 Formulaire de contact fonctionnel

Le formulaire actuel pointe vers un placeholder Formspree et simule un faux succes. Aucun message n'est transmis.

| # | Tache | Fichier(s) | Statut |
|---|-------|------------|--------|
| 1.1 | Creer un Google Form pour le formulaire de contact (champs : nom, email, sujet, message) | Google Workspace | `[x]` |
| 1.2 | Remplacer le `<form>` Formspree par une integration Google Forms (iframe ou redirect) dans `index.html` | `index.html` | `[x]` |
| 1.3 | Supprimer le code JS de soumission simulee (`setTimeout` + `fetch` commente) dans `initContactForm()` | `js/main.js` | `[x]` |
| 1.4 | Supprimer le code Calendly residuel commente dans la section contact | `index.html` | `[x]` |

### 2.2 Conformite legale

Absence de mentions legales et de politique de confidentialite — obligation legale LCEN et RGPD.

> **`🔁 loop`** — Les pages legales sont des pages entieres a generer. Utiliser `stitch-loop` pour enchainer :
> 1. Ecrire le baton `.stitch/next-prompt.md` avec `page: mentions-legales`
> 2. Generer la page, l'integrer, puis le baton passera automatiquement a `politique-confidentialite`
>
> **`🎨 ui-design`** — Crafter le prompt Stitch en incluant : fond bleu nuit, glassmorphism card pour le contenu textuel, bande degradee signature en haut, footer coherent avec le site existant.

| # | Tache | Fichier(s) | Stitch | Statut |
|---|-------|------------|--------|--------|
| 1.5 | `🎨` Prototyper le design des pages legales via Stitch (fond sombre, glass card contenu, typographie coherente) | `.stitch/designs/` | `ui-design` | `[x]` |
| 1.6 | `🔁` Generer `mentions-legales.html` (raison sociale, SIRET, hebergeur, directeur de publication) | `mentions-legales.html` | `loop` | `[x]` |
| 1.7 | `🔁` Generer `politique-confidentialite.html` (finalites, base legale, duree de conservation, droits RGPD) | `politique-confidentialite.html` | `loop` | `[x]` |
| 1.8 | Mettre a jour les liens du footer sur les 3 pages (`index.html`, `blog.html`, `article.html`) pour pointer vers les nouvelles pages | `index.html`, `blog.html`, `article.html` | — | `[x]` |
| 1.9 | Mettre a jour le copyright footer de 2025 a 2026 sur les 3 pages | `index.html`, `blog.html`, `article.html` | — | `[x]` |

### 2.3 Liens morts et incoherences

| # | Tache | Fichier(s) | Stitch | Statut |
|---|-------|------------|--------|--------|
| 1.10 | Corriger les liens LinkedIn et GitHub dans le footer (pointer vers les vrais profils comme dans la section contact) sur les 3 pages | `index.html`, `blog.html`, `article.html` | — | `[x]` |
| 1.11 | Supprimer le `target="_blank"` sur le lien blog interne dans la section contact | `index.html` | — | `[x]` |

---

## 3. Phase 2 — SEO & Metadonnees (S14)

> Visibilite sur les moteurs de recherche et les reseaux sociaux.

### 3.1 Open Graph et Twitter Cards

| # | Tache | Fichier(s) | Statut |
|---|-------|------------|--------|
| 2.1 | Creer une image OG officielle (1200x630px) a partir de la banniere hero | `images/og-image.png` | `[x]` |
| 2.2 | Ajouter les balises `og:image`, `og:image:width`, `og:image:height` sur `index.html` | `index.html` | `[x]` |
| 2.3 | Ajouter les balises Twitter Card (`twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`) sur `index.html` | `index.html` | `[x]` |
| 2.4 | Ajouter les meta OG et Twitter dynamiques dans `blog.html` et `article.html` (via JS pour article) | `blog.html`, `article.html`, `js/blog.js` | `[x]` |

### 3.2 Indexation et crawl

| # | Tache | Fichier(s) | Statut |
|---|-------|------------|--------|
| 2.5 | Creer `robots.txt` (Allow all, lien vers sitemap) | `robots.txt` | `[x]` |
| 2.6 | Creer `sitemap.xml` (pages statiques + articles blog) | `sitemap.xml` | `[x]` |
| 2.7 | Ajouter `<link rel="canonical">` sur chaque page | `index.html`, `blog.html`, `article.html` | `[x]` |

### 3.3 Donnees structurees

| # | Tache | Fichier(s) | Statut |
|---|-------|------------|--------|
| 2.8 | Ajouter un bloc JSON-LD `Organization` dans `index.html` (nom, logo, url, sameAs) | `index.html` | `[x]` |

### 3.4 Contenu blog

| # | Tache | Fichier(s) | Statut |
|---|-------|------------|--------|
| 2.9 | Renseigner le champ `description` dans le front-matter YAML de chaque article, puis regenerer `posts/index.json` | `posts/*.md`, `posts/index.json` | `[x]` |

---

## 4. Phase 3 — Securite & Performance (S14-S15)

> Securisation des dependances externes et optimisation du chargement.

### 4.1 Securite des scripts

| # | Tache | Fichier(s) | Statut |
|---|-------|------------|--------|
| 3.1 | Ajouter les attributs `integrity` et `crossorigin="anonymous"` sur les 3 scripts CDN (marked.js, highlight.js, marked-highlight) | `article.html` | `[x]` |
| 3.2 | Ajouter `rel="noopener noreferrer"` sur tous les liens `target="_blank"` du footer (3 pages) | `index.html`, `blog.html`, `article.html` | `[x]` |

### 4.2 Performance chargement

| # | Tache | Fichier(s) | Statut |
|---|-------|------------|--------|
| 3.3 | Remplacer `@import url(...)` Google Fonts dans CSS par `<link rel="preconnect">` + `<link rel="stylesheet">` dans le `<head>` HTML | `css/styles.css`, `index.html`, `blog.html`, `article.html` | `[x]` |
| 3.4 | Ajouter `font-display: swap` dans l'URL Google Fonts | `index.html`, `blog.html`, `article.html` | `[x]` |
| 3.5 | Deplacer le `<link>` CSS Google Calendar du `<body>` vers le `<head>` | `index.html` | `[x]` |
| 3.6 | Ajouter `loading="lazy"` sur les images non-critiques et `fetchpriority="high"` sur la banniere hero | `index.html` | `[x]` |

### 4.3 Performance runtime

| # | Tache | Fichier(s) | Statut |
|---|-------|------------|--------|
| 3.7 | Desactiver le canvas particules sur mobile via `matchMedia('(max-width: 768px)')` ou `matchMedia('(prefers-reduced-motion: reduce)')` | `js/main.js` | `[x]` |
| 3.8 | Convertir les images PNG en WebP avec fallback (banner-hero, logos) et ajouter `width`/`height` explicites sur chaque `<img>` | `images/`, `index.html`, `blog.html`, `article.html` | `[x]` |

---

## 5. Phase 4 — Design & Credibilite (S15-S16)

> Renforcement de l'image professionnelle et de la preuve sociale.
> **Cette phase est la plus assistee par Stitch** — prototypage visuel de chaque composant avant implementation.

### 5.1 Icones et assets visuels

> **`🎨 ui-design`** — Generer des variantes de la grille Services et Technologies avec des icones SVG/geometriques au lieu d'emojis. Inclure dans le prompt : "icones geometriques monochromes style line-art, coherentes avec un design institutionnel dark mode, palette Cyan/Violet/Vert."

| # | Tache | Fichier(s) | Stitch | Statut |
|---|-------|------------|--------|--------|
| 4.1 | `🎨` Prototyper via Stitch les sections Services et Technologies avec icones SVG (generer 2-3 variantes) | `.stitch/designs/` | `ui-design` | `[ ]` |
| 4.2 | Implementer la variante retenue : remplacer les emojis par des icones SVG dans Services, Technologies et Contact | `index.html`, `css/styles.css` | — | `[ ]` |
| 4.3 | Mettre a jour les emojis du blog engine (emojiMap dans `blog.js`) par des icones SVG correspondantes | `js/blog.js`, `css/blog.css` | — | `[ ]` |

### 5.2 Preuve sociale

> **`🎨 ui-design`** — Prototyper la section temoignages : "Section temoignages clients sur fond bleu nuit #0A1E3F avec glass cards contenant citation, nom, poste, entreprise. Disposition en carrousel ou grille 3 colonnes. Style institutionnel, sobre, avec accent degradé Cyan→Violet en bordure haute des cards."

| # | Tache | Fichier(s) | Stitch | Statut |
|---|-------|------------|--------|--------|
| 4.4 | `🎨` Prototyper via Stitch une section temoignages clients (variantes : carrousel vs grille, avec/sans photo) | `.stitch/designs/` | `ui-design` | `[ ]` |
| 4.5 | Integrer les vrais logos SVG/PNG des references clients (Enedis, Thales, Orange, Bouygues Telecom, Sagemcom) dans le carrousel | `index.html`, `images/` | — | `[!]` |
| 4.6 | Remplacer l'emoji avatar de la section Expertise par une photo professionnelle du fondateur | `index.html`, `images/` | — | `[!]` |
| 4.7 | Implementer la section temoignages clients retenue (2-3 citations) | `index.html`, `css/styles.css` | — | `[!]` |

> **Note** : les taches 4.5, 4.6 et 4.7 sont bloquees en attente d'assets (logos, photo, citations). Le prototypage Stitch (4.4) peut etre fait en amont avec du contenu placeholder pour valider le design.

### 5.3 Integration Google Calendar

> **`🎨 ui-design`** — Prototyper le bouton RDV integre au design system : "Bouton CTA avec gradient Cyan→Violet, texte 'Reserver un rendez-vous', font Montserrat bold, border-radius 20px, glow effect subtil."

| # | Tache | Fichier(s) | Stitch | Statut |
|---|-------|------------|--------|--------|
| 4.8 | `🎨` Prototyper via Stitch le bouton Google Calendar style Azeka (variantes de style CTA) | `.stitch/designs/` | `ui-design` | `[ ]` |
| 4.9 | Implementer le style du bouton Google Calendar Appointment (gradient, font, glow) | `css/styles.css`, `index.html` | — | `[ ]` |
| 4.10 | Synchroniser la charte documentee (`doc-charte-logo/charte_graphique_azeka_consulting.md`) avec la palette CSS reelle (V2) | `doc-charte-logo/charte_graphique_azeka_consulting.md` | — | `[ ]` |

---

## 6. Phase 5 — Accessibilite (S16-S17)

> Conformite WCAG 2.1 niveau AA.

| # | Tache | Fichier(s) | Statut |
|---|-------|------------|--------|
| 5.1 | Augmenter le contraste de `--text-muted` (#5a7090 → ~#7A90AD ou plus clair) pour atteindre le ratio 4.5:1 | `css/styles.css` | `[ ]` |
| 5.2 | Ajouter une media query `prefers-reduced-motion: reduce` pour desactiver toutes les animations (canvas, fade-in, float, counters) | `css/styles.css`, `js/main.js` | `[ ]` |
| 5.3 | Ajouter des styles `:focus-visible` sur tous les elements interactifs (liens, boutons, inputs) | `css/styles.css` | `[ ]` |
| 5.4 | Ajouter `aria-hidden="true"` sur le canvas particules et les elements purement decoratifs | `index.html` | `[ ]` |
| 5.5 | Ajouter un lien "Skip to content" en haut de chaque page | `index.html`, `blog.html`, `article.html`, `css/styles.css` | `[ ]` |
| 5.6 | Lier les messages d'erreur du formulaire aux champs via `aria-describedby` et ajouter `aria-invalid` sur les champs en erreur | `index.html`, `js/main.js` | `[ ]` |

---

## 7. Phase 6 — UX & Navigation (S17)

> Ameliorations de l'experience utilisateur.
> **`🎨 ui-design`** utile pour prototyper les composants visuels (back-to-top, tech categories, boutons partage) avant implementation.

| # | Tache | Fichier(s) | Stitch | Statut |
|---|-------|------------|--------|--------|
| 6.1 | Ajouter un scroll-spy sur la navigation (marquer la section active dans la navbar) | `js/main.js`, `css/styles.css` | — | `[ ]` |
| 6.2 | `🎨` Prototyper via Stitch le bouton "back to top" et la barre CTA sticky mobile (variantes de position et style) | `.stitch/designs/` | `ui-design` | `[ ]` |
| 6.3 | Implementer le bouton "back to top" flottant | `index.html`, `css/styles.css`, `js/main.js` | — | `[ ]` |
| 6.4 | Dynamiser les cartes blog de la page d'accueil (charger les 3 derniers articles depuis `posts/index.json` au lieu du HTML en dur) | `index.html`, `js/main.js` | — | `[ ]` |
| 6.5 | `🎨` Prototyper via Stitch le regroupement des technologies par categorie (Cloud, IA/LLM, Data, Orchestration, Frontend) avec sous-titres et separateurs | `.stitch/designs/` | `ui-design` | `[ ]` |
| 6.6 | Implementer le regroupement des technologies par categorie | `index.html`, `css/styles.css` | — | `[ ]` |
| 6.7 | `🎨` Prototyper via Stitch les boutons de partage social pour les articles (LinkedIn, Twitter, copier le lien) | `.stitch/designs/` | `ui-design` | `[ ]` |
| 6.8 | Implementer les boutons de partage social sur les articles | `article.html`, `js/blog.js`, `css/blog.css` | — | `[ ]` |

---

## 8. Phase 7 — Evolutions futures (backlog)

> Ameliorations non urgentes, a planifier selon les priorites business.

| # | Tache | Stitch | Statut | Notes |
|---|-------|--------|--------|-------|
| 7.1 | Migrer vers un SSG (Astro ou 11ty) pour le rendu statique des articles (SEO) | — | `[ ]` | Permettrait l'indexation native des articles par les moteurs |
| 7.2 | `🔁` Version anglaise du site (i18n) — utiliser stitch-loop pour generer chaque page traduite iterativement | `loop` | `[ ]` | Coherent avec le positionnement Europe-Afrique. Le baton enchaine : index-en → services-en → about-en → ... |
| 7.3 | PWA : manifest.json + service worker (cache offline) | — | `[ ]` | Amelioration UX sur mobile |
| 7.4 | Chatbot IA conversationnel (widget) | — | `[ ]` | Engagement visiteur, demo du savoir-faire |
| 7.5 | Newsletter / Lead magnet (livre blanc, guide) | — | `[ ]` | Generation de leads |
| 7.6 | `🎨` `🔁` Page 404 personnalisee — prototyper avec ui-design puis generer avec loop | `ui-design` + `loop` | `[ ]` | UX. Prompt Stitch : "page 404 dark mode, illustration geometrique, message d'erreur elegante, CTA retour accueil" |
| 7.7 | Ajouter un outil analytics (Plausible, GA4) avec consentement cookies | — | `[ ]` | Mesure et conformite |

---

## Annexe A : Fichiers principaux impactes

| Fichier | Phases concernees |
|---------|-------------------|
| `index.html` | 1, 2, 3, 4, 5, 6 |
| `blog.html` | 1, 2, 3, 5 |
| `article.html` | 1, 2, 3, 5, 6 |
| `css/styles.css` | 4, 5, 6 |
| `css/blog.css` | 4, 6 |
| `js/main.js` | 1, 3, 5, 6 |
| `js/blog.js` | 4, 6 |
| `posts/*.md` | 2 |
| `images/` | 3, 4 |
| Nouveaux fichiers | `mentions-legales.html`, `politique-confidentialite.html`, `robots.txt`, `sitemap.xml`, `images/og-image.png` |

## Annexe B : Recapitulatif des taches Stitch

| # | Tache | Skill | Phase |
|---|-------|-------|-------|
| 0.1–0.4 | Prerequis : activer skills, creer projet, DESIGN.md, SITE.md | `setup` | 0 |
| 1.5 | Prototyper le design des pages legales | `🎨 ui-design` | 1 |
| 1.6 | Generer `mentions-legales.html` | `🔁 loop` | 1 |
| 1.7 | Generer `politique-confidentialite.html` | `🔁 loop` | 1 |
| 4.1 | Prototyper sections Services/Technologies avec icones SVG | `🎨 ui-design` | 4 |
| 4.4 | Prototyper section temoignages clients | `🎨 ui-design` | 4 |
| 4.8 | Prototyper bouton Google Calendar style Azeka | `🎨 ui-design` | 4 |
| 6.2 | Prototyper bouton back-to-top et CTA sticky mobile | `🎨 ui-design` | 6 |
| 6.5 | Prototyper regroupement technologies par categorie | `🎨 ui-design` | 6 |
| 6.7 | Prototyper boutons de partage social articles | `🎨 ui-design` | 6 |
| 7.2 | Generer les pages de la version anglaise (i18n) | `🔁 loop` | 7 |
| 7.6 | Prototyper + generer la page 404 | `🎨 ui-design` + `🔁 loop` | 7 |

**Total** : 15 taches assistees par Stitch (8 prototypage `🎨`, 4 generation `🔁`, 3 mixtes/setup)
