import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { MESSAGES } from "@/pkg/message";
import { DB_PREFIX } from "@/pkg/constants";

const redis = Redis.fromEnv();

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  const userId = url.searchParams.get("userId");

  if (!userId || !id) {
    return new NextResponse(MESSAGES.missingUserIdOrIdError, { status: 400 });
  }
  const key = [DB_PREFIX, userId].join(":");

  const members: DatabaseRecord[] = await redis.smembers(key);

  if (!members || members.length === 0) {
    return new NextResponse(MESSAGES.notFoundMessage, { status: 404 });
  }

  const record: DatabaseRecord | undefined = members.find(
    (member) => member.id === id
  );

  if (!record) {
    return new NextResponse(MESSAGES.recordNotFoundMessage, { status: 404 });
  }

  if (record.remainingReads !== null && record.remainingReads < 1) {
    await redis.srem(key, record);
    return new NextResponse(MESSAGES.recordRemovalMessage, { status: 404 });
  }

  let remainingReads: number | null = null;

  if (record.remainingReads !== null) {
    remainingReads = record.remainingReads - 1;
    await redis.srem(key, record);
    record.remainingReads = remainingReads;
    await redis.sadd(key, JSON.stringify(record));
  }

  return NextResponse.json({
    iv: record.iv,
    encrypted: record.encrypted,
    remainingReads,
  });
}
