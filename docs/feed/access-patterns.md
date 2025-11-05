---
title: Feed Access Patterns
---

# Feed Access Patterns

| story_id | consumer | verb         | by        | filter      | order               | limit | consistency | SLA_ms |
|---|---|---|---|---|---|---:|---|---:|
| FEED-001 | UserSvc   | Get User     | user_id   |             |                     | 1   | STRONG  | 50  |
| FEED-002 | PostSvc   | List Posts   | author_id |             | created_at DESC     | 50  | EVENTUAL| 100 |
| FEED-003 | FeedSvc   | Get Feed     | user_id   | shard=*     | created_at DESC     | 50  | EVENTUAL| 120 |
| FEED-004 | PostSvc   | Get Post     | post_id   |             |                     | 1   | STRONG  | 60  |
| FEED-005 | EngageSvc | List Likes   | post_id   |             | created_at DESC     | 200 | EVENTUAL| 150 |
| FEED-006 | EngageSvc | List Comments| post_id   |             | created_at ASC      | 200 | EVENTUAL| 180 |
| FEED-007 | SearchSvc | Posts by Tag | tag       |             | created_at DESC     | 200 | EVENTUAL| 200 |
| FEED-008 | GraphSvc  | Followers of | user_id   |             | created_at DESC     | 500 | EVENTUAL| 250 |
| FEED-009 | NotifySvc | Notifications| user_id   | read=false  | created_at DESC     | 50  | STRONG  | 120 |
| FEED-010 | Ops       | Top Authors  | period    |             | follower_count DESC | 100 | EVENTUAL| 500 |

> Shard home feed `SK` (e.g., `<ts>#<shard>#POST#<id>`) to avoid hot keys.
