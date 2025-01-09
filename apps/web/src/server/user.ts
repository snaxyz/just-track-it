"use server";

import { redirect } from "next/navigation";
import { auth0 } from "./auth0";
import { normalizeUserId } from "@/lib/utils";

export async function getUserId() {
  const session = await auth0.getSession();

  if (!session?.user) {
    return redirect("/auth/login");
  }

  return normalizeUserId(session.user.sub);
}

export async function getUser() {
  const session = await auth0.getSession();

  if (!session?.user) {
    return redirect("/auth/login");
  }

  return {
    ...session.user,
    sub: normalizeUserId(session.user.sub),
  };
}
