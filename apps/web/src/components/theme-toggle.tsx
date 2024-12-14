"use client";

import { Monitor, Moon, Sun, SunMoonIcon } from "lucide-react";
import { useTheme } from "next-themes";
import {
  Button,
  cn,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";

interface Props {
  className?: string;
  expanded?: boolean;
}

export function ThemeToggle({ className, expanded }: Props) {
  const { theme, setTheme } = useTheme();

  const handleSetTheme = (newTheme: string) => {
    if (theme) {
      document.querySelector("body")?.classList.replace(theme, newTheme);
    }
    setTheme(newTheme);
  };

  return (
    <Dropdown className={cn("min-w-0 w-fit", className)}>
      <DropdownTrigger>
        <Button
          variant="bordered"
          startContent={expanded ? <SunMoonIcon size={16} /> : null}
        >
          {expanded ? "Change theme" : <SunMoonIcon size={16} />}
        </Button>
      </DropdownTrigger>
      <DropdownMenu className="bg-zinc-200 dark:bg-zinc-800 rounded-lg">
        <DropdownItem
          key="light"
          onPress={() => handleSetTheme("light")}
          startContent={<Sun size={16} />}
        >
          Light
        </DropdownItem>
        <DropdownItem
          key="dark"
          onPress={() => handleSetTheme("dark")}
          startContent={<Moon size={16} />}
        >
          Dark
        </DropdownItem>
        <DropdownItem
          key="system"
          onPress={() => handleSetTheme("system")}
          startContent={<Monitor size={16} />}
        >
          System
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
