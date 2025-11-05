---
title: E-commerce Overview
---

# E-commerce Overview

**Scope:** Users, Orders, OrderLines, Payments, Shipments, Inventory, Outbox.

## Access Patterns (representative)
- Get User; list user’s recent Orders (**GSI: OrdersByUser**)
- Get Order (META) + lines/payments/shipments (by `PK`)
- Backoffice list of Orders by Status/Month (**GSI: OrdersByStatus** with shard in `SK`)
- Reserve/decrement inventory with **conditional updates**
- Soft delete & export older Orders for analytics/compliance

## Index Strategy
- **GSI1 — OrdersByUser**: `PK = USER#<id>`, `SK = <placed_at>#ORDER#<id>` (DESC)
- **GSI2 — OrdersByStatus**: `PK = STATUS#<status>#<yyyy-mm>`, `SK = <placed_at>#<shard>#ORDER#<id>` (DESC)

**Continue:** [Access Patterns](access-patterns.md) · [Diagrams](diagrams.md) · [Queries](queries.md)
