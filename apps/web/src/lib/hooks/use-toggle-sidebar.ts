import { updateUserSettingSidebarCollapsed } from "@/server/settings";
import { useQueryClient } from "@tanstack/react-query";
import { useUserId } from "./use-user";

interface Props {
  collapsed?: boolean;
}

export function useToggleSidebar({ collapsed }: Props) {
  const userId = useUserId();
  const queryClient = useQueryClient();
  const toggleSidebar = async () => {
    const newState = typeof collapsed === "boolean" ? !collapsed : true;
    await updateUserSettingSidebarCollapsed(userId, newState);
    queryClient.setQueryData(["settings"], {
      sidebarCollapsed: newState,
    });
    // queryClient.invalidateQueries({
    //   queryKey: ["settings"],
    // });
  };
  return toggleSidebar;
}
