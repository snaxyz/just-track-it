import { useUser } from "@auth0/nextjs-auth0";
import { normalizeUserId } from "../utils";

export function useUserId() {
  const session = useUser();

  return normalizeUserId(session?.user?.sub ?? "");
}
