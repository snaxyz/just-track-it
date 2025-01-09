"use client";

import { cn } from "@/lib/utils";
import { getUserSettings } from "@/server/settings";
import { useQuery } from "@tanstack/react-query";
import { SlideIn } from "../animations/slide-in";
import { useUserId } from "@/lib/hooks/use-user";

interface Props {
  className?: string;
  children: React.ReactNode;
}

export function SidebarContainer({ className, children }: Props) {
  const userId = useUserId();
  const { data } = useQuery({
    queryKey: ["settings"],
    queryFn: () => getUserSettings(userId),
  });

  const collapsed = data?.sidebarCollapsed;

  return (
    <SlideIn
      className={cn(
        "fixed top-0 left-0 z-100 h-full w-[200px] bg-stone-50 dark:bg-stone-950 overflow-auto",
        className
      )}
      visible={!collapsed}
      offset={200}
    >
      {children}
    </SlideIn>
  );
}
