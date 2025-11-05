---
title: Feed Queries
---

# Feed Queries


SigV4-compatible HTTP payloads.  
**Parameters used:** `REGION=ap-south-1`, `TABLE=PlaybookFeed`, `GSI1=GSI1_PostsByAuthor`, `GSI2=GSI2_PostsByTag`, `GSI3=GSI3_FeedByUser`.


### 1) Get Post (STRONG)
```http
POST https://dynamodb.ap-south-1.amazonaws.com/
X-Amz-Target: DynamoDB_20120810.GetItem
Content-Type: application/x-amz-json-1.0

{
  "TableName": "PlaybookFeed",
  "Key": {
    "PK": {"S": "POST#abc123"},
    "SK": {"S": "META"}
  },
  "ConsistentRead": true
}
```

### 2) Author timeline (GSI1)
```http
POST https://dynamodb.ap-south-1.amazonaws.com/
X-Amz-Target: DynamoDB_20120810.Query
Content-Type: application/x-amz-json-1.0

{
  "TableName": "PlaybookFeed",
  "IndexName": "GSI1_PostsByAuthor",
  "KeyConditionExpression": "GSI1PK = :a",
  "ExpressionAttributeValues": {
    ":a": {"S": "USER#U100"}
  },
  "ScanIndexForward": false,
  "Limit": 50
}
```

### 3) Posts by Tag (GSI2)
```http
POST https://dynamodb.ap-south-1.amazonaws.com/
X-Amz-Target: DynamoDB_20120810.Query
Content-Type: application/x-amz-json-1.0

{
  "TableName": "PlaybookFeed",
  "IndexName": "GSI2_PostsByTag",
  "KeyConditionExpression": "GSI2PK = :t",
  "ExpressionAttributeValues": {
    ":t": {"S": "TAG#dynamodb"}
  },
  "ScanIndexForward": false,
  "Limit": 50
}
```

### 4) Home Feed (GSI3)
```http
POST https://dynamodb.ap-south-1.amazonaws.com/
X-Amz-Target: DynamoDB_20120810.Query
Content-Type: application/x-amz-json-1.0

{
  "TableName": "PlaybookFeed",
  "IndexName": "GSI3_FeedByUser",
  "KeyConditionExpression": "GSI3PK = :u",
  "ExpressionAttributeValues": {
    ":u": {"S": "FEED#U400"}
  },
  "ScanIndexForward": false,
  "Limit": 50
}
```

### 5) Idempotent Like (conditional Put)
```http
POST https://dynamodb.ap-south-1.amazonaws.com/
X-Amz-Target: DynamoDB_20120810.PutItem
Content-Type: application/x-amz-json-1.0

{
  "TableName": "PlaybookFeed",
  "Item": {
    "PK": {"S":"POST#abc123"},
    "SK": {"S":"LIKE#U300"},
    "created_at": {"S":"2025-11-04T09:06:00Z"}
  },
  "ConditionExpression": "attribute_not_exists(PK) AND attribute_not_exists(SK)"
}
```