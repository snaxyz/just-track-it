"use client";

import { Breadcrumbs, BreadcrumbItem } from "@/components/breadcrumbs";
import { ActivityIcon, DumbbellIcon, HistoryIcon, HomeIcon } from "lucide-react";
import { User } from "@auth0/nextjs-auth0/types";
import { DesktopAppbar } from "@/components/layout/desktop-appbar";

interface Props {
  user: User;
  id: string;
  workoutName: string;
}

export function WorkoutHistoryAppbar({ user, id, workoutName }: Props) {
  return (
    <DesktopAppbar user={user}>
      <Breadcrumbs>
        <BreadcrumbItem startContent={<HomeIcon size={16} />} href="/">
          Home
        </BreadcrumbItem>
        <BreadcrumbItem startContent={<HistoryIcon size={16} />} href="/history">
          History
        </BreadcrumbItem>
        <BreadcrumbItem startContent={<ActivityIcon size={16} />} href={`/history/${id}`}>
          {workoutName}
        </BreadcrumbItem>
      </Breadcrumbs>
    </DesktopAppbar>
  );
}
