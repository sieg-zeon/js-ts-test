import { DynamoDBClient, GetItemCommand, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { mockClient } from "aws-sdk-client-mock";
import { Readable } from "stream";
import { getFromDynamoDB, getFromS3, saveToDynamoDB, uploadToS3 } from "./main";

// S3クライアントのモック
const s3Mock = mockClient(S3Client);

// DynamoDBクライアントのモック
const dynamoDBMock = mockClient(DynamoDBClient);

describe("AWS Services", () => {
  beforeEach(() => {
    // 各テストの前にモックをリセット
    s3Mock.reset();
    dynamoDBMock.reset();
  });

  describe("S3 Operations", () => {
    it("should upload file to S3", async () => {
      // S3のPutObjectCommandをモック
      s3Mock.on(PutObjectCommand).resolves({});

      await expect(uploadToS3("test-bucket", "test-key", "test-content")).resolves.not.toThrow();
    });

    it("should get file from S3", async () => {
      // S3のGetObjectCommandをモック
      const mockStream = new Readable();
      mockStream.push("test-content");
      mockStream.push(null);

      // 型アサーションを使用
      const sdkStream = mockStream as any;

      s3Mock.on(GetObjectCommand).resolves({
        Body: sdkStream,
      });

      const result = await getFromS3("test-bucket", "test-key");
      expect(result).toBe("test-content");
    });
  });

  describe("DynamoDB Operations", () => {
    it("should save item to DynamoDB", async () => {
      // DynamoDBのPutItemCommandをモック
      dynamoDBMock.on(PutItemCommand).resolves({});

      const item = {
        id: { S: "123" },
        name: { S: "test-item" },
      };

      await expect(saveToDynamoDB("test-table", item)).resolves.not.toThrow();
    });

    it("should get item from DynamoDB", async () => {
      // DynamoDBのGetItemCommandをモック
      const expectedItem = {
        id: { S: "123" },
        name: { S: "test-item" },
      };

      dynamoDBMock.on(GetItemCommand).resolves({
        Item: expectedItem,
      });

      const result = await getFromDynamoDB("test-table", { id: { S: "123" } });
      expect(result).toEqual(expectedItem);
    });
  });
});
