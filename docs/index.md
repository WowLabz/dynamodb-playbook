---
title: DynamoDB Developer Playbook
description: Professional playbook with patterns, diagrams, queries, and production checklists
---

# DynamoDB Developer Playbook

A practical, production-grade guide to data modeling and operations on **Amazon DynamoDB**.  
This playbook blends **principles**, **repeatable workflows**, and **copy-pasteable assets** (diagrams, queries, checklists).

> Start with **Concepts**, then dive into the examples, and finally run the **Production Checklists** before launch.

## Quick Nav
- **[Concepts & Structure](concepts.md)**
- **[Production Checklists](checklists/index.md)**
- **[Raw Assets & Downloads](downloads.md)**


## Examples
<div class="grid cards" markdown>
- :material-cart: **E-commerce**  
  Access patterns, entity modeling, and queries.  
  [:octicons-arrow-right-24: Open](ecom/index.md)

- :material-forum: **Social / Activity Feed**  
  Fan-out, timelines, and write patterns.  
  [:octicons-arrow-right-24: Open](feed/index.md)
</div>


---

## How to use this playbook
1. **List access patterns** and SLAs. Model keys first (PK/SK), keep keys generic (`PK`, `SK`) and *decorate values* (`ORDER#123`, `USER#42`).
2. **Validate each hot path** is a Get/Query (no Scan). Add LSIs/GSIs only when required.
3. **Prototype** items and **exercise queries** (copy the HTTP payloads).
4. **Run the checklists** (design, DR, security/IAM, cost/alarms, ops, migration) before shipping.

