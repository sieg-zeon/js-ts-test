import { DynamoDBClient, GetItemCommand, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Readable } from "stream";

// S3クライアントの初期化
const s3Client = new S3Client({ region: "ap-northeast-1" });

// DynamoDBクライアントの初期化
const dynamoDBClient = new DynamoDBClient({ region: "ap-northeast-1" });

// S3にファイルをアップロードする関数
export async function uploadToS3(bucket: string, key: string, body: string): Promise<void> {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: body,
  });
  await s3Client.send(command);
}

// S3からファイルを取得する関数
export async function getFromS3(bucket: string, key: string): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });
  const response = await s3Client.send(command);

  if (!response.Body) {
    return "";
  }

  // ストリームからデータを読み取る
  const stream = response.Body as Readable;
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on("data", (chunk: Buffer) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
  });
}

// DynamoDBにアイテムを保存する関数
export async function saveToDynamoDB(tableName: string, item: Record<string, any>): Promise<void> {
  const command = new PutItemCommand({
    TableName: tableName,
    Item: item,
  });
  await dynamoDBClient.send(command);
}

// DynamoDBからアイテムを取得する関数
export async function getFromDynamoDB(
  tableName: string,
  key: Record<string, any>,
): Promise<Record<string, any> | null> {
  const command = new GetItemCommand({
    TableName: tableName,
    Key: key,
  });
  const response = await dynamoDBClient.send(command);
  return response.Item || null;
}
