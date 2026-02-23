---
title: "Moderniser son Data Stack en 2025 : du Lakehouse au Real-Time"
date: 2025-01-15
tags: [Data Engineering, Cloud, Lakehouse, Architecture]
readTime: 10 min
author: Azeka Consulting
---

La stack data a considérablement évolué ces dernières années. Les architectures monolithiques cèdent la place à des écosystèmes modulaires, cloud-native et orientés temps réel. Mais comment naviguer dans cette jungle technologique sans se perdre ?

Cet article propose un **guide pragmatique** pour moderniser votre architecture data en 2025.

## L'évolution des architectures data

### Génération 1 : le Data Warehouse traditionnel

L'ère du DWH on-premise. Teradata, Oracle, DB2. Coûteux, rigide, mais fiable.

```
Sources → ETL batch (Informatica/Talend) → Data Warehouse → BI (Business Objects)
```

**Limitations :**
- Coût d'infrastructure astronomique
- Scalabilité verticale uniquement
- Cycle ETL de plusieurs heures
- Pas adapté aux données non-structurées

### Génération 2 : le Data Lake

L'arrivée de Hadoop et du stockage distribué. "Stockez tout, on triera plus tard."

```
Sources → Ingestion (Kafka/Nifi) → Data Lake (HDFS/S3) → Processing (Spark) → BI
```

**Limitations :**
- Le fameux **Data Swamp** (lac de données devenu marécage)
- Pas de gouvernance native
- Performances de requêtes médiocres
- Complexité opérationnelle (cluster Hadoop)

### Génération 3 : le Lakehouse

La convergence du meilleur des deux mondes. Stockage objet (S3/GCS) + couche transactionnelle (Delta Lake/Iceberg) + moteur de requêtes performant.

```
Sources → Ingestion (Kafka/Fivetran) → Lakehouse (Iceberg + Spark/Trino) → BI + ML + AI
```

**Avantages :**
- **ACID transactions** sur le data lake
- **Schema evolution** sans migration
- **Time travel** (requêtes sur l'historique)
- **Unified batch + streaming**
- Coût de stockage optimisé (object storage)

## Architecture Lakehouse de référence

Voici l'architecture que nous recommandons chez Azeka Consulting pour une entreprise de taille intermédiaire :

### Couche Ingestion

```python
# Exemple avec Apache Airflow + dbt
# dag_ingestion.py

from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.providers.google.cloud.operators.bigquery import (
    BigQueryInsertJobOperator
)

with DAG("daily_ingestion", schedule_interval="@daily") as dag:
    
    # Extract depuis les sources
    extract_crm = PythonOperator(
        task_id="extract_crm",
        python_callable=extract_from_salesforce,
        op_kwargs={"table": "opportunities"}
    )
    
    # Load dans le lakehouse (raw layer)
    load_raw = BigQueryInsertJobOperator(
        task_id="load_raw",
        configuration={
            "load": {
                "sourceUris": ["gs://data-lake/raw/crm/*.parquet"],
                "destinationTable": "raw.crm_opportunities",
                "sourceFormat": "PARQUET",
                "writeDisposition": "WRITE_TRUNCATE"
            }
        }
    )
    
    # Transform avec dbt
    transform_dbt = BashOperator(
        task_id="transform_dbt",
        bash_command="cd /dbt && dbt run --select staging.crm+"
    )
    
    extract_crm >> load_raw >> transform_dbt
```

### Couche Transformation : le pattern Medallion

Le pattern **Bronze / Silver / Gold** (ou Raw / Staging / Marts) est devenu le standard :

| Couche | Contenu | Qualité | Consommateurs |
|--------|---------|---------|---------------|
| **Bronze** (Raw) | Données brutes, telles quelles | Aucun nettoyage | Data Engineers |
| **Silver** (Staging) | Données nettoyées, typées, dédupliquées | Tests qualité | Data Analysts |
| **Gold** (Marts) | Modèles métier agrégés, KPIs | Validé métier | BI, ML, Reporting |

```sql
-- dbt model : silver/stg_crm_opportunities.sql
WITH source AS (
    SELECT * FROM {{ source('raw', 'crm_opportunities') }}
),

cleaned AS (
    SELECT
        opportunity_id,
        LOWER(TRIM(account_name)) AS account_name,
        CAST(amount AS DECIMAL(12,2)) AS amount,
        PARSE_DATE('%Y-%m-%d', close_date) AS close_date,
        stage_name,
        -- Déduplication
        ROW_NUMBER() OVER (
            PARTITION BY opportunity_id 
            ORDER BY _loaded_at DESC
        ) AS row_num
    FROM source
    WHERE opportunity_id IS NOT NULL
)

SELECT * FROM cleaned WHERE row_num = 1
```

### Couche Serving : BI + ML + IA

Le Lakehouse alimente simultanément :

- **BI** : Looker, Metabase, Superset (requêtes SQL directes)
- **ML** : Feature stores, training datasets (Vertex AI, SageMaker)
- **GenAI** : Embeddings pour RAG, données de contexte pour les agents

## Le virage Real-Time

Le batch ne suffit plus. Les cas d'usage modernes exigent des **latences inférieures à la minute** :

- Détection de fraude
- Personnalisation en temps réel
- Monitoring IoT
- Alerting opérationnel

### Architecture streaming de référence

```
Sources → Kafka/Pub-Sub → Stream Processing → Serving Layer
              │                    │
              │              (Flink/Spark     
              │               Structured      
              │               Streaming)       
              │                    │
              └──────► Data Lake ◄─┘
                      (Iceberg)
```

```python
# Spark Structured Streaming avec Iceberg sink
from pyspark.sql import SparkSession

spark = SparkSession.builder \
    .appName("RealTimeIngestion") \
    .config("spark.sql.catalog.lakehouse", "org.apache.iceberg.spark.SparkCatalog") \
    .getOrCreate()

# Lecture depuis Kafka
stream = spark.readStream \
    .format("kafka") \
    .option("kafka.bootstrap.servers", "kafka:9092") \
    .option("subscribe", "events") \
    .load()

# Transformation
events = stream.selectExpr(
    "CAST(key AS STRING) as event_id",
    "CAST(value AS STRING) as payload",
    "timestamp as event_time"
)

# Écriture dans Iceberg (append mode)
events.writeStream \
    .format("iceberg") \
    .outputMode("append") \
    .option("path", "lakehouse.events.raw_events") \
    .option("checkpointLocation", "/checkpoints/events") \
    .trigger(processingTime="30 seconds") \
    .start()
```

## Stratégie de migration progressive

Ne tentez **jamais** un big-bang. Voici notre approche en 4 phases :

### Phase 1 : Foundation (1-2 mois)
- Mettre en place le **stockage cloud** (GCS/S3)
- Configurer **Terraform** pour l'IaC
- Premiers pipelines d'ingestion batch
- Pattern Medallion sur 2-3 sources critiques

### Phase 2 : Analytics (2-3 mois)
- Déployer **dbt** pour les transformations
- Tests de qualité de données automatisés
- Migration progressive de la BI existante
- Data catalog et documentation

### Phase 3 : Streaming (2-4 mois)
- Mise en place de **Kafka/Pub-Sub**
- Premiers use cases temps réel
- Architecture **Lambda** (batch + streaming en parallèle)
- Monitoring et alerting

### Phase 4 : IA & Advanced Analytics (ongoing)
- Feature stores pour le ML
- Embeddings et vector stores pour le RAG
- Intégration avec les agents IA
- Data mesh et domaines décentralisés

## Les erreurs classiques à éviter

1. **Migrer la tech sans changer l'organisation** — La modernisation data est autant un sujet humain que technique
2. **Ignorer la gouvernance** — Un Lakehouse sans gouvernance reste un data swamp
3. **Sur-ingénierer** — Commencez simple, itérez vite
4. **Oublier les coûts** — Le cloud peut coûter cher si mal géré (FinOps dès le jour 1)
5. **Négliger l'observabilité** — Data quality, lineage et monitoring sont essentiels

## Conclusion

La modernisation du data stack n'est pas un projet ponctuel, c'est un **processus continu**. Le Lakehouse offre une fondation solide pour les 5 prochaines années, avec la flexibilité nécessaire pour absorber les évolutions (streaming, IA, multi-cloud).

La clé ? **Avancer par étapes**, mesurer les résultats, et ne jamais perdre de vue la valeur métier.

---

*Vous planifiez une modernisation de votre stack data ? [Échangeons](../index.html#contact) sur votre contexte et vos objectifs.*
