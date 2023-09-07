import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const userId = url.searchParams.get("userId");

  if (!userId) {
    return new NextResponse("userId param is missing", { status: 400 });
  }

  const userHashKeys = await redis.smembers(`storeEnv:${userId}`);

  if (!userHashKeys || userHashKeys.length === 0) {
    return new NextResponse("No data found for the userId", { status: 404 });
  }

  return NextResponse.json(userHashKeys);
}

export const config = {
  runtime: "edge",
};
