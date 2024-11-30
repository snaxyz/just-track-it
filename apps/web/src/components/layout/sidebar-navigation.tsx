"use client";

import { cn } from "@/lib/utils";
import { Button } from "@nextui-org/react";
import {
  DumbbellIcon,
  HomeIcon,
  SearchIcon,
  SettingsIcon,
  SquareLibraryIcon,
  WorkflowIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    title: "Dashboard",
    Icon: HomeIcon,
    href: "/",
    exactMatch: true,
  },
  {
    title: "Workouts",
    Icon: DumbbellIcon,
    href: "/workouts",
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

function isLinkActive(pathname: string, href: string, exact?: boolean) {
  if (exact) {
    return pathname === href;
  }
  return pathname.startsWith(href);
}

export function SidebarNavigation({ className, itemClasses }: Props) {
  const pathname = usePathname();

  return (
    <div className={className}>
      {/* <Button
        className="justify-start px-2 py-1 mb-1 text-foreground/60"
        variant="light"
        startContent={<SearchIcon size={20} />}
        fullWidth
        radius="sm"
        size="sm"
      >
        Search
      </Button> */}
      {navItems.map((nav) => (
        <Button
          key={nav.title}
          className={cn(
            "justify-start px-2 py-1 mb-1 text-foreground/60",
            isLinkActive(pathname, nav.href, nav.exactMatch) &&
              "text-foreground",
            itemClasses
          )}
          variant="light"
          startContent={<nav.Icon size={20} />}
          fullWidth
          radius="sm"
          size="sm"
          as={Link}
          href={nav.href}
        >
          {nav.title}
        </Button>
      ))}
    </div>
  );
}
