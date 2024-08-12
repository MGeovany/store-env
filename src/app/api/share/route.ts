import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { generateId } from "@/pkg/id";
import { encodeCompositeKey } from "@/pkg/encoding";
import { DB_PREFIX, LATEST_KEY_VERSION } from "@/pkg/constants";
import { fromBase58 } from "@/util/base58";

interface Request {
  encrypted: string;
  ttl?: number;
  reads: number;
  iv: string;
  userId?: string;
  encryptionKey: string;
}

const redis = Redis.fromEnv();

export async function POST(req: NextRequest) {
  const { encrypted, ttl, reads, iv, userId, encryptionKey } =
    (await req.json()) as Request;
  const id = generateId();

  const decodedKey = fromBase58(encryptionKey);

  const encodedUrl = encodeCompositeKey(LATEST_KEY_VERSION, id, decodedKey);

  const key = [DB_PREFIX, userId].join(":");

  const tx = redis.multi();

  tx.sadd(
    key,
    JSON.stringify({
      remainingReads: reads > 0 ? reads : null,
      encrypted,
      iv,
      id,
      url: encodedUrl,
      createdAt: new Date().toISOString(),
    })
  );

  if (ttl) {
    tx.expire(key, ttl);
  }
  tx.incr(`${DB_PREFIX}:metrics:writes`);

  await tx.exec();
  return NextResponse.json({ id });
}

export const config = {
  runtime: "edge",
};
