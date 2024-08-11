import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  const userId = url.searchParams.get("userId");

  if (!userId || !id) {
    return new NextResponse("Missing userId or id param", { status: 400 });
  }
  const key = ["storeEnv", userId].join(":");

  const members = await redis.smembers(key);

  if (!members || members.length === 0) {
    return new NextResponse("Not Found", { status: 404 });
  }

  const record = members.find((member) => member.id === id);

  if (!record) {
    return new NextResponse("Record Not Found", { status: 404 });
  }

  const data = record;

  if (data.remainingReads !== null && data.remainingReads < 1) {
    await redis.srem(key, record);
    return new NextResponse("Not Found", { status: 404 });
  }
  let remainingReads: number | null = null;

  if (data.remainingReads !== null) {
    remainingReads = data.remainingReads - 1;
    await redis.srem(key, record);
    data.remainingReads = remainingReads;
    await redis.sadd(key, JSON.stringify(data));
  }

  return NextResponse.json({
    iv: data.iv,
    encrypted: data.encrypted,
    remainingReads,
  });
}

export const config = {
  runtime: "edge",
};
