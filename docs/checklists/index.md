---
title: Production Checklists
---


# Production Checklists

Use these pre-flight lists to prevent the most common DynamoDB pitfalls in production.

- **Design Review** — access patterns, keys, indexes, item size, consistency  
  `assets/checklists/design-review.md`
- **DR & Backup** — PITR retention, restore drills, cross-region planning  
  `assets/checklists/dr-backup.md`
- **Security & IAM** — least privilege, KMS, tenant conditions  
  `assets/checklists/security-iam.md`
- **Cost & Alarms** — capacity choice, throttles, latency, budgets  
  `assets/checklists/cost-alarms.md`
- **Observability & Ops** — dashboards, DLQ, chaos/game days  
  `assets/checklists/observability-ops.md`
- **Data Migration & Evolution** — dual-write, backfill, cutover, rollback  
  `assets/checklists/data-migration-evolution.md`
- **Release Readiness** — final sign-offs  
  `assets/checklists/readiness-signoff.md`

> Keep these in your repo and link them in runbooks/on-call wikis. Treat them like code: PRs welcome.
