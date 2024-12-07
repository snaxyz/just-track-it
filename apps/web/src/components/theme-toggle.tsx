"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const handleSetTheme = (newTheme: string) => {
    if (theme) {
      document.querySelector("body")?.classList.replace(theme, newTheme);
    }
    setTheme(newTheme);
  };

  return (
    <Dropdown className="min-w-0 w-fit">
      <DropdownTrigger>
        <Button isIconOnly variant="light" size="sm">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownTrigger>
      <DropdownMenu className="bg-zinc-200 dark:bg-zinc-800 rounded-lg">
        <DropdownItem onPress={() => handleSetTheme("light")}>
          Light
        </DropdownItem>
        <DropdownItem onPress={() => handleSetTheme("dark")}>Dark</DropdownItem>
        <DropdownItem onPress={() => handleSetTheme("system")}>
          System
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
