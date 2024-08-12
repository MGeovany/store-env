import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { MESSAGES } from "@/pkg/message";
import { DB_PREFIX } from "@/pkg/constants";

const redis = Redis.fromEnv();

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const userId = url.searchParams.get("userId");

  if (!userId) {
    return new NextResponse(MESSAGES.missingUserIdOrIdError, { status: 400 });
  }

  const key = [DB_PREFIX, userId].join(":");

  const members: DatabaseStructure[] = await redis.smembers(key);

  if (!members || members.length === 0) {
    return new NextResponse(MESSAGES.noRecordsMessage, { status: 404 });
  }

  const data: DatabaseStructure[] = members.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return NextResponse.json(data);
}

export const config = {
  runtime: "edge",
};
