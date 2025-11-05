---
title: Feed Sample Data
---

# Feed Sample Data

Relate CSVs to **item shapes, GSIs, and queries**.  
Helpers: [`helpers.py`](../assets/samples/feed/helpers.py) · [`helpers.ts`](../assets/samples/feed/helpers.ts)  
Queries: [`queries.http`](../assets/samples/feed/queries.http)  
Seed: [`seed.jsonl`](../assets/samples/feed/seed.jsonl)

---

## users.csv  ([open](../assets/samples/feed/users.csv))
| user_id | email              | full_name | created_at           | handle   |
|--------:|--------------------|-----------|----------------------|----------|
| U100    | author@example.com | Author One| 2023-06-01T10:00:00Z | author1  |
| U300    | liker@example.com  | Liker     | 2024-02-15T12:00:00Z | likeguy  |
| U400    | follower@example.com| Follower | 2024-03-10T08:00:00Z | followme |

**Keys**: `PK=USER#<id>`, `SK=META`.

---

## posts.csv  ([open](../assets/samples/feed/posts.csv))
| post_id | author_id | created_at           | visibility | media_ref | text              |
|---------|-----------|----------------------|------------|-----------|-------------------|
| abc123  | U100      | 2025-11-04T09:00:00Z | public     |           | Hello DynamoDB!   |

**Base**: `PK=POST#<id>`, `SK=META`  
**GSI1**: `PK=USER#<author>`, `SK=<ts>#POST#<id>` (DESC).

---

## likes.csv  ([open](../assets/samples/feed/likes.csv))
| post_id | user_id | created_at           |
|---------|---------|----------------------|
| abc123  | U300    | 2025-11-04T09:06:00Z |

**Keys**: `PK=POST#<id>`, `SK=LIKE#<user_id>` (DESC).  
**Write rule**: Conditional Put for idempotency.

---

## comments.csv  ([open](../assets/samples/feed/comments.csv))
| post_id | comment_id | user_id | created_at           | text         |
|---------|------------|---------|----------------------|--------------|
| abc123  | c001       | U200    | 2025-11-04T09:05:00Z | Looks great! |

**Keys**: `PK=POST#<id>`, `SK=COMMENT#<comment_id>` (ASC).  
**Write rule**: Conditional Put for idempotency.

---

## hashtags.csv  ([open](../assets/samples/feed/hashtags.csv))
| post_id | tag       |
|---------|-----------|
| abc123  | dynamodb  |

**GSI2**: `PK=TAG#<tag>`, `SK=<ts>#POST#<id>` (DESC).

---

## feed_fanout.csv  ([open](../assets/samples/feed/feed_fanout.csv))
| post_id | follower_id | ts                   | shard |
|---------|-------------|----------------------|-------|
| abc123  | U400        | 2025-11-04T09:00:00Z | 01    |

**GSI3 (home feed)**: `PK=FEED#<user>`, `SK=<ts>#<shard>#POST#<id>` (DESC).

---

## follows.csv  ([open](../assets/samples/feed/follows.csv))
| follower_id | followee_id | created_at           |
|-------------|-------------|----------------------|
| U400        | U100        | 2025-06-01T10:00:00Z |

**Edge store**: `PK=FOLLOWEE#<user>`, `SK=FOLLOWER#<id>#<ts>` (or maintain via GSI_FOL).

---

## notifications.csv  ([open](../assets/samples/feed/notifications.csv))
| user_id | notif_id | type | ref          | created_at           | read  |
|---------|----------|------|--------------|----------------------|-------|
| U100    | N1001    | like | POST#abc123  | 2025-11-04T09:06:01Z | false |

**Unread index (GSI_NOTIF)**: `PK=USER#<id>#UNREAD`, `SK=<ts>#<notif_id>`.

---

## access_patterns.csv  ([open](../assets/samples/feed/access_patterns.csv))
| story_id | consumer | verb            | by        | filter     | order             | limit | consistency | SLA_ms |
|---------:|----------|-----------------|-----------|------------|-------------------|------:|------------|-------:|
| FEED-001 | UserSvc  | Get User        | user_id   |            |                   | 1     | STRONG     | 50     |
| FEED-002 | PostSvc  | List Posts      | author_id |            | created_at DESC   | 50    | EVENTUAL   | 100    |
| FEED-003 | FeedSvc  | Get Home Feed   | user_id   | shard=*    | created_at DESC   | 50    | EVENTUAL   | 120    |
| FEED-004 | PostSvc  | Get Post        | post_id   |            |                   | 1     | STRONG     | 60     |
| FEED-005 | Engage   | List Likes      | post_id   |            | created_at DESC   | 200   | EVENTUAL   | 150    |
| FEED-006 | Engage   | List Comments   | post_id   |            | created_at ASC    | 200   | EVENTUAL   | 180    |
| FEED-007 | Search   | Posts by Tag    | tag       |            | created_at DESC   | 200   | EVENTUAL   | 200    |
| FEED-008 | GraphSvc | Followers of    | user_id   |            | created_at DESC   | 500   | EVENTUAL   | 250    |
| FEED-009 | Notify   | Notifications   | user_id   | read=false | created_at DESC   | 50    | EVENTUAL   | 120    |
| FEED-010 | Ops      | Top Authors     | period    | yyyy-mm    | follower_count DESC| 100  | EVENTUAL   | 500    |

**Continue:** [Access Patterns](access-patterns.md) · [Diagrams](diagrams.md) · [Queries](queries.md)
