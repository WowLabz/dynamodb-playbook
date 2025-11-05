# DynamoDB Developer Playbook

Production-minded guidance for **Amazon DynamoDB**: core concepts, repeatable patterns, **two end-to-end examples** (E-commerce & Social/Activity Feed), runnable **HTTP queries**, **sample data** (CSV/JSONL), **Mermaid diagrams**, and **production checklists**.

**Live site:** https://wowlabz.github.io/dynamodb-playbook/

---

## What’s inside

- **Concepts** — PK/SK modeling, item collections, LSI vs GSI, conditional/idempotent writes, transactions vs conditionals, migrations, security, error taxonomy.
- **Examples**  
  - **E-commerce:** Orders, Lines, Payments, Shipments, Inventory (GSI1 OrdersByUser; GSI2 OrdersByStatus; conditional inventory).  
  - **Feed:** Posts, Likes, Comments, Tags, Followers, Notifications (GSI1 PostsByAuthor; GSI2 PostsByTag; GSI3 FeedByUser + fan-out).
- **Samples** — Clean CSVs + JSONL seeds to make the patterns concrete.
- **Queries** — SigV4-ready `.http` payloads for Get/Query/Put/Update with conditions and pagination.
- **Diagrams** — Access-pattern matrices, key-design cheat sheets, and shared cross-cutting visuals.
- **Checklists** — Design Review, Security/IAM, Observability/Ops, Cost Alarms, DR/Backup, Migration & Evolution.

---

## Quick start

1. **Open the site** → https://wowlabz.github.io/dynamodb-playbook/  
2. **Skim Concepts** → understand keys, indexes, conditional writes, streams, and migrations.  
3. **Pick an example** → browse its **Samples**, **Access Patterns**, **Diagrams**, and **Queries**.  
4. **Run the queries** → copy from `docs/assets/samples/*/queries.http` into your REST client (SigV4) or adapt to AWS CLI/SDK.  
5. **Before shipping** → walk through **Production Checklists**.

---

## Repo structure (high level)

```
docs/
  index.md                    # Home
  concepts.md                 # Core concepts (with shared diagrams)
  downloads.md                # Raw Assets & Downloads
  ecom/
    index.md                  # Overview
    samples.md                # Inline tables for CSVs (links to raw)
    access-patterns.md        # Patterns table + notes
    diagrams.md               # Renders A1–A7
    queries.md                # How to run queries.http
  feed/
    index.md
    samples.md
    access-patterns.md
    diagrams.md
    queries.md
  assets/
    samples/
      ecom/ (...csv, seed.jsonl, queries.http, helpers.{py,ts})
      feed/ (...csv, seed.jsonl, queries.http, helpers.{py,ts})
    diagrams/
      ecom/ A1_access-pattern-matrix.mmd, A2_key-design-cheatsheet.mmd, ...
      feed/ B1_..., B2_..., ...
      shared/ C1_partition-bookshelf.png, C2_lsi-vs-gsi.mmd, ... C7_security-scope.mmd
    checklists/
      design-review.md, security-iam.md, observability-ops.md, ...
  styles/, overrides/, js/     # MkDocs Material branding & mermaid init
mkdocs.yml                      # Site configuration
```

---

## Work locally (MkDocs Material)

```bash
# 1) Install
pip install mkdocs mkdocs-material pymdown-extensions

# 2) Serve locally
mkdocs serve
# http://127.0.0.1:8000

# 3) Build static site (optional)
mkdocs build
```

> Diagrams use Mermaid via MkDocs Material; no extra build step needed.  
> If you prefer PNGs for diagrams, export from the `.mmd` sources under `docs/assets/diagrams/*`.

---

## Using the samples & queries

- **CSV/JSONL**: load into your scripts/tests or use as mental models for item shapes and key design.  
- **`queries.http`**: run with a client that supports **AWS SigV4** (or translate to AWS CLI/SDK).  
- **Helpers**: `helpers.py` / `helpers.ts` include small key/shard helpers you can reuse.

---

## Contributing

1. Fork and create a feature branch.  
2. Keep **access patterns** and **diagrams** in sync with sample CSVs.  
3. Prefer **Mermaid** for diagrams; place sources under `docs/assets/diagrams/...`.  
4. Run `mkdocs serve` and preview before opening a PR.

---

## License

Copyright © Wow Labz.  
Docs and examples are provided for educational and internal enablement purposes.
