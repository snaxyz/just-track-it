import { ReactNode } from "react";
import { SessionData } from "@auth0/nextjs-auth0/server";
import { HeartHandshakeIcon } from "lucide-react";
import { SidebarCollapseButton } from "./sidebar-collapse-button";
import { SidebarWorkspaceDropdown } from "./sidebar-workspace-dropdown";
import { cn } from "@/lib/utils";
import { Grow } from "./grow";
import { TopAppbarMenu } from "./top-appbar-menu";

interface Props {
  className?: string;
  children?: ReactNode;
  user?: SessionData["user"];
}

export function TopAppbar({ user, children, className }: Props) {
  return (
    <>
      <div className="capitalize flex text-secondary items-center justify-center">
        <span className="mr-2">
          <HeartHandshakeIcon size={22} />
        </span>
        Tracker
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
