# Design Review Checklist (DynamoDB)
- [ ] Access-pattern matrix documented (who/what/why/SLA).
- [ ] Single-table decision justified.
- [ ] PK/SK generic names (PK, SK) + decorated values.
- [ ] Hot paths are Get/Query (no Scan).
- [ ] Sort keys encode order/time where needed.
- [ ] High-cardinality PKs; write sharding for hotspots.
