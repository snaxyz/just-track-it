import { getUserSettings } from "@/server/actions/settings";
import { useQuery } from "@tanstack/react-query";
import { useUserId } from "./use-user";

export function useUserSettings() {
  const userId = useUserId();
  const { data } = useQuery({
    queryKey: ["settings"],
    queryFn: () => getUserSettings(userId),
  });
  return data;
}
