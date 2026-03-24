---
title: "RAG en production : les pièges à éviter et les bonnes pratiques"
date: 2025-02-10
tags: [GenAI, RAG, LLM, REX]
readTime: 8 min
author: Azeka Consulting
---

Le **Retrieval Augmented Generation** (RAG) est devenu le pattern incontournable pour exploiter les LLM sur des données propriétaires. Mais entre le POC qui impressionne en démo et le système fiable en production, il y a un gouffre que beaucoup sous-estiment.

Cet article est un retour d'expérience issu de plusieurs déploiements RAG en environnement entreprise.

## Le RAG en 30 secondes

Le principe est simple : au lieu de faire confiance uniquement à la mémoire du LLM (ses données d'entraînement), on lui fournit des **documents pertinents** extraits d'une base de connaissances au moment de la requête.

```python
# Schéma simplifié d'un pipeline RAG
query = "Quelle est la politique de télétravail ?"

# 1. Recherche sémantique
relevant_docs = vector_store.similarity_search(query, k=5)

# 2. Construction du prompt avec contexte
prompt = f"""Basé sur les documents suivants :
{relevant_docs}

Réponds à la question : {query}"""

# 3. Génération
response = llm.generate(prompt)
```

Simple en apparence. La réalité est plus nuancée.

## Piège n°1 : Le chunking naïf

C'est le premier point de friction. Comment découper vos documents en morceaux (chunks) qui auront du sens pour la recherche sémantique ?

### Ce qu'on voit souvent (et qui marche mal)

```python
# ❌ Chunking par taille fixe — perd le contexte
chunks = split_text(document, chunk_size=500, overlap=50)
```

Le problème : un chunk de 500 caractères peut couper une phrase en plein milieu, séparer un tableau de son titre, ou mélanger deux sections sans rapport.

### Ce qui fonctionne mieux

```python
# ✅ Chunking sémantique — respecte la structure du document
from langchain.text_splitter import MarkdownHeaderTextSplitter

headers_to_split = [
    ("#", "Titre"),
    ("##", "Section"),
    ("###", "Sous-section"),
]
splitter = MarkdownHeaderTextSplitter(headers_to_split)
chunks = splitter.split_text(document)
```

**Règles d'or :**

- Un chunk = **une idée cohérente** (règle, procédure, définition)
- Préserver les **métadonnées** (titre de section, page, source)
- Tester avec de **vraies requêtes utilisateur**, pas des requêtes synthétiques

## Piège n°2 : Se reposer uniquement sur les embeddings

La recherche vectorielle par similarité cosine est puissante, mais elle a des limites :

- Elle ne comprend pas les **négations** (« documents qui ne concernent PAS le télétravail »)
- Elle est sensible au **vocabulaire métier** spécifique
- Elle peut retourner des résultats **sémantiquement proches mais fonctionnellement inutiles**

### La solution : recherche hybride + reranking

```python
# Recherche hybride : vecteurs + BM25
vector_results = vector_store.similarity_search(query, k=20)
bm25_results = bm25_index.search(query, k=20)

# Fusion avec Reciprocal Rank Fusion
merged = reciprocal_rank_fusion(vector_results, bm25_results)

# Reranking avec un modèle cross-encoder
reranked = cross_encoder.rerank(query, merged[:10])

# Top 5 documents les plus pertinents
final_context = reranked[:5]
```

Le reranking avec un **cross-encoder** (type `ms-marco-MiniLM`) améliore significativement la précision, souvent de 15 à 30%.

## Piège n°3 : Ignorer l'évaluation

Comment savoir si votre RAG fonctionne vraiment ? Trop d'équipes se fient à des tests manuels ad hoc.

### Framework d'évaluation recommandé

| Métrique | Description | Outil |
|----------|-------------|-------|
| **Retrieval Precision** | Les documents retrouvés sont-ils pertinents ? | RAGAS |
| **Faithfulness** | La réponse est-elle fidèle au contexte fourni ? | RAGAS |
| **Answer Relevancy** | La réponse répond-elle à la question ? | RAGAS |
| **Hallucination Rate** | Le modèle invente-t-il des informations ? | Custom |

```python
from ragas import evaluate
from ragas.metrics import faithfulness, answer_relevancy, context_precision

# Évaluation automatisée
results = evaluate(
    dataset=eval_dataset,
    metrics=[faithfulness, answer_relevancy, context_precision]
)
print(results)
# {'faithfulness': 0.89, 'answer_relevancy': 0.92, 'context_precision': 0.78}
```

## Piège n°4 : Le prompt statique

Un prompt RAG qui fonctionne bien avec GPT-4 donnera souvent des résultats médiocres avec Claude ou Mistral. Et un prompt optimisé pour des documents juridiques sera inadapté pour des FAQ produit.

**Bonnes pratiques :**

1. **Adapter le prompt au type de document** (réglementation vs. FAQ vs. technique)
2. **Inclure des instructions de formatage** explicites
3. **Demander au modèle de citer ses sources** (traçabilité)
4. **Gérer le cas "pas de réponse"** explicitement

```python
PROMPT_TEMPLATE = """Tu es un assistant expert. Réponds UNIQUEMENT 
en te basant sur les documents fournis ci-dessous.

RÈGLES :
- Si les documents ne contiennent pas la réponse, dis-le clairement
- Cite la source (nom du document, section) pour chaque affirmation
- Utilise un format structuré avec des bullet points

DOCUMENTS :
{context}

QUESTION : {question}

RÉPONSE :"""
```

## Checklist de mise en production

Avant de déployer votre RAG en production, vérifiez ces points :

- [ ] **Chunking** testé et validé sur des requêtes réelles
- [ ] **Recherche hybride** (vecteurs + BM25) mise en place
- [ ] **Reranking** configuré avec un cross-encoder
- [ ] **Évaluation automatisée** avec métriques RAGAS
- [ ] **Monitoring** des latences et taux de hallucination
- [ ] **Feedback loop** : collecte des retours utilisateurs
- [ ] **Versioning** des embeddings et de l'index
- [ ] **Tests de régression** sur un dataset de référence

## Conclusion

Le RAG n'est pas une solution magique. C'est un **système d'ingénierie** qui nécessite les mêmes pratiques que tout système critique : tests, monitoring, itération continue.

La clé du succès ? **Investir dans l'évaluation** dès le premier jour. Un RAG que vous ne pouvez pas mesurer est un RAG que vous ne pouvez pas améliorer.

---

*Vous avez un projet RAG en cours ou en réflexion ? [Contactez-nous](../index.html#contact) pour un audit de votre architecture ou un accompagnement sur mesure.*
