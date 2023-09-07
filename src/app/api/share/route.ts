import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { generateId } from "@/pkg/id";

type Request = {
  encrypted: string;
  ttl?: number;
  reads: number;
  iv: string;
  userId?: string;
};

const redis = Redis.fromEnv();

export async function POST(req: NextRequest) {
  const { encrypted, ttl, reads, iv, userId } = (await req.json()) as Request;
  const id = generateId();
  console.log(encrypted, ttl, reads, iv, "im REQ");

  const key = ["storeEnv", userId].join(":");

  const tx = redis.multi();

  tx.sadd(key, {
    remainingReads: reads > 0 ? reads : null,
    encrypted,
    iv,
    id,
  });
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
