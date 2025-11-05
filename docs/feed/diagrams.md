---
title: Feed Diagrams
---

# Feed Diagrams

### B3 ITEM-COLLECTION-POST
_Missing diagram_

### B4 INDEX-OVERLAY
_Missing diagram_

### B5 SHARDED-FEEDS
_Missing diagram_

### B6 STREAMS-PIPELINE
_Missing diagram_

### B7 IDEMPOTENT-LIKE-SEQUENCE
_Missing diagram_

### Item Collection — POST
```mermaid
flowchart TB
  classDef head fill:#eef5ff,stroke:#5b8def,stroke-width:1px,rx:6,ry:6;
  classDef item fill:#ffffff,stroke:#94a3b8,rx:6,ry:6;
  classDef tag  fill:#dcfce7,stroke:#22c55e,rx:6,ry:6;

  subgraph PK["PK = POST#abc123"]
    direction TB
    META["SK = META \\n {author_id,created_at,visibility,media_ref}"]:::head
    C1["SK = COMMENT#c001 \\n {user_id,created_at,text_len}"]:::item
    L1["SK = LIKE#u001 \\n {created_at}"]:::item
    T1["SK = TAG#dynamodb"]:::tag
  end
```