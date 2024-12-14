"use client";

import { Divider } from "@nextui-org/react";
import { SidebarNavigation } from "./sidebar-navigation";
import { SidebarWorkspaceDropdown } from "./sidebar-workspace-dropdown";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { SidebarCollapseButton } from "./sidebar-collapse-button";
import { SessionData } from "@auth0/nextjs-auth0/server";
import { BicepsFlexedIcon, HeartHandshakeIcon } from "lucide-react";
import { kalam } from "@/app/fonts";
import { Logo } from "../logo";
import Link from "next/link";

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
          <div
            className={cn(
              "p-4 capitalize flex mb-2 items-center justify-center w-full"
            )}
          >
            <Link href="/">
              <Logo />
            </Link>
          </div>
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
