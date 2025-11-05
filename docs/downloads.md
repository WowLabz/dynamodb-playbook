---
title: Raw Assets & Downloads
---

# Raw Assets & Downloads

Use these for local testing/importing into tools.  
**Explore samples:** [E-commerce Samples](ecom/samples.md) · [Feed Samples](feed/samples.md)

If a folder is missing in your repo, create it and copy files from your working branch.

## Samples

### E-commerce
| File | Description | Download |
|---|---|---|
| `access_patterns.csv` | Canonical access patterns for the e-commerce example. | [Download](assets/samples/ecom/access_patterns.csv) |
| `queries.http` | Copy-pasteable HTTP requests (GET/Query/Batch, etc.). | [Download](assets/samples/ecom/queries.http) |
| `seed.jsonl` | Seed data (JSON Lines) for quick prototyping. | [Download](assets/samples/ecom/seed.jsonl) |
| `users.csv` | User master rows. | [Download](assets/samples/ecom/users.csv) |
| `orders.csv` | Order meta rows (PK=ORDER#id, SK=META). | [Download](assets/samples/ecom/orders.csv) |
| `order_lines.csv` | Lines (PK=ORDER#id, SK=LINE#no). | [Download](assets/samples/ecom/order_lines.csv) |
| `payments.csv` | Payment attempts. | [Download](assets/samples/ecom/payments.csv) |
| `shipments.csv` | Shipment updates. | [Download](assets/samples/ecom/shipments.csv) |
| `products.csv` | Product catalog (sample). | [Download](assets/samples/ecom/products.csv) |
| `inventory_snapshots.csv` | Inventory snapshots. | [Download](assets/samples/ecom/inventory_snapshots.csv) |
| `addresses.csv` | Address book (per user). | [Download](assets/samples/ecom/addresses.csv) |
| `events_outbox.csv` | Outbox events for async publish. | [Download](assets/samples/ecom/events_outbox.csv) |

### Social / Activity Feed
| File | Description | Download |
|---|---|---|
| `access_patterns.csv` | Access patterns for timelines, fan-out, etc. | [Download](assets/samples/feed/access_patterns.csv) |
| `queries.http` | HTTP queries for feed write/read paths. | [Download](assets/samples/feed/queries.http) |
| `seed.jsonl` | Seed data for users, posts, timelines. | [Download](assets/samples/feed/seed.jsonl) |
| `users.csv` | User master rows. | [Download](assets/samples/feed/users.csv) |
| `posts.csv` | Posts (PK=POST#id, SK=META). | [Download](assets/samples/feed/posts.csv) |
| `likes.csv` | Likes per post. | [Download](assets/samples/feed/likes.csv) |
| `comments.csv` | Comments per post. | [Download](assets/samples/feed/comments.csv) |
| `hashtags.csv` | Post tags. | [Download](assets/samples/feed/hashtags.csv) |
| `feed_fanout.csv` | Fanout entries (home feed). | [Download](assets/samples/feed/feed_fanout.csv) |
| `follows.csv` | Follow graph edges. | [Download](assets/samples/feed/follows.csv) |
| `notifications.csv` | Notifications sample. | [Download](assets/samples/feed/notifications.csv) |

## Diagrams

| Topic | Go |
|---|---|
| E-commerce | [Open Diagrams](ecom/diagrams.md) |
| Social / Activity Feed | [Open Diagrams](feed/diagrams.md) |

## Production Checklists

| Checklist | View |
|---|---|
| Design Review | [View](assets/checklists/design-review.md) |
| DR & Backup | [View](assets/checklists/dr-backup.md) |
| Security & IAM | [View](assets/checklists/security-iam.md) |
| Observability & Ops | [View](assets/checklists/observability-ops.md) |
| Cost Alarms | [View](assets/checklists/cost-alarms.md) |
| Readiness Sign-off | [View](assets/checklists/readiness-signoff.md) |
| Data Migration & Evolution | [View](assets/checklists/data-migration-evolution.md) |
