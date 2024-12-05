"use client";

import { SessionData } from "@auth0/nextjs-auth0/server";
import { HeartHandshakeIcon } from "lucide-react";
import { SidebarWorkspaceDropdown } from "./sidebar-workspace-dropdown";
import { Grow } from "./grow";
import { TopAppbarMenu } from "./top-appbar-menu";
import { usePathname } from "next/navigation";

interface Props {
  className?: string;
  children?: React.ReactNode;
  user?: SessionData["user"];
}

export function TopAppbar({ user, children, className }: Props) {
  return (
    <>
      <div className="capitalize flex items-center justify-center text-sm">
        <span className="mr-2">
          <HeartHandshakeIcon size={16} />
        </span>
        {children ?? "Tracker"}
      </div>
      <Grow />
      <TopAppbarMenu />
      {user && (
        <SidebarWorkspaceDropdown
          name={user.name ?? ""}
          picture={user.picture}
        />
      )}
    </>
  );
}
