"use client";

import { SessionData } from "@auth0/nextjs-auth0/server";
import { HeartHandshakeIcon } from "lucide-react";
import { SidebarWorkspaceDropdown } from "./sidebar-workspace-dropdown";
import { Grow } from "./grow";
import { TopAppbarMenu } from "./top-appbar-menu";
import Link from "next/link";
import { permanentMarker } from "@/app/fonts";

interface Props {
  className?: string;
  children?: React.ReactNode;
  user?: SessionData["user"];
}

export function TopAppbar({ user, children, className }: Props) {
  return (
    <>
      <div className="capitalize flex items-center justify-center text-sm">
        <Link href="/" className={permanentMarker.className}>
          Just Track It
        </Link>
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
