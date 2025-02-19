import { NextResponse } from "next/server";
import { sign } from "jsonwebtoken";
import { auth0 } from "@/server/auth0";
import { normalizeUserId } from "@/lib/utils";

export async function GET() {
  try {
    const accessToken = await auth0.getAccessToken();
    const session = await auth0.getSession();

    if (!accessToken || !session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Create a short-lived socket token
    const socketToken = sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 5, // 5 minutes
        sub: normalizeUserId(session.user.sub),
      },
      process.env.SOCKET_SECRET!,
    );

    return NextResponse.json({
      token: socketToken,
      url: process.env.NEXT_PUBLIC_AGENT_WSS_ENDPOINT,
    });
  } catch (error) {
    console.error("Failed to get socket credentials:", error);
    return NextResponse.json({ error: "Failed to get socket credentials" }, { status: 500 });
  }
}
