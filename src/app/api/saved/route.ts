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

  const members: DatabaseStructure[] = await redis.smembers(key);

  if (!members || members.length === 0) {
    return new NextResponse(
      "No records! Please start saving your env files. Go to /share",
      { status: 404 }
    );
  }

  const data: DatabaseStructure[] = members.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return NextResponse.json(data);
}

export const config = {
  runtime: "edge",
};
