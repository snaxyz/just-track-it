"use client";

import { Moon, Sun } from "lucide-react";
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
    <div className="flex items-center gap-2">
      <Dropdown className={cn("min-w-0 w-fit", className)}>
        <DropdownTrigger>
          <Button isIconOnly variant="light">
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownTrigger>
        <DropdownMenu className="bg-zinc-200 dark:bg-zinc-800 rounded-lg">
          <DropdownItem key="light" onPress={() => handleSetTheme("light")}>
            Light
          </DropdownItem>
          <DropdownItem key="dark" onPress={() => handleSetTheme("dark")}>
            Dark
          </DropdownItem>
          <DropdownItem key="system" onPress={() => handleSetTheme("system")}>
            System
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      {expanded && <span>Change theme</span>}
    </div>
  );
}
