import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { generateId } from "@/pkg/id";

type Request = {
  encrypted: string;
  ttl?: number;
  reads: number;
  iv: string;
};

const redis = Redis.fromEnv();

export async function POST(req: NextRequest) {
  const { encrypted, ttl, reads, iv } = (await req.json()) as Request;
  const id = generateId();
  console.log(encrypted, ttl, reads, iv, "im REQ");

  const key = ["storeenv", id].join(":");
  console.log(key, "im KEY");

  const tx = redis.multi();

  tx.hset(key, {
    remainingReads: reads > 0 ? reads : null,
    encrypted,
    iv,
  });
  if (ttl) {
    tx.expire(key, ttl);
  }
  tx.incr("storeenv:metrics:writes");

  await tx.exec();
  return NextResponse.json({ id });
}

export const config = {
  runtime: "edge",
};

/* export async function GET() {
  const res = await fetch("https://jsonplaceholder.typicode.com/todos", {
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();

  return NextResponse.json({ data });
}
 */
