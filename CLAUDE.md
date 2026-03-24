# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Projet

Site vitrine et blog technique pour **Azeka Consulting**, cabinet de conseil en Data Engineering et IA. Le site est en français.
Production : www.azeka-consulting.com (GitHub Pages).

## Stack & Architecture

Site 100% statique — **aucun build step**, aucun framework, aucun bundler.

- **HTML5** : `index.html` (landing page), `blog.html` (listing), `article.html` (lecteur Markdown)
- **CSS3 vanilla** : `css/styles.css` (design system, variables CSS), `css/blog.css` (styles blog)
- **JS ES6+ vanilla** : `js/main.js` (animations, formulaire, menu mobile), `js/blog.js` (moteur blog client-side)
- **Blog** : articles Markdown dans `posts/` avec front-matter YAML, rendus côté client via marked.js v12 + highlight.js v11
- **Manifeste articles** : `posts/index.json` (généré par script)

## Commandes

```bash
# Serveur de développement (NE PAS utiliser -s, sinon SPA redirect casse blog/article)
npx -y serve . -p 3000

# Régénérer l'index des articles après ajout/modification d'un .md dans posts/
node scripts/update-index.js
```

## Workflow blog

1. Créer un fichier `.md` dans `posts/` avec front-matter YAML (title, description, date, tags, readTime, author)
2. Exécuter `node scripts/update-index.js` pour régénérer `posts/index.json`
3. Tester : `http://localhost:3000/article.html?slug=<nom-fichier-sans-extension>`

## Charte graphique

La charte visuelle est documentée dans `doc-charte-logo/`. Palette CSS V2 définie dans les custom properties de `css/styles.css` :

- Fond principal : `--bg-primary: #0A1E3F` (Bleu Nuit Spatial)
- Vert Afrique : `--accent-green: #39C27D` (CTA, racines)
- Bleu IA : `--accent-blue: #1C5CFF` (circuits, effets)
- Cyan IA : `--accent-cyan: #00D4FF`
- Violet IA : `--accent-violet: #8C3DFF`
- Texte : `--text-primary: #F2F4F7` (Blanc Institutionnel)
- Typographies : Montserrat / Sora (Google Fonts)

Le ton visuel doit rester géométrique, institutionnel, stratégique — pas d'esthétique startup ludique.

## Services externes (Google Workspace Starter)

- **Google Forms** : formulaire de contact (iframe ou lien intégré dans `index.html`)
- **Google Calendar — Prise de RDV** : planification de rendez-vous (lien de réservation intégré dans `index.html`)
