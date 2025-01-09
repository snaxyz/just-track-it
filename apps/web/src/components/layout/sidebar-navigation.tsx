"use client";

import { cn } from "@/lib/utils";
import { Button } from "@mui/material";
import { ChartSplineIcon, DumbbellIcon, HomeIcon, SettingsIcon, SquareLibraryIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    title: "Home",
    Icon: HomeIcon,
    href: "/",
    exactMatch: true,
  },
  {
    title: "Workouts",
    Icon: DumbbellIcon,
    href: "/workouts",
    matchingHrefs: ["/sessions"],
  },
  {
    title: "Exercises",
    Icon: SquareLibraryIcon,
    href: "/exercises",
  },
  {
    title: "Settings",
    Icon: SettingsIcon,
    href: "/settings",
  },
];

interface Props {
  className?: string;
  itemClasses?: string;
}

function isLinkActive(pathname: string, href: string, exact?: boolean, matchingHrefs?: string[]) {
  if (exact) {
    return pathname === href;
  }
  return pathname.startsWith(href) || matchingHrefs?.some((h) => pathname.startsWith(h));
}

export function SidebarNavigation({ className, itemClasses }: Props) {
  const pathname = usePathname();

  return (
    <div className={className}>
      {navItems.map((nav) => (
        <Button
          key={nav.title}
          className={cn(
            "justify-start px-2 py-1 mb-1 text-foreground/60",
            isLinkActive(pathname, nav.href, nav.exactMatch, nav.matchingHrefs) && "text-foreground",
            itemClasses,
          )}
          variant="text"
          startIcon={<nav.Icon size={20} />}
          fullWidth
          component={Link}
          href={nav.href}
        >
          {nav.title}
        </Button>
      ))}
    </div>
  );
}
