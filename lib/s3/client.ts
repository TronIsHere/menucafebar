import { S3Client } from "@aws-sdk/client-s3";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

let client: S3Client | null = null;

export function getS3Client(): S3Client {
  if (client) return client;

  const endpoint = requireEnv("S3_ENDPOINT");
  const region = process.env.S3_REGION ?? "us-east-1";

  client = new S3Client({
    endpoint,
    region,
    credentials: {
      accessKeyId: requireEnv("S3_ACCESS_KEY_ID"),
      secretAccessKey: requireEnv("S3_SECRET_ACCESS_KEY"),
    },
    forcePathStyle: process.env.S3_FORCE_PATH_STYLE !== "false",
  });

  return client;
}

export function getS3Bucket(): string {
  return requireEnv("S3_BUCKET");
}
