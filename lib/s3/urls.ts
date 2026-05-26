import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getS3Bucket, getS3Client } from "./client";

function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, "");
}

/** Public object URL for ParsPack path-style buckets. */
export function getPublicObjectUrl(key: string): string {
  const endpoint = trimTrailingSlash(process.env.S3_ENDPOINT ?? "");
  const bucket = getS3Bucket();
  const normalizedKey = key.replace(/^\/+/, "");

  return `${endpoint}/${bucket}/${normalizedKey}`;
}

export async function getPresignedObjectUrl(
  key: string,
  expiresIn = 3600
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: getS3Bucket(),
    Key: key.replace(/^\/+/, ""),
  });

  return getSignedUrl(getS3Client(), command, { expiresIn });
}
