---
title: Concepts & Structure
---

# Concepts & Structure

## 1) Mental Model
- **Access-pattern-first:** design from *queries you must serve* (who/what/how fast).
- **Single-table mindset:** use generic keys (`PK`, `SK`) and **decorate values**  
  (e.g., `ORDER#12345`, `PAYMENT#2025-11-04T10:00:05Z`).
- **Item collections:** all items with the same `PK` form a logical aggregate. Use `SK`
  to encode *type* + *time* + *order* (e.g., `LINE#0001`, `PAYMENT#<ts>`).

## 2) Partitions & Capacity
- DynamoDB hashes `PK` → **partitions**. Hot partitions throttle.
- Prefer **high-cardinality PKs**; apply **write sharding** where fan-in is high.
- **Adaptive capacity** helps but doesn’t replace good key design.

## 3) Consistency & Indexes
- Base-table reads support **strong consistency**. **GSI** reads are **eventually consistent**.
- **LSI** shares base `PK` with a new `SK` (strong consistency; item-collection limits).
- **GSI** defines a new `PK/SK` (scales fan-out; decouples capacity/projection).

## 4) Modeling Workflow (repeatable)
1. Capture **access patterns** (+ cardinality + SLA + sort needs).
2. Define **PK/SK**. Use typed prefixes in values; design `SK` for range scans.
3. Add **LSIs/GSIs** only when a pattern cannot be served from base keys.
4. **Validate**: hot paths are `GetItem`/`Query`. No `Scan` on the critical path.
5. **Load test** for peak with realistic key distributions.

## 5) Core Patterns
- One-to-many / many-to-many (adjacency lists; dual-writes)
- Time-series & feeds (bucketed keys, sharded `SK`, TTL)
- Inverted indexes (global “by-X” GSIs)
- Counters via Streams + idempotent updates
- Soft delete & archival (TTL + Export to S3)
- Multitenancy (tenant namespace in `PK` or separate tables + IAM conditions)

## 6) Reliability & Idempotency
- Guard side-effects with **idempotency keys** and **conditional expressions**.
- Use **transactions** (≤ 100 items) only when strictly needed; otherwise **sagas** with Streams + retries + DLQ.

## 7) Cost & Ops Highlights
- Split **hot vs cold** attributes; keep items small (< 400 KB with margin).
- Choose minimal **projections** (KEYS_ONLY / INCLUDE).
- Observe **ThrottledRequests**, **SuccessfulRequestLatency (P95/P99)**, **IteratorAge**, and **DLQ depth**.
