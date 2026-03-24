# Azeka Consulting — Site Vision & Roadmap

## 1. Vision

Site vitrine et blog technique pour **Azeka Consulting**, cabinet de conseil independant specialise en Data Engineering et Intelligence Artificielle, avec un positionnement "Ingenierie IA Europe-Afrique".

Le site doit projeter une image **institutionnelle, strategique et techniquement credible** — a l'image d'un acteur structurant, pas d'une startup.

**URL de production** : https://www.azeka-consulting.com
**Hebergement** : GitHub Pages (100% statique, zero build step)
**Stitch Project ID** : `7303866236895399885`

## 2. Stack Technique

- HTML5 semantique
- CSS3 vanilla (custom properties, glassmorphism, animations)
- JavaScript ES6+ vanilla (aucun framework)
- Blog Markdown client-side (marked.js v12 + highlight.js v11)
- Google Workspace Starter (formulaire contact + prise de RDV)

## 3. Structure des pages

```
azeka-landing-page/
├── index.html            # Landing page (hero, services, expertise, tech, refs, blog, contact)
├── blog.html             # Blog listing (recherche, tags, pagination)
├── article.html          # Lecteur d'article Markdown (TOC, nav prev/next)
├── mentions-legales.html       # [A GENERER] Mentions legales LCEN
├── politique-confidentialite.html  # [A GENERER] Politique RGPD
└── 404.html              # [BACKLOG] Page 404 personnalisee
```

## 4. Sitemap (pages existantes)

- [x] `index.html` — Landing page principale
- [x] `blog.html` — Listing des articles
- [x] `article.html` — Lecteur d'article
- [x] `mentions-legales.html` — Mentions legales LCEN
- [x] `politique-confidentialite.html` — Politique de confidentialite RGPD
- [ ] `404.html` — **Phase 7 backlog**

## 5. Roadmap des pages a generer

### Priorite 1 — Pages legales (Phase 1)

1. **mentions-legales.html**
   - Raison sociale, SIRET, forme juridique
   - Directeur de publication
   - Hebergeur (GitHub Pages / Microsoft)
   - Contact
   - Design : fond sombre, glass card contenu, navigation coherente avec le site

2. **politique-confidentialite.html**
   - Responsable du traitement
   - Donnees collectees (formulaire contact, Google Calendar)
   - Finalites et base legale
   - Duree de conservation
   - Droits des personnes (acces, rectification, suppression)
   - Cookies et traceurs
   - Design : meme layout que mentions legales

### Priorite 2 — Page 404 (Phase 7)

3. **404.html**
   - Illustration geometrique on-brand
   - Message d'erreur elegant en francais
   - CTA retour vers l'accueil
   - Design : minimaliste, centre, fond sombre

## 6. Creative Freedom

Si le roadmap est vide, voici des idees de pages additionnelles :

- **case-studies.html** — Etudes de cas detaillees (projets Enedis, Thales, etc.)
- **services-data.html** — Page dediee Data Engineering avec details
- **services-ia.html** — Page dediee IA & GenAI avec details
- **about.html** — Page a propos complete du fondateur

## 7. Design Constraints

Toutes les pages generees doivent :

1. Utiliser le design system documente dans `.stitch/DESIGN.md`
2. Inclure la navigation coherente avec le site (logo, liens, CTA "Contactez-nous")
3. Inclure un footer coherent (4 colonnes, liens, copyright 2026)
4. Etre en francais
5. Respecter le ton institutionnel (pas de langage informel, pas d'emojis dans le contenu)
6. Etre responsives (breakpoints 1024px, 768px, 480px)
