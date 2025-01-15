import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { sign } from "jsonwebtoken";
import { auth0 } from "@/server/auth0";

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
        sub: session.user.sub,
      },
      process.env.SOCKET_SECRET!,
    );
    const cookieStore = await cookies();
    // Set it as an HTTP-only cookie
    cookieStore.set("socket_token", socketToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 300, // 5 minutes
    });

    return NextResponse.json({
      url: process.env.NEXT_PUBLIC_AGENT_URL,
    });
  } catch (error) {
    console.error("Failed to get socket credentials:", error);
    return NextResponse.json({ error: "Failed to get socket credentials" }, { status: 500 });
  }
}
