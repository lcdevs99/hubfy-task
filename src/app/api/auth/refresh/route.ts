
import { NextResponse } from "next/server";
import { refreshAuth } from "@/lib/auth";

export async function POST(req: Request) {
  const { refreshToken } = await req.json();

  const result = refreshAuth(refreshToken);

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 401 });
  }

  return NextResponse.json({ accessToken: result.accessToken });
}