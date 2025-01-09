"use client";

import { Monitor, Moon, Sun, SunMoonIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { Box, Button, Menu, MenuItem, IconButton } from "@mui/material";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  expanded?: boolean;
}

export function ThemeToggle({ className, expanded }: Props) {
  const { theme, setTheme } = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSetTheme = (newTheme: string) => {
    if (theme) {
      document.querySelector("body")?.classList.replace(theme, newTheme);
    }
    setTheme(newTheme);
    handleClose();
  };

  return (
    <Box className={className}>
      {expanded ? (
        <Button variant="outlined" startIcon={<SunMoonIcon size={16} />} onClick={handleClick}>
          Change theme
        </Button>
      ) : (
        <IconButton onClick={handleClick}>
          <SunMoonIcon size={16} />
        </IconButton>
      )}

      <Menu anchorEl={anchorEl} open={open} onClose={handleClose} className="bg-zinc-100 dark:bg-stone-900">
        <MenuItem onClick={() => handleSetTheme("light")}>
          <Sun size={16} className="mr-2" /> Light
        </MenuItem>
        <MenuItem onClick={() => handleSetTheme("dark")}>
          <Moon size={16} className="mr-2" /> Dark
        </MenuItem>
        <MenuItem onClick={() => handleSetTheme("system")}>
          <Monitor size={16} className="mr-2" /> System
        </MenuItem>
      </Menu>
    </Box>
  );
}
