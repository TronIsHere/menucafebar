import { PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import { getPublicObjectUrl } from "./urls";
import { getS3Bucket, getS3Client } from "./client";

const ALLOWED_CONTENT_TYPES = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/gif", "gif"],
]);

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export async function uploadMenuImage(
  cafeId: string,
  file: File
): Promise<{ url: string; key: string }> {
  if (!ALLOWED_CONTENT_TYPES.has(file.type)) {
    throw new Error("Invalid file type");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File too large");
  }

  const extension = ALLOWED_CONTENT_TYPES.get(file.type)!;
  const key = `menu/${cafeId}/${randomUUID()}.${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  await getS3Client().send(
    new PutObjectCommand({
      Bucket: getS3Bucket(),
      Key: key,
      Body: buffer,
      ContentType: file.type,
    })
  );

  return { key, url: getPublicObjectUrl(key) };
}
