"use client";

import { Breadcrumbs, BreadcrumbItem } from "@/components/breadcrumbs";
import { DumbbellIcon, HistoryIcon, HomeIcon } from "lucide-react";
import { User } from "@auth0/nextjs-auth0/types";
import { DesktopAppbar } from "@/components/layout/desktop-appbar";

interface Props {
  user: User;
  id: string;
}

export function HistoryAppbar({ user, id }: Props) {
  return (
    <DesktopAppbar user={user}>
      <Breadcrumbs>
        <BreadcrumbItem startContent={<HomeIcon size={16} />} href="/">
          Home
        </BreadcrumbItem>
        <BreadcrumbItem startContent={<DumbbellIcon size={16} />} href="/workouts">
          Workouts
        </BreadcrumbItem>
        <BreadcrumbItem startContent={<HistoryIcon size={16} />} href={`/workouts/${id}/history`}>
          History
        </BreadcrumbItem>
      </Breadcrumbs>
    </DesktopAppbar>
  );
}
