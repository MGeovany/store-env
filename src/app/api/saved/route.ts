import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const userId = url.searchParams.get("userId");

  if (!userId) {
    return new NextResponse("userId param is missing", { status: 400 });
  }

  const key = ["storeEnv", userId].join(":");

  const members = await redis.smembers(key);

  if (!members || members.length === 0) {
    return new NextResponse("Not Found", { status: 404 });
  }

  const data = members.map((member) => member);

  return NextResponse.json(data);
}

export const config = {
  runtime: "edge",
};
