# AWS SDK v3 モックテスト

このディレクトリでは、AWS SDK v3 を使用した S3 と DynamoDB の操作に対するモックテストを実装しています。

## 概要

AWS SDK v3 の`aws-sdk-client-mock`を使用して、S3 と DynamoDB のクライアントの`send`メソッドをモック化し、ユニットテストを実装しています。

## 実装内容

### 1. S3 操作のテスト

- `uploadToS3`: S3 バケットにファイルをアップロードする関数
- `getFromS3`: S3 バケットからファイルを取得する関数

### 2. DynamoDB 操作のテスト

- `saveToDynamoDB`: DynamoDB テーブルにアイテムを保存する関数
- `getFromDynamoDB`: DynamoDB テーブルからアイテムを取得する関数

## モックの実装方法

### S3 クライアントのモック

```typescript
const s3Mock = mockClient(S3Client);

// PutObjectCommandのモック
s3Mock.on(PutObjectCommand).resolves({});

// GetObjectCommandのモック
s3Mock.on(GetObjectCommand).resolves({
  Body: mockStream,
});
```

### DynamoDB クライアントのモック

```typescript
const dynamoDBMock = mockClient(DynamoDBClient);

// PutItemCommandのモック
dynamoDBMock.on(PutItemCommand).resolves({});

// GetItemCommandのモック
dynamoDBMock.on(GetItemCommand).resolves({
  Item: expectedItem,
});
```

## テストの実行方法

```bash
npm test
```

## 注意点

1. S3 の GetObjectCommand のレスポンスはストリームとして返されるため、適切にストリームを処理する必要があります。
2. DynamoDB のアイテムは、AWS SDK の型定義に従って適切な形式で指定する必要があります。

## 依存関係

- @aws-sdk/client-s3
- @aws-sdk/client-dynamodb
- aws-sdk-client-mock
- jest
- ts-jest
- @types/jest
