import { useUser as useAuth0User } from "@auth0/nextjs-auth0";
import { normalizeUserId } from "../utils";

export function useUserId() {
  const session = useUser();

  return normalizeUserId(session?.user?.sub ?? "");
}

export function useUser() {
  const session = useAuth0User();

  return {
    user: session?.user,
    sub: normalizeUserId(session?.user?.sub ?? ""),
  };
}
