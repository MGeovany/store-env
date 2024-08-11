import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { generateId } from "@/pkg/id";
import { encodeCompositeKey } from "@/pkg/encoding";
import { LATEST_KEY_VERSION } from "@/pkg/constants";

interface Request {
  encrypted: string;
  ttl?: number;
  reads: number;
  iv: string;
  userId?: string;
  encryptionKey: number[];
}

const redis = Redis.fromEnv();

export async function POST(req: NextRequest) {
  const { encrypted, ttl, reads, iv, userId, encryptionKey } =
    (await req.json()) as Request;
  const id = generateId();

  const encryptionKeyUint8Array = new Uint8Array(encryptionKey);

  const encodedUrl = encodeCompositeKey(
    LATEST_KEY_VERSION,
    id,
    encryptionKeyUint8Array
  );

  const key = ["storeEnv", userId].join(":");

  const tx = redis.multi();

  tx.sadd(
    key,
    JSON.stringify({
      remainingReads: reads > 0 ? reads : null,
      encrypted,
      iv,
      id,
      url: encodedUrl,
      date: new Date().toISOString(),
    })
  );

  if (ttl) {
    tx.expire(key, ttl);
  }
  tx.incr("storeEnv:metrics:writes");

  await tx.exec();
  return NextResponse.json({ id });
}

export const config = {
  runtime: "edge",
};
