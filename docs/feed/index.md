---
title: Feed Overview
---

# Social/Activity Feed Overview

**Scope:** Users, Follows, Posts, Likes, Comments, Tags, Notifications, Feed fanout.

## Access Patterns (representative)
- Author timeline (**GSI: PostsByAuthor**)
- Posts by tag (**GSI: PostsByTag**)
- Home feed (**GSI: FeedByUser** with shard in `SK`, write-time fanout)
- Idempotent Likes; ordered Comments; Notifications & Counters via Streams

## Index Strategy
- **GSI1 — PostsByAuthor**: `PK = USER#<author>`, `SK = <ts>#POST#<id>` (DESC)
- **GSI2 — PostsByTag**: `PK = TAG#<tag>`, `SK = <ts>#POST#<id>` (DESC)
- **GSI3 — FeedByUser**: `PK = FEED#<user>`, `SK = <ts>#<shard>#POST#<id>` (DESC)

**Continue:** [Access Patterns](access-patterns.md) · [Diagrams](diagrams.md) · [Queries](queries.md)
