---
title: DynamoDB Developer Playbook
description: Professional playbook with patterns, diagrams, queries, and production checklists
---

# DynamoDB Developer Playbook

A practical, production-grade guide to **Amazon DynamoDB**—from modeling to launch.  
This playbook blends **core concepts**, **repeatable patterns**, and **ready-to-use assets** (diagrams, queries, checklists, sample data).

> Start with **Concepts**, explore the **Examples**, and use **Checklists** before shipping.

---

## Quick Nav
- **[Concepts & Structure](concepts.md)**
- **[Raw Assets & Downloads](downloads.md)**
- **[Production Checklists](checklists/index.md)**

---

## Quick Start (5 minutes)
1. Skim **[Concepts](concepts.md)** → PK/SK, item collections, LSI vs GSI, idempotent writes.
2. Open an example and browse **Samples**:
    - E-commerce → **[Samples](ecom/samples.md)** · [Access Patterns](ecom/access-patterns.md) · [Diagrams](ecom/diagrams.md) · [Queries](ecom/queries.md)
    - Social/Feed → **[Samples](feed/samples.md)** · [Access Patterns](feed/access-patterns.md) · [Diagrams](feed/diagrams.md) · [Queries](feed/queries.md)
3. Copy payloads from `queries.http` and run against your AWS account.
4. Before prod, run **[Production Checklists](checklists/index.md)**.

---

## Examples
<div class="grid cards" markdown>
- :material-cart: **E-commerce**
  <br/>Model: orders, lines, payments, shipments, inventory.  
  <br/>Paths: **GSI1 OrdersByUser**, **GSI2 OrdersByStatus**, conditional inventory updates.  
  <br/>**Open:** [Overview](ecom/index.md) · [Samples](ecom/samples.md) · [Access Patterns](ecom/access-patterns.md) · [Diagrams](ecom/diagrams.md) · [Queries](ecom/queries.md)

- :material-forum: **Social / Activity Feed**
  <br>Model: posts, likes, comments, tags, followers, notifications.  
  <br>Paths: **GSI1 PostsByAuthor**, **GSI2 PostsByTag**, **GSI3 FeedByUser**, fan-out/sharding.  
  <br>**Open:** [Overview](feed/index.md) · [Samples](feed/samples.md) · [Access Patterns](feed/access-patterns.md) · [Diagrams](feed/diagrams.md) · [Queries](feed/queries.md)
</div>

---

## What’s inside
- **Mermaid diagrams:** access-pattern matrices + key-design cheat sheets for both examples.
- **Sample data:** CSV + JSONL seeds to test queries quickly.
- **HTTP queries:** SigV4-ready `.http` payloads for Get/Query/Put/Update with conditions.
- **Checklists:** design, cost & alarms, security/IAM, ops/observability, DR/backup, migration & evolution.

---

## How to use this playbook
1. **List access patterns** and SLAs; design keys first (generic `PK`, `SK`; *decorate values*: `USER#42`, `ORDER#123`).
2. **Ensure hot paths are Get/Query** (no Scan). Add LSIs/GSIs only where needed.
3. **Prototype with Samples**; exercise `queries.http`; confirm RCUs/WCUs and item sizes.
4. **Ship with guardrails**: run the checklists and set alarms/dashboards.

---
