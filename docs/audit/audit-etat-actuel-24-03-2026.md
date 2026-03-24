# Audit du site vitrine Azeka Consulting

**Date** : 24 mars 2026
**URL** : www.azeka-consulting.com
**Branche** : `feature/version-officielle-23-02-2026`
**Auditeur** : Claude Code (analyse statique du code source)

---

## 1. Synthese globale

| Domaine | Note | Verdict |
|---------|------|---------|
| Design & Identite visuelle | 7/10 | Solide, quelques incoherences |
| Architecture technique | 7/10 | Simple et efficace, quelques lacunes |
| SEO & Meta | 5/10 | Insuffisant |
| Performance | 6/10 | Correcte, optimisable |
| Securite | 4/10 | Failles a corriger |
| Accessibilite (a11y) | 4/10 | Non conforme WCAG |
| Navigation & UX | 7/10 | Bonne structure, details a polir |
| Blog | 7/10 | Fonctionnel, manque de contenu |
| Formulaire & RDV | 3/10 | Non fonctionnel |
| Conformite legale | 2/10 | Non conforme |
| Bonnes pratiques landing pages 2026 | 6/10 | Base solide, ecarts importants |

---

## 2. Design & Identite visuelle

### Points forts

- **Charte graphique coherente** : palette CSS V2 bien structuree via custom properties (`--bg-primary`, `--accent-green`, etc.), facilitant la maintenance et l'evolution.
- **Glassmorphism maitrise** : les `.glass-card` avec `backdrop-filter: blur()` et bordures subtiles donnent un rendu premium sans surcharge.
- **Typographie de qualite** : Montserrat pour les titres, Sora pour le corps. Hierarchie visuelle claire avec `clamp()` pour le responsive.
- **Animations mesurees** : `fade-in`, `stagger`, compteurs animes, particules canvas — l'effet est sophistique sans etre distrayant.
- **Dark mode natif** : le fond bleu nuit (#0A1E3F) avec texte clair est un choix fort et coherent avec le positionnement premium.
- **Degradre signature** : le gradient Cyan/Violet/Vert est utilise comme fil conducteur (bandes, boutons, texte) et renforce l'identite.

### Points faibles

- **Emojis comme icones** : les icones de services, technologies et contact utilisent des emojis Unicode (ex: `card-icon` emoji). Le rendu varie selon l'OS et le navigateur — incompatible avec l'exigence institutionnelle de la charte. Des icones SVG custom ou une icon font (Lucide, Phosphor) seraient plus professionnelles.
- **Pas de vrais logos clients** : la section "References" affiche les noms en texte (ENEDIS, THALES, etc.) au lieu de logos. Pour un cabinet qui cible des grands comptes, les logos sont un puissant signal de confiance.
- **Avatar placeholder** : la section "Expertise/A propos" utilise un emoji `hands-on-keyboard` au lieu d'une vraie photo du fondateur. Pour un cabinet de conseil personnel, c'est un manque de credibilite.
- **Hero : image banniere non optimisee** : `banner-hero.png` est la seule image significative, sans `srcset` ni format WebP/AVIF. Pas de `width`/`height` explicites sur `<img>`.
- **Incoherence palette / charte** : la charte officielle (`doc-charte-logo/charte_graphique_azeka_consulting.md`) definit `#0F1B2E` comme fond principal et `#174A9C` comme Bleu Europe, mais le CSS utilise `#0A1E3F` et `#1C5CFF`. La palette a evolue sans mise a jour de la charte.
- **Bouton Google Calendar** : le bouton de prise de RDV utilise le style Google par defaut (`color: '#039BE5'`) qui jure avec la charte du site. Il n'est pas style pour correspondre au design system.

### Recommandations prioritaires

1. Remplacer tous les emojis d'icones par des SVG coherents avec la charte
2. Integrer les vrais logos des references clients
3. Ajouter une photo professionnelle du fondateur
4. Synchroniser la charte documentee avec la palette CSS reelle

---

## 3. Architecture technique

### Points forts

- **Zero build step** : HTML/CSS/JS statique servi directement via GitHub Pages. Deploiement instantane, zero complexite d'infrastructure.
- **Separation des responsabilites** : `main.js` (landing) et `blog.js` (blog) sont distincts. Le CSS est decoupe en `styles.css` (design system) et `blog.css` (specifique blog).
- **Design system CSS** : variables custom bien organisees (couleurs, spacing, radius, transitions) permettant de changer la charte en un seul endroit.
- **Blog engine clever** : rendu Markdown cote client avec marked.js, index JSON genere par un script Node — elegant pour un site statique sans SSG.
- **Animations performantes** : utilisation de `IntersectionObserver` pour les animations scroll (pas de `scroll` event handlers lourds), `requestAnimationFrame` pour le canvas.
- **Responsive bien implemente** : breakpoints a 1024px, 768px et 480px avec des adaptations coherentes.

### Points faibles

- **Canvas particules** : l'algorithme `drawConnections()` est en O(n^2) — boucle imbriquee sur toutes les paires de particules. Avec 120 particules, cela fait ~7000 calculs de distance par frame. Impact GPU/batterie sur mobile.
- **Pas de lazy loading** : les images, scripts externes (marked.js, highlight.js, Google Calendar) sont charges de maniere synchrone ou sans attribut `loading="lazy"`.
- **Duplication navbar/footer** : la navigation et le footer sont dupliques dans `index.html`, `blog.html` et `article.html`. Toute modification doit etre faite 3 fois manuellement.
- **Pas de minification** : CSS et JS sont servis en clair, sans minification ni concatenation.
- **Pas de service worker** : pas de cache offline ni de strategie PWA.
- **Google Fonts bloquant** : `@import url(...)` dans le CSS est render-blocking. Devrait utiliser `<link rel="preload">` ou `font-display: swap`.

### Recommandations prioritaires

1. Desactiver le canvas particules sur mobile (ou le simplifier considerablement)
2. Ajouter `loading="lazy"` sur les images et `async`/`defer` sur les scripts
3. Preloader les fonts avec `<link rel="preconnect">` et `font-display: swap`

---

## 4. SEO & Metadonnees

### Points forts

- Meta `description` et `keywords` presentes sur `index.html`
- Balises Open Graph (`og:title`, `og:description`, `og:type`, `og:url`)
- `<html lang="fr">` present sur toutes les pages
- Titres semantiques (`h1`, `h2`, `h3`) bien hierarchises

### Points faibles critiques

- **Pas de `og:image`** : les partages sur LinkedIn/Twitter/Facebook n'auront pas de vignette. Pour un cabinet de conseil B2B, c'est un manque majeur de visibilite.
- **`article.html` : meta description vide** : `<meta name="description" content="">`. Chaque article devrait avoir sa propre description dynamique.
- **Pas de balises Twitter Card** : `twitter:card`, `twitter:title`, `twitter:description` absents.
- **Pas de `canonical`** : aucune balise `<link rel="canonical">` — risque de contenu duplique.
- **Pas de `sitemap.xml`** : aucun sitemap pour les moteurs de recherche.
- **Pas de `robots.txt`** : aucune directive de crawl.
- **Pas de JSON-LD / Schema.org** : pas de donnees structurees (Organization, Article, BreadcrumbList). Cela empeche les rich snippets dans Google.
- **Blog non indexable** : le contenu des articles est genere cote client via JS. Les crawlers (meme Googlebot) peuvent avoir du mal a indexer le contenu Markdown rendu dynamiquement.
- **URLs non semantiques** : `article.html?slug=xxx` au lieu de `/blog/xxx` ou `/articles/xxx`. Les URLs avec query params sont moins bien classees.
- **Pas de balises `alt` descriptives** : le logo a `alt="Azeka Consulting"` (correct) mais la banniere hero a un alt generique.
- **Articles sans `description`** : dans `posts/index.json`, les 3 articles ont `"description": ""`. Les cartes blog et le SEO en souffrent.

### Recommandations prioritaires

1. Ajouter `og:image` et Twitter Cards sur toutes les pages
2. Generer un `sitemap.xml` (script ou plugin GitHub Actions)
3. Creer un `robots.txt`
4. Ajouter des donnees structurees JSON-LD (Organization + Article)
5. Renseigner les `description` dans le front-matter de chaque article
6. Considerer une generation statique des articles pour le SEO (SSG)

---

## 5. Performance

### Points forts

- Zero framework JS, zero bundler — le site est leger par nature
- CSS custom properties evitent la duplication de valeurs
- `passive: true` sur les scroll listeners
- `IntersectionObserver` pour le lazy-render des animations

### Points faibles

- **Canvas particules sur mobile** : animation plein ecran permanente, consommation CPU/GPU significative, drain batterie.
- **Google Fonts via `@import`** : bloque le rendu du CSS le temps de telecharger les polices.
- **Pas de preconnect** : pas de `<link rel="preconnect" href="https://fonts.googleapis.com">`.
- **CDN externe sans SRI** : marked.js, highlight.js et marked-highlight sont charges depuis cdn.jsdelivr.net sans attribut `integrity` (Subresource Integrity).
- **Images non optimisees** : uniquement du PNG, pas de WebP/AVIF. Pas de `srcset` pour le responsive. Pas de `width`/`height` explicites (CLS potentiel).
- **Pas de cache headers** : GitHub Pages gere le cache basiquement, mais pas de controle fin (immutable assets, versioning).

### Metriques estimees (analyse statique)

| Metrique | Estimation | Cible |
|----------|-----------|-------|
| FCP (First Contentful Paint) | ~1.5-2.5s | < 1.8s |
| LCP (Largest Contentful Paint) | ~2.5-4s (banner-hero.png) | < 2.5s |
| CLS (Cumulative Layout Shift) | ~0.05-0.15 (images sans dimensions) | < 0.1 |
| TBT (Total Blocking Time) | ~200-400ms (canvas + fonts) | < 200ms |

### Recommandations prioritaires

1. Convertir les images en WebP avec fallback PNG
2. Ajouter `width`/`height` sur toutes les `<img>` pour eviter le CLS
3. Preconnect les domaines externes (fonts, CDN)
4. Desactiver/simplifier le canvas sur mobile (`matchMedia`)

---

## 6. Securite

### Problemes critiques

- **Formulaire non fonctionnel et non securise** :
  - L'action pointe vers `https://formspree.io/f/YOUR_FORM_ID` — un placeholder non remplace. Le formulaire ne fonctionne pas.
  - Le code JS `preventDefault()` bloque la soumission puis simule un succes avec `setTimeout` (mode demo). L'utilisateur croit avoir envoye un message mais rien n'arrive.
  - Le code de soumission `fetch()` reelle est commente.

- **Honeypot insuffisant** : le champ `_gotcha` avec `style="display:none"` est une protection anti-spam basique. Pas de CAPTCHA ni de rate limiting.

- **Scripts CDN sans SRI** (`article.html`) :
  ```html
  <script src="https://cdn.jsdelivr.net/npm/marked@12.0.2/marked.min.js"></script>
  ```
  Si le CDN est compromis, du code malveillant pourrait etre injecte. Il faut ajouter les attributs `integrity` et `crossorigin`.

- **Google Calendar script inline** : le script de scheduling est charge directement avec une URL d'appointment sans validation. Le `document.currentScript` est utilise correctement, mais le pattern `var target = document.currentScript` pourrait etre fragile.

- **Email expose en clair** : `contact@azeka-consulting.com` est directement dans le HTML — cible facile pour les scrapers de spam.

- **Liens sociaux incomplets dans le footer** :
  ```html
  <a href="https://linkedin.com/" target="_blank">LinkedIn</a>
  <a href="https://github.com/" target="_blank">GitHub</a>
  ```
  Ces liens pointent vers les pages d'accueil generiques de LinkedIn et GitHub, pas vers les profils reels. Dans la section contact (plus haut), les bons liens sont presents — incoherence.

- **Pas de Content Security Policy** : aucun header CSP. Le site charge des scripts depuis des CDN externes et Google Calendar sans restriction.

- **Pas de `rel="noopener noreferrer"`** sur certains liens externes : present sur certains (`rel="noopener"` dans la section contact) mais absent dans le footer.

### Recommandations prioritaires

1. **Remplacer le formulaire placeholder par une integration Google Forms fonctionnelle** (conformement a la decision Google Workspace)
2. Ajouter les attributs `integrity` et `crossorigin="anonymous"` sur tous les scripts CDN
3. Corriger les liens LinkedIn et GitHub dans le footer
4. Envisager une protection anti-spam plus robuste (reCAPTCHA v3 ou Turnstile Cloudflare)

---

## 7. Navigation & UX

### Points forts

- **Navigation fixe sticky** : la navbar se transforme avec glassmorphism au scroll (`scrolled` class). Effet premium et fonctionnel.
- **Smooth scroll** : navigation fluide entre les sections avec compensation de la hauteur de la navbar.
- **Menu mobile** : hamburger anine correctement, overlay plein ecran, fermeture automatique au clic sur un lien.
- **CTA bien positionnes** : double CTA dans le hero ("Contactez-nous" primary + "Decouvrir nos services" secondary). CTA "Contactez-nous" persistant dans la navbar.
- **Blog : recherche et filtres** : barre de recherche avec debounce, filtrage par tags, pagination — experience blog complete.
- **Article : TOC sidebar** : table des matieres sticky avec tracking de la position de lecture via IntersectionObserver. Navigation prev/next entre articles.
- **Animations d'entree progressives** : les sections apparaissent avec des animations stagger au scroll, guidant l'oeil.

### Points faibles

- **Pas de "back to top"** : sur une landing page longue (7 sections), il manque un bouton de retour en haut.
- **Pas d'etat actif dans la navigation** : quand l'utilisateur scrolle vers "Services", le lien "Services" dans la navbar n'est pas mis en surbrillance. Pas de scroll-spy.
- **Lien "Mentions legales" et "Politique de confidentialite"** : pointent vers `#` — pages inexistantes.
- **Hero stats en commentaire** : le troisieme compteur "15 Clients" est commente (`<!--div class="hero-stat">`). L'espace visuel est desequilibre avec seulement 2 stats.
- **Hero : image banniere cliquable** : la banniere est enveloppee dans un `<a href="#contact">` sans indication visuelle. L'utilisateur ne sait pas qu'elle est cliquable.
- **Blog cards en dur dans index.html** : les 3 cartes blog de la page d'accueil sont codees en dur. Si de nouveaux articles sont ajoutes, la page d'accueil ne se met pas a jour automatiquement.
- **Footer : lien blog interne en `target="_blank"`** : le lien blog dans la section contact ouvre un nouvel onglet pour une page du meme site — comportement inattendu.
- **Section Technologies : pas de regroupement** : les 20 technologies sont affichees en grille plate sans categorisation (Cloud, IA, Data, Orchestration). Difficile de scanner rapidement.

### Recommandations prioritaires

1. Ajouter un scroll-spy pour marquer la section active dans la nav
2. Ajouter un bouton "back to top"
3. Dynamiser les cartes blog de la page d'accueil via JS (lecture de `posts/index.json`)
4. Supprimer les liens morts (mentions legales) ou creer les pages

---

## 8. Blog

### Points forts

- **Moteur blog complet** sans framework : recherche full-text, filtrage par tags, pagination, rendu Markdown avec coloration syntaxique.
- **Table des matieres automatique** : generee a partir des headings H2/H3, sticky, avec tracking scroll.
- **Navigation prev/next** entre articles.
- **Front-matter YAML** simple et efficace pour les metadonnees.
- **Script `update-index.js`** pour regenerer le manifeste automatiquement.

### Points faibles

- **Seulement 3 articles** : contenu insuffisant pour un blog technique qui vise le SEO et la credibilite.
- **Articles sans description** : le champ `description` est vide dans `index.json` pour les 3 articles. Les cartes blog n'ont donc pas de texte descriptif venant du manifeste.
- **Pas de partage social** : pas de boutons de partage LinkedIn/Twitter/email sur les articles.
- **Pas de temps de lecture dynamique** : le `readTime` est en dur dans le front-matter au lieu d'etre calcule automatiquement (le script le calcule mais ne l'utilise que comme fallback).
- **Pas de RSS/Atom feed** : pas de flux pour les lecteurs RSS ni pour les agrregateurs.
- **SEO des articles** : contenu genere cote client via JS, potentiellement invisible pour les crawlers.
- **Pas de systeme de commentaires** : pas d'engagement lecteur.
- **Font 'Inter' et 'Outfit' non chargees** : `blog.css` reference `font-family: 'Inter'` et `font-family: 'Outfit'` mais seules Montserrat et Sora sont importees dans `styles.css`.

### Recommandations prioritaires

1. Renseigner les `description` de chaque article
2. Ajouter des boutons de partage social
3. Generer un flux RSS/Atom
4. Charger les fonts Inter et Outfit ou aligner le CSS sur Sora/Montserrat

---

## 9. Formulaire de contact & Prise de RDV

### Etat actuel : NON FONCTIONNEL

#### Formulaire de contact

- **Action placeholder** : `action="https://formspree.io/f/YOUR_FORM_ID"` — jamais remplace.
- **Soumission simulee** : le JS intercepte le submit, valide les champs, puis affiche un faux message de succes apres 1.5s. **Aucune donnee n'est envoyee nulle part.** C'est le probleme le plus critique du site.
- **Validation client-side uniquement** : pas de validation serveur (normal pour un site statique, mais le backend Formspree n'est meme pas connecte).
- **Protection anti-spam minimale** : un seul champ honeypot `_gotcha`.

#### Prise de rendez-vous

- **Google Calendar Appointment Scheduling** : integre via le script officiel Google. Le lien d'appointment est reel et fonctionnel.
- **Style non integre** : le bouton utilise le style Google par defaut (bleu `#039BE5`), deconnecte du design system du site.
- **Script charge dans le `<body>`** : le `<link>` CSS de Google Calendar est place au milieu du `<body>` (dans la section contact) au lieu du `<head>` — non standard et peut causer du FOUC.
- **L'ancien lien Calendly est commente** mais encore present dans le code source.

### Decision strategique : Migration Google Workspace Starter

Conformement a la decision du projet, les deux solutions doivent migrer vers Google Workspace :

| Fonction | Actuel | Cible |
|----------|--------|-------|
| Formulaire contact | Formspree (placeholder, non fonctionnel) | Google Forms (iframe ou endpoint) |
| Prise de RDV | Google Calendar Appointment (partiellement integre) | Google Calendar Appointment (a styler) |

### Recommandations prioritaires

1. **URGENT** : rendre le formulaire de contact fonctionnel (Google Forms)
2. Styler le bouton Google Calendar pour l'integrer au design system
3. Deplacer le `<link>` CSS Google Calendar dans le `<head>`
4. Supprimer le code Formspree et Calendly residuels

---

## 10. Conformite legale

### Problemes critiques

- **Pas de page "Mentions legales"** : obligatoire en France pour tout site professionnel (loi pour la confiance dans l'economie numerique — LCEN). Le lien existe dans le footer mais pointe vers `#`.
- **Pas de page "Politique de confidentialite"** : obligatoire des qu'il y a un formulaire de contact ou tout traitement de donnees personnelles (RGPD). Le lien existe mais pointe vers `#`.
- **Pas de banniere de cookies / consentement** : le site charge des scripts tiers (Google Calendar, Google Fonts, cdn.jsdelivr.net) qui peuvent poser des cookies. Une banniere de consentement est obligatoire (RGPD / directive ePrivacy).
- **Copyright 2025** : le footer affiche `(c) 2025 Azeka Consulting` alors que nous sommes en 2026.
- **Pas de CGV** : si le site propose des prestations de conseil, des Conditions Generales de Vente peuvent etre requises.
- **Pas de numero SIRET** : les mentions legales d'une entreprise francaise doivent inclure le SIRET, la forme juridique, le capital social, etc.

### Recommandations prioritaires

1. **URGENT** : creer une page Mentions legales avec les informations legales obligatoires
2. **URGENT** : creer une page Politique de confidentialite RGPD
3. Mettre en place une banniere de consentement cookies
4. Mettre a jour le copyright a 2026

---

## 11. Comparaison aux tendances Landing Pages 2026

### Ce qui est conforme

| Tendance | Implementation |
|----------|---------------|
| Dark mode premium | Oui — fond bleu nuit, glassmorphism |
| Animations scroll | Oui — IntersectionObserver, fade-in stagger |
| Gradients et couleurs vives | Oui — palette Cyan/Violet/Vert distinctive |
| Typography hierarchy | Oui — clamp(), Google Fonts modernes |
| Mobile-first responsive | Oui — 3 breakpoints, menu hamburger |
| Single-page avec sections | Oui — hero > services > expertise > tech > refs > blog > contact |
| CTA multiples | Oui — hero double CTA, nav CTA, section contact |
| Social proof | Partiellement — noms de references sans logos |
| Blog integre | Oui — blog complet avec recherche |

### Ce qui manque par rapport aux meilleures pratiques

| Tendance 2026 | Statut | Impact |
|---------------|--------|--------|
| Video hero ou micro-interactions avancees | Absent | Les top sites B2B utilisent des videos ou des animations Lottie dans le hero |
| Temoignages clients avec citations | Absent | Aucun temoignage, aucune citation client — faible preuve sociale |
| Cas d'usage / Case studies | Absent | Les top cabinets de conseil publient des etudes de cas detaillees |
| Chatbot / Live chat | Absent | De plus en plus courant (widget IA conversationnel) |
| Speed & Core Web Vitals optimises | Partiel | Canvas particules et fonts bloquantes penalisent les scores |
| PWA / Offline | Absent | Pas de service worker ni de manifest.json |
| A11y WCAG 2.1 AA | Non conforme | Contraste, focus, ARIA, navigation clavier |
| Structured data / Rich snippets | Absent | Pas de JSON-LD |
| Multilingual (EN/FR) | Absent | Site uniquement en francais, pourtant positionnement Europe-Afrique |
| Analytics & tracking | Absent | Pas de Google Analytics, Plausible, ni aucun outil de mesure |
| CTA sticky mobile | Absent | Pas de barre CTA fixe en bas sur mobile |
| Newsletter / Lead magnet | Absent | Pas de formulaire d'inscription newsletter ni de livre blanc |
| Page 404 personnalisee | Absent | Pas de page 404 |

---

## 12. Accessibilite (a11y)

### Problemes identifies

- **Contraste** : le texte `--text-muted: #5a7090` sur fond `--bg-primary: #0A1E3F` a un ratio de contraste d'environ 2.8:1 — en dessous du minimum WCAG AA de 4.5:1 pour le texte normal.
- **Focus non visible** : pas de styles `:focus-visible` personnalises. Les utilisateurs clavier ne voient pas ou se trouve le focus.
- **Navigation clavier** : le menu mobile n'est pas accessible au clavier (pas de trap focus, pas de gestion `Escape`).
- **Images decoratives** : les emojis utilises comme icones n'ont pas de `role="img"` ni d'`aria-label`.
- **Canvas** : le canvas de particules n'a pas d'`aria-hidden="true"` — les lecteurs d'ecran essaieront de l'interpreter.
- **Formulaire** : les messages d'erreur utilisent `display:none` / `.visible` mais ne sont pas lies aux champs via `aria-describedby`.
- **Skip navigation** : pas de lien "skip to content" pour les utilisateurs de lecteur d'ecran.
- **Animations** : pas de `prefers-reduced-motion` media query pour desactiver les animations.

### Recommandations prioritaires

1. Augmenter le contraste du texte `--text-muted` (passer a ~#7A90AD)
2. Ajouter `prefers-reduced-motion` pour desactiver les animations
3. Ajouter `:focus-visible` sur tous les elements interactifs
4. Ajouter `aria-hidden="true"` sur le canvas et les elements decoratifs
5. Ajouter un lien "skip to content"

---

## 13. Plan d'action prioritaire

### Urgences (a faire immediatement)

| # | Action | Impact |
|---|--------|--------|
| 1 | **Rendre le formulaire de contact fonctionnel** (Google Forms) | Business-critical — perte de leads |
| 2 | **Creer les pages Mentions legales et Politique de confidentialite** | Obligation legale |
| 3 | **Corriger les liens morts** (footer LinkedIn/GitHub, mentions legales) | Credibilite |
| 4 | **Mettre a jour le copyright** a 2026 | Detail mais visible |

### Court terme (1-2 semaines)

| # | Action | Impact |
|---|--------|--------|
| 5 | Ajouter `og:image` et Twitter Cards | Visibilite reseaux sociaux |
| 6 | Ajouter `sitemap.xml` et `robots.txt` | SEO |
| 7 | Renseigner les `description` des articles | SEO + UX blog |
| 8 | Ajouter SRI sur les scripts CDN | Securite |
| 9 | Styler le bouton Google Calendar | Coherence visuelle |
| 10 | Ajouter `prefers-reduced-motion` | Accessibilite |

### Moyen terme (1 mois)

| # | Action | Impact |
|---|--------|--------|
| 11 | Remplacer les emojis par des icones SVG | Professionnalisme |
| 12 | Ajouter les logos clients reels | Social proof |
| 13 | Photo professionnelle du fondateur | Credibilite |
| 14 | Ajouter des temoignages / case studies | Conversion |
| 15 | Optimiser les images (WebP, srcset, dimensions) | Performance |
| 16 | Desactiver canvas sur mobile | Performance |
| 17 | Generer JSON-LD (Organization + Article) | SEO |
| 18 | Ajouter analytics (Plausible / GA4) | Mesure |
| 19 | Banniere de consentement cookies | Legal |
| 20 | Ameliorer l'accessibilite (contraste, focus, ARIA) | Inclusivite |

### Long terme (optionnel)

| # | Action | Impact |
|---|--------|--------|
| 21 | Envisager un SSG (Astro, 11ty) pour le SEO des articles | SEO |
| 22 | Version anglaise du site | Marche international |
| 23 | PWA avec service worker | UX offline |
| 24 | Chatbot IA conversationnel | Engagement |
| 25 | Newsletter / Lead magnet | Generation de leads |
| 26 | Page 404 personnalisee | UX |
| 27 | Scroll-spy nav + back-to-top | Navigation |

---

## 14. Conclusion

Le site Azeka Consulting presente une **base technique solide** et un **design premium** qui se demarque de la moyenne des sites de consulting. L'architecture statique sans build step est un choix judicieux pour la simplicite et la performance.

Cependant, **le formulaire de contact non fonctionnel est un probleme critique** — c'est le principal point de conversion du site et il ne fonctionne pas. Les lacunes en conformite legale (mentions legales, RGPD) representent un risque juridique reel.

Les axes d'amelioration les plus impactants a court terme sont :
1. Rendre le formulaire fonctionnel
2. Se mettre en conformite legale
3. Renforcer le SEO (meta, sitemap, structured data)
4. Enrichir la preuve sociale (logos, temoignages, photo du fondateur)

Le site a le potentiel de devenir une vitrine premium a la hauteur du positionnement "Ingenierie IA Europe-Afrique" d'Azeka Consulting.
