---
title: Concepts & Structure
---

# Concepts & Structure

This page is the “why” and “how” behind every modeling choice in the playbook. It explains the building blocks (items, keys, indexes), the mental model we use to design schemas, and the day-2 practices (streams, reliability, cost, security). If you’re new to DynamoDB, read this page top-to-bottom once, then jump to the **E-commerce** and **Feed** examples.

> TL;DR: Start from **access patterns**, map them to **keys** and **item collections**, add **LSIs/GSIs** only when required, and treat **Streams + idempotency** as your coordination plane for everything that isn’t a single conditional write.


---

## 0) DynamoDB in one minute

- DynamoDB is a **NoSQL key–value / document** database.
- Everything revolves around **fast reads/writes by key**. You design **from access patterns** (the exact queries you need), then pick keys/indexes to serve them with `GetItem`/`Query` (no joins, no ad-hoc scans on hot paths).
- Data lives in a **table**. Each row is an **item** (a JSON-like document up to **400 KB**). Items have attributes (string, number, boolean, list, map…).

---

## 1) Core building blocks (with clear definitions)

### 1.1 Item, attributes, and size limits
- **Item** = one record (document). Max **400 KB** including attribute names.
- **Attributes** = fields on an item. Can be nested (maps/lists).
- Keep hot items small; move cold/blobby data out (S3 or separate item).

### 1.2 Primary key: **PK** (partition key) and **SK** (sort key)
- Every item must have **PK**. Items with the **same PK** are stored in the same logical **item collection**.
- If the table also defines a **sort key (SK)**, items with the same PK are ordered by SK and can be fetched with a **range query**.
- We use **generic key names** (`PK`, `SK`) and **decorate values** with prefixes:
  - Example (Orders):
    - `PK = "ORDER#12345"`, `SK = "META"`
    - `PK = "ORDER#12345"`, `SK = "LINE#0001"`
    - `PK = "ORDER#12345"`, `SK = "PAYMENT#2025-11-04T10:00:05Z"`
  - This lets very different item “types” live together under one Order.

> **Item collection** = all items that share the same PK (e.g., everything about Order `12345`). Fetch them with a single `Query` on PK.

### 1.3 Reads & writes you’ll actually use
- **GetItem**: read by full PK+SK (fastest).
- **Query**: read by PK, optionally an SK condition (`begins_with`, `between`, `<`, `>`) + filters.
- **Scan**: reads *all* items (avoid on hot paths; use only for admin/backfills).
- **PutItem**: create/replace an item (can be made idempotent with a condition).
- **UpdateItem**: update attributes (optionally with a condition).
- **DeleteItem**: remove an item (can be conditional).
- **Batch**: batch reads/writes by key (no cross-item conditions).
- **Transactions**: atomically read/write multiple items (limits apply; use only when truly needed).

---

## 2) Indexes: **LSI** vs **GSI** (and how to choose)

### 2.1 Local Secondary Index (LSI)
- Shares the **same PK** as the base table, but has a **different SK**.
- Reads on an LSI can be **strongly consistent**.
- Limit: **max 5 LSIs per table**; also **10 GB per item collection** still applies (because PK doesn’t change).
- Use when you need **another sort order inside the same item collection**.  
  *Example:* Order items sorted by `price` instead of time.

### 2.2 Global Secondary Index (GSI)
- Has its **own PK/SK** (completely different from base keys).
- Reads are **eventually consistent** only (no strong reads).
- Use to build **global “by-X” views**: orders **by user**, posts **by tag**, feed **by user**, etc.
- Limit: up to **20 GSIs per table** (subject to account limits).
- **Projection** controls which attributes are copied to the GSI:
  - `KEYS_ONLY` (cheapest): only index keys are stored.
  - `INCLUDE`: include a subset of attributes.
  - `ALL`: copies everything (most expensive).  
  Pick the smallest that serves your reads.

> Rule of thumb: **Base table or LSI** if the PK is correct and you just need a different order. **GSI** when you need a **different access path**.

---

## 3) The DynamoDB mental model (access-pattern-first)

1. **List access patterns** (actor, verb, filters, order, limit, SLA, consistency).  
   Example: “List latest orders for a user (25, recent-first, SLA 100 ms, eventual)”.
2. Choose **PK** with **high cardinality** (distributes writes across partitions).  
   Use **decorated values**: `ORDER#<id>`, `USER#<id>`, `STATUS#<status>#<month>`.
3. Design **SK** for sort/range (time in ISO-8601, then tie-breakers or **shards**).
4. Add **LSI/GSI** only if a pattern can’t be served from base keys.
5. Validate: all hot paths are **Get/Query** (no `Scan`).
6. Prototype items and **load test** with realistic key distributions (including peaks).

---

## 4) Partitions, capacity, and hot keys (how throughput really works)

### 4.1 Partitions & adaptive capacity
- DynamoDB hashes **PK** to place items on **partitions** (storage + compute).  
  A **hot PK** can throttle regardless of overall table capacity.
- **Adaptive capacity** shifts throughput to hot partitions, but it cannot fix a design that funnels massive traffic to the **same PK**.

### 4.2 Capacity modes and units
- **On-demand**: pay per request; perfect for bursty/unknown traffic.
- **Provisioned (+ Auto Scaling)**: specify RCUs/WCUs; best for predictable workloads.
- **RCU (Read Capacity Unit)** and **WCU (Write Capacity Unit)** are how DynamoDB bills throughput. (Binary sizes and consistency affect how many units a request costs.)

### 4.3 Avoiding hotspots (practical tactics)
- Ensure **high-cardinality PKs** for write-heavy entities.
- Use **write sharding** on keys that naturally concentrate traffic (e.g., `STATUS#<status>#<yyyy-mm>#<shard>` with `<shard> = hash(order_id) % N`).
- For time-series, **bucket** by time window (in PK or SK) to bound item counts per key.

---

## 5) Consistency

- **Strongly consistent reads**: base table + LSI only (optional flag). More RCU, lower latency SLO headroom.
- **Eventually consistent reads**: default for base table and **only option** for GSI. Faster/cheaper but not guaranteed to reflect the latest write immediately.
- Decide consistency **per access pattern**. If you pick eventual for a UX list, ensure the UI tolerates “slightly stale”.

---

## 6) Modeling patterns (with mini-examples)

### 6.1 One-to-many (aggregate in one collection)
- **Order** with **Lines, Payments, Shipments**:
  - `PK = ORDER#12345`, `SK = META | LINE#0001 | PAYMENT#<ts> | SHIPMENT#<ts>`
  - Fetch everything: `Query PK = ORDER#12345` (optionally `begins_with(SK, "LINE#")`).

### 6.2 Inverted indexes (global “by-X” lookups)
- **Orders by user** on **GSI**:
  - `GSI1PK = USER#<id>`, `GSI1SK = <placed_at>#ORDER#<order_id>` (DESC).
- **Posts by tag** on **GSI**:
  - `GSI2PK = TAG#<tag>`, `GSI2SK = <ts>#POST#<post_id>`.

### 6.3 Time-series and feeds
- Write-time fanout for **home feed**:
  - `GSI3PK = FEED#<user_id>`, `GSI3SK = <ts>#<shard>#POST#<id>` → fast read
- TTL on ephemeral items (likes, session logs), with **Export to S3** for analytics/retention.

### 6.4 Counters without contention
- `SET likes = if_not_exists(likes, 0) + :one`
- For very hot counters: **per-shard counters** aggregated periodically.

---

## 7) Conditions, idempotency, and transactions (correctness)

### 7.1 Conditional expressions
- Guard invariants with **conditions** (optimistic concurrency):
  - Inventory decrement: `SET available = available - :q  IF available >= :q`
  - Create-once: `PutItem ...  Condition: attribute_not_exists(PK) AND attribute_not_exists(SK)`

### 7.2 Idempotency (must-have)
- Clients include an **Idempotency-Key**; server stores it and uses a conditional write so **retries don’t duplicate** side-effects.
- Downstream consumers (Streams/Lambda) must also be idempotent (record processed ids).

### 7.3 Transactions vs Sagas
- **Transactions** (TransactWrite/TransactGet) → small, tight atomic groups.  
- **Sagas** (Streams + Lambda) → long-running, multi-aggregate workflows; include retries, DLQ, and compensating actions.

---

## 8) DynamoDB Streams (event-driven backbone)

- Enable **Streams** to capture item changes; process with **Lambda**.
- Typical uses: **payments**, **shipments**, **notifications**, **counters**, **search sync**, **analytics export**.
- Operate safely:
  - Watch **IteratorAge**.
  - Bound **batch size & concurrency**.
  - Add **DLQ** and visible **idempotency**.

> The **Outbox** pattern: write an `OUTBOX#<id>` item with your main write; a consumer delivers it to external systems.

---

## 9) Multi-tenancy (how to slice by tenant)

- **Shared table**: include `TENANT#<t>` in PK/SK; enforce tenant isolation via **IAM condition keys** (prefix/leading keys).
- **Per-tenant tables**: simplest isolation/compliance; more ops overhead.
- **KMS**: consider tenant-scoped CMKs for stronger isolation.

---

## 10) Evolution & migrations (without downtime)

- Prefer **additive** changes; tag items with a `schema_version` if structure changes.
- **Dual-write** old+new shape during a **compat window**.
- **Backfill** using Export-to-S3 + Glue/Athena, or throttled scans (avoid noisy neighbor).
- **Flip readers** with a feature flag; validate rollback early.

---

## 11) Cost engineering (what actually saves money)

- Pick **On-demand** for bursty/unknown; **Provisioned + Auto Scaling** for predictable.
- Keep **items small**; move blobs elsewhere; split **hot vs cold** attributes.
- Choose minimal **projections** on GSIs (KEYS_ONLY/INCLUDE).
- Avoid **N queries per screen**; design a **single Query** to serve the page.

---

## 12) Observability, SLOs & runbooks

**Metrics to watch**
- `ConsumedRead/WriteCapacityUnits`, `ThrottledRequests`
- `SuccessfulRequestLatency` (P95/P99)
- `ConditionalCheckFailedRequests`
- Streams: `IteratorAge`, DLQ depth

**Alarms**
- Sustained throttles > 0
- RCUs/WCUs > 80% for a window
- IteratorAge over recovery SLO

**Runbooks**
- *Hot key*: add sharding/bucketing; re-model if necessary.
- *IteratorAge climbing*: lower batch, raise parallelism, drain DLQ; check consumer errors.
- *ConditionalCheckFailed spike*: idempotency key missing/duplicated; fix retry logic.

---

## 13) Security & compliance

- **Encryption at rest** with **KMS**; review key policies.
- **TLS** in transit; **VPC endpoints** where needed.
- **Least-privilege IAM**; use conditions on `LeadingKeys` / prefixed PK.
- **PITR** (Point-In-Time Recovery) + **on-demand backups** around migrations.
- **Export to S3** for legal hold/analytics/long-term retention.

---

## 14) Glossary (quick-ref)

- **PK (Partition Key)**: hash key; groups items into an **item collection**; drives distribution across partitions.
- **SK (Sort Key)**: secondary part of the primary key; orders items within a PK so you can do range queries.
- **Item collection**: all items sharing the same PK (e.g., an Order with its lines, payments…).
- **LSI (Local Secondary Index)**: same PK as base, different SK; **strongly consistent reads**; 5 per table; 10 GB per item collection still applies.
- **GSI (Global Secondary Index)**: different PK/SK; **eventual reads**; up to 20 per table; projections control cost.
- **Projection**: which attributes are copied into the index (`KEYS_ONLY`, `INCLUDE`, `ALL`).
- **RCU/WCU**: capacity units that meter reads/writes.
- **Adaptive capacity**: DynamoDB’s automatic rebalancing of throughput to hotter partitions.
- **TTL**: time-to-live; auto-expires items (for cleanup; not precise to the second).
- **Streams**: change feed of item mutations (for Lambda/eventing).
- **Idempotency**: repeated calls produce the same side-effect once (guarded by conditional writes).

---

## 15) Do / Don’t (pin this)

**Do**

- Start from **access patterns**; test with real key distributions.
- Keep hot paths as **Get/Query**; push joins to write time.
- Use **decorated key values** and **sortable SK** (ISO-8601 timestamps).
- Use **conditional expressions** and **idempotency keys**.
- Add **GSI** only when a pattern needs another access path.
- Monitor **throttles**, **P95/P99**, **IteratorAge**, **DLQ**.

**Don’t**

- Don’t rely on `Scan` for user flows.
- Don’t funnel massive traffic to a **single PK** (shard/bucket instead).
- Don’t copy **ALL** attributes into every GSI by default.
- Don’t skip **PITR** or **restore drills**.
- Don’t assume Streams are exactly-once; your consumers must be idempotent.

---

## 16) Where to go next

- See **[E-commerce](ecom/index.md) → [Diagrams](ecom/diagrams.md)** to visualize **item collections** and **index overlays**.
- See **[Feed](feed/index.md) → [Diagrams](feed/diagrams.md)** to understand **write-time fanout** and **idempotent likes**.
- Try the **Queries ([E-commerce](ecom/queries.md) or [Feed](feed/queries.md))** pages to exercise `GetItem` / `Query` / conditional writes.

---
← to [Home](index.md)
