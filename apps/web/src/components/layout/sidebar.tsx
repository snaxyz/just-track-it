"use client";

import { Divider } from "@nextui-org/react";
import { SidebarNavigation } from "./sidebar-navigation";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import type { SessionData } from "@auth0/nextjs-auth0/types";
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
          <div className={cn("p-4 capitalize flex mb-2 items-center w-full")}>
            <Link href="/">
              <Logo />
            </Link>
          </div>
        </div>
        <div className="py-1">
          <SidebarNavigation className="py-1 px-4" />
        </div>
        {Boolean(children) && <Divider />}
      </div>
      {children}
    </>
  );
}
