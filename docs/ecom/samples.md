---
title: E-commerce Sample Data
---

# E-commerce Sample Data

Use this page to connect **CSV samples → item shapes → access paths**.  
Helpers: [`helpers.py`](../assets/samples/ecom/helpers.py) · [`helpers.ts`](../assets/samples/ecom/helpers.ts)  
Queries: [`queries.http`](../assets/samples/ecom/queries.http)  
Seed: [`seed.jsonl`](../assets/samples/ecom/seed.jsonl)

---

## users.csv  ([open](../assets/samples/ecom/users.csv))
| user_id | email             | full_name    | created_at           | tier |
|--------:|-------------------|--------------|----------------------|------|
| U100    | sam@example.com   | Samarth Dev  | 2023-06-01T10:00:00Z | gold |

**Keys**: `PK=USER#<id>`, `SK=META` → strong read profile.  
**Used by**: ECOM-001 (GetItem).

---

## orders.csv  ([open](../assets/samples/ecom/orders.csv))
| order_id | user_id | status | placed_at            | total_cents | currency |
|---------:|--------:|--------|----------------------|------------:|----------|
| 12345    | U100    | Placed | 2025-11-04T10:00:00Z | 12999       | INR      |

**Base**: `PK=ORDER#<id>`, `SK=META`  
**GSI1**: `GSI1PK=USER#<id>`, `GSI1SK=<ts>#ORDER#<id>` (DESC) → ECOM-002  
**GSI2**: `GSI2PK=STATUS#<status>#<yyyy-mm>`, `GSI2SK=<ts>#<shard>#ORDER#<id>` (DESC) → ECOM-005

---

## order_lines.csv  ([open](../assets/samples/ecom/order_lines.csv))
| order_id | line_no | product_id    | qty | unit_price_cents |
|---------:|--------:|---------------|----:|-----------------:|
| 12345    | 1       | P-RED-TSHIRT  | 1   | 7999             |
| 12345    | 2       | P-BLK-CAP     | 1   | 5000             |

**Keys**: `PK=ORDER#<id>`, `SK=LINE#<0001…>` (ASC) → ECOM-004 (`begins_with`).

---

## payments.csv  ([open](../assets/samples/ecom/payments.csv))
| order_id | attempt_at           | status     | amount_cents | method | txn_ref |
|---------:|----------------------|------------|-------------:|--------|--------|
| 12345    | 2025-11-04T10:00:05Z | Authorized | 12999        | CARD   | TXN-777 |

**Base**: `PK=ORDER#<id>`, `SK=PAYMENT#<iso>` → ECOM-006  
**Optional GSI (pending queue)**: `PAYSTATUS#<status>` / `<attempted_at>#ORDER#<id>` → ECOM-007.

---

## shipments.csv  ([open](../assets/samples/ecom/shipments.csv))
| order_id | carrier | tracking_no | status       | updated_at           |
|---------:|--------:|-------------|--------------|----------------------|
| 12345    | DHL     | DHL-999     | LabelCreated | 2025-11-04T18:10:00Z |

**Base**: `PK=ORDER#<id>`, `SK=SHIPMENT#<iso>` → ECOM-008  
**Ops GSI (slice)**: `SHIP#<status>#<carrier>#<yyyy-mm>` / `<updated_at>#ORDER#<id>` → ECOM-010.

---

## products.csv  ([open](../assets/samples/ecom/products.csv))
| product_id   | sku            | name        | category   | price_cents | active | updated_at           |
|--------------|----------------|-------------|------------|------------:|:------:|----------------------|
| P-RED-TSHIRT | SKU-TS-RED-001 | Red T-Shirt | Apparel    | 7999        | true   | 2025-11-01T08:00:00Z |
| P-BLK-CAP    | SKU-CAP-BLK-001| Black Cap   | Accessories| 5000        | true   | 2025-11-01T08:00:00Z |

**Inventory decrement**: `UpdateItem SET available = available - :q IF available >= :q` (ECOM-009).

---

## inventory_snapshots.csv  ([open](../assets/samples/ecom/inventory_snapshots.csv))
| product_id   | as_of_ymd | available | reserved | updated_at           |
|--------------|-----------|----------:|---------:|----------------------|
| P-RED-TSHIRT | 2025-11-04| 120       | 5        | 2025-11-04T18:00:00Z |

**Keys**: `PK=PRODUCT#<id>`, `SK=INV#SNAP#<yyyy-mm-dd>` → analytics/TTL.

---

## addresses.csv  ([open](../assets/samples/ecom/addresses.csv))
| user_id | address_id | line1    | line2 | city      | state | postal_code | country | is_default | updated_at           |
|--------:|------------|----------|-------|-----------|-------|-------------|---------|:----------:|----------------------|
| U100    | ADDR1      | 12 MG Rd |       | Bengaluru | KA    | 560001      | IN      | true       | 2025-11-05T08:00:00Z |

---

## events_outbox.csv  ([open](../assets/samples/ecom/events_outbox.csv))
| event_id | aggregate_id | aggregate_type | event_type    | payload_json         | occurred_at           | published_at |
|---------:|--------------|----------------|---------------|----------------------|-----------------------|--------------|
| EVT-1001 | ORDER#12345  | order          | ORDER_PLACED  | {"order_id":"12345"} | 2025-11-04T10:00:00Z |              |

**Pattern**: outbox table → Streams/Lambda or bus, idempotent publishers.

---

## access_patterns.csv  ([open](../assets/samples/ecom/access_patterns.csv))
| story_id | consumer   | verb               | by        | filter                 | order            | limit | consistency | SLA_ms |
|---------:|------------|--------------------|-----------|------------------------|------------------|------:|------------|-------:|
| ECOM-001 | UserSvc    | Get User           | user_id   |                        |                  | 1     | STRONG     | 50     |
| ECOM-002 | OrderSvc   | List Orders        | user_id   |                        | placed_at DESC   | 25    | EVENTUAL   | 100    |
| ECOM-003 | OrderSvc   | Get Order          | order_id  |                        |                  | 1     | STRONG     | 50     |
| ECOM-004 | OrderSvc   | List OrderLines    | order_id  |                        | line_no ASC      | 200   | EVENTUAL   | 150    |
| ECOM-005 | Backoffice | List Orders        | status    | date_bucket=yyyy-mm    | placed_at DESC   | 200   | EVENTUAL   | 250    |
| ECOM-006 | PaymentSvc | Get Payments       | order_id  |                        | attempted_at DESC| 5     | STRONG     | 80     |
| ECOM-007 | PaymentSvc | Find Pending       | status    | Pending                | attempted_at ASC | 200   | EVENTUAL   | 250    |
| ECOM-008 | ShipmentSvc| Get Shipments      | order_id  |                        | updated_at DESC  | 5     | EVENTUAL   | 120    |
| ECOM-009 | Inventory  | Reserve/Decrement  | product_id|                        |                  | 1     | WRITE      | 60     |
| ECOM-010 | Ops        | Orders Dashboard   | status    | carrier=…              | updated_at DESC  | 100   | EVENTUAL   | 500    |
| ECOM-011 | Archive    | Export Old Orders  | placed_at | <now-90d               |                  | 1000  | OFFLINE    | NA     |

**Continue:** [Access Patterns](access-patterns.md) · [Diagrams](diagrams.md) · [Queries](queries.md)
