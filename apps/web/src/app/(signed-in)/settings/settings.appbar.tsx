"use client";

import { Breadcrumbs, BreadcrumbItem } from "@/components/breadcrumbs";
import { HomeIcon, SettingsIcon } from "lucide-react";
import { User } from "@auth0/nextjs-auth0/types";
import { DesktopAppbar } from "@/components/layout/desktop-appbar";

interface Props {
  user: User;
}

export function SettingsAppbar({ user }: Props) {
  return (
    <DesktopAppbar user={user}>
      <Breadcrumbs>
        <BreadcrumbItem startContent={<HomeIcon size={16} />} href="/">
          Home
        </BreadcrumbItem>
        <BreadcrumbItem startContent={<SettingsIcon size={16} />} href="/settings">
          Settings
        </BreadcrumbItem>
      </Breadcrumbs>
    </DesktopAppbar>
  );
}
