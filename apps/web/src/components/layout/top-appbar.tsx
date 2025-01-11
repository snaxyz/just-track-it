"use client";

import { SidebarWorkspaceDropdown } from "./sidebar-workspace-dropdown";
import { Grow } from "./grow";
import { TopAppbarMenu } from "./top-appbar-menu";
import Link from "next/link";
import { Logo } from "../logo";
import type { SessionData } from "@auth0/nextjs-auth0/types";

interface Props {
  className?: string;
  children?: React.ReactNode;
  user?: SessionData["user"];
}

export function TopAppbar({ user, children, className }: Props) {
  return (
    <>
      <div className="p-1">
        <Link href="/">
          <Logo />
        </Link>
      </div>
      <Grow />
      <TopAppbarMenu user={user} />
      {user && <SidebarWorkspaceDropdown name={user.name ?? ""} picture={user.picture} />}
    </>
  );
}
