"use client";

import { Divider } from "@nextui-org/react";
import { SidebarNavigation } from "./sidebar-navigation";
import { SidebarWorkspaceDropdown } from "./sidebar-workspace-dropdown";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { SidebarCollapseButton } from "./sidebar-collapse-button";
import { SessionData } from "@auth0/nextjs-auth0/server";

interface Props {
  className?: string;
  children?: ReactNode;
  user?: SessionData["user"];
}

export function Sidebar({ className, children, user }: Props) {
  if (!user) {
    return null;
  }

  return (
    <>
      <div
        className={cn(
          "sticky top-0 bg-zinc-100 dark:bg-zinc-900 z-10",
          className
        )}
      >
        <div className="flex items-center py-1 px-2">
          <SidebarWorkspaceDropdown
            name={user.name ?? ""}
            picture={user.picture}
          />
          <SidebarCollapseButton />
        </div>
        <div className="py-1">
          <SidebarNavigation className="py-1 px-2" />
        </div>
        {Boolean(children) && <Divider />}
      </div>
      {children}
    </>
  );
}
