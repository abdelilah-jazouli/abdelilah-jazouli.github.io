# Azeka Consulting — Landing Page & Blog

Site vitrine et blog technique pour **Azeka Consulting**, cabinet de conseil indépendant spécialisé en **Data Engineering** et **Intelligence Artificielle**.

> 🔗 Production : [www.azeka-consulting.com](https://www.azeka-consulting.com)

---

## 🛠 Stack technique

| Couche | Technologie |
|--------|-------------|
| Structure | HTML5 sémantique |
| Styles | CSS3 vanilla (dark premium, glassmorphism, animations) |
| Logique | JavaScript ES6+ (vanilla, aucun framework) |
| Blog | Markdown côté client via [marked.js](https://marked.js.org/) v12 |
| Coloration code | [highlight.js](https://highlightjs.org/) v11 |
| Formulaire | [Formspree](https://formspree.io/) |
| RDV | [Calendly](https://calendly.com/) |
| Hébergement | GitHub Pages |

**Aucun build step** — le site est 100 % statique, directement servi depuis GitHub Pages.

---

## 📁 Structure du projet

```
azeka-landing-page/
├── index.html              # Page d'accueil (hero, services, expertise, contact…)
├── blog.html               # Page listing du blog (recherche, tags, pagination)
├── article.html            # Page lecteur d'article (rendu Markdown, TOC, nav)
├── css/
│   ├── styles.css          # Design system principal (variables, composants, responsive)
│   └── blog.css            # Styles spécifiques au blog
├── js/
│   ├── main.js             # Animations, formulaire contact, menu mobile
│   └── blog.js             # Moteur blog (recherche, tags, pagination, rendu MD)
├── posts/
│   ├── index.json          # Manifeste des articles (métadonnées)
│   ├── rag-production-bonnes-pratiques.md
│   ├── architecture-multi-agent-comparatif.md
│   └── moderniser-data-stack-2025.md
├── scripts/
│   └── update-index.js     # Génère posts/index.json à partir des fichiers .md
├── CNAME                   # Domaine personnalisé (créé lors du déploiement)
└── README.md               # Ce fichier
```

---

## 🚀 Développement local

### Prérequis

- [Node.js](https://nodejs.org/) (v18+) — uniquement pour le serveur local et le script d'index
- Un navigateur moderne

### Lancer le serveur de développement

```bash
# Depuis la racine du projet
npx -y serve . -p 3000
```

Le site est accessible sur **http://localhost:3000**.

> ⚠️ Ne pas utiliser le flag `-s` (mode SPA), sinon les pages `blog.html` et `article.html` seront redirigées vers `index.html`.

### Tester le blog

- Page listing : http://localhost:3000/blog.html
- Article : http://localhost:3000/article.html?slug=rag-production-bonnes-pratiques

---

## ✍️ Publier un nouvel article

### 1. Créer le fichier Markdown

Créer un fichier `.md` dans le dossier `posts/` avec le front-matter YAML obligatoire :

```markdown
---
title: "Titre de l'article"
description: "Description courte pour la carte et le SEO"
date: 2025-03-15
tags: [GenAI, RAG, LLM]
readTime: "8 min"
author: "Azeka Consulting"
---

## Introduction

Contenu de l'article en Markdown standard…

### Sous-section

- Listes à puces
- **Texte en gras**

```python
# Blocs de code avec coloration syntaxique
def hello():
    print("Hello world")
```‎

> Citations et callouts

| Col 1 | Col 2 |
|-------|-------|
| A     | B     |
```

### 2. Régénérer l'index

```bash
node scripts/update-index.js
```

Ce script scanne tous les `.md` dans `posts/`, parse le front-matter, et génère automatiquement `posts/index.json`.

### 3. Commit et push vers GitHub

```bash
git add posts/ 
git commit -m "article: titre de l'article"
git push origin main
```

L'article sera automatiquement en ligne dans les minutes qui suivent grâce à GitHub Pages.

---

## ⚙️ Configuration

### Formulaire de contact (Formspree)

1. Créer un compte sur [formspree.io](https://formspree.io/)
2. Créer un nouveau formulaire et copier l'**endpoint** (ex: `https://formspree.io/f/xyzabc123`)
3. Dans `index.html`, remplacer l'URL placeholder :

```html
<!-- Ligne ~493 dans index.html -->
<form id="contactForm" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```

Remplacer `YOUR_FORM_ID` par votre identifiant réel.

### Prise de rendez-vous (Calendly)

1. Créer un compte sur [calendly.com](https://calendly.com/)
2. Configurer un type d'événement (ex: "Appel découverte — 30 min")
3. Copier le lien de l'événement (ex: `https://calendly.com/votre-nom/30min`)
4. Dans `index.html`, remplacer le lien placeholder :

```html
<!-- Ligne ~484 dans index.html -->
<a href="https://calendly.com/votre-lien" target="_blank" rel="noopener" class="btn btn-primary">
```

Remplacer `votre-lien` par votre lien Calendly réel.

---

## 🌐 Domaine personnalisé (www.azeka-consulting.com)

### Étape 1 — Côté GitHub

1. Aller dans **Settings** → **Pages** du repository
2. Dans **Custom domain**, entrer : `www.azeka-consulting.com`
3. Cocher **Enforce HTTPS**
4. GitHub créera automatiquement un fichier `CNAME` dans le repository

### Étape 2 — Côté registrar DNS (OVH, Gandi, Cloudflare…)

Ajouter les enregistrements DNS suivants chez votre registrar :

#### Pour `www.azeka-consulting.com` (sous-domaine www)

| Type  | Nom   | Valeur                                |
|-------|-------|---------------------------------------|
| CNAME | www   | `<votre-username>.github.io`          |

#### Pour `azeka-consulting.com` (domaine apex, sans www)

Ajouter 4 enregistrements A pointant vers les IPs de GitHub Pages :

| Type | Nom | Valeur            |
|------|-----|-------------------|
| A    | @   | `185.199.108.153` |
| A    | @   | `185.199.109.153` |
| A    | @   | `185.199.110.153` |
| A    | @   | `185.199.111.153` |

### Étape 3 — Vérification

```bash
# Vérifier la propagation DNS (peut prendre jusqu'à 24h)
dig www.azeka-consulting.com +short
# Doit retourner : <votre-username>.github.io.

dig azeka-consulting.com +short
# Doit retourner les 4 IPs GitHub
```

### Étape 4 — Fichier CNAME

Créer un fichier `CNAME` à la racine du repository contenant :

```
www.azeka-consulting.com
```

> 💡 Ce fichier est normalement créé automatiquement par GitHub lorsque vous configurez le domaine dans les Settings. Si vous le créez manuellement, commitez-le.

---

## 📋 Liens utiles

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Formspree Documentation](https://formspree.io/docs)
- [Calendly Help Center](https://help.calendly.com/)
- [marked.js Documentation](https://marked.js.org/)
- [highlight.js Supported Languages](https://highlightjs.org/download)

---

## 📄 Licence

© 2025 Azeka Consulting — Tous droits réservés.
