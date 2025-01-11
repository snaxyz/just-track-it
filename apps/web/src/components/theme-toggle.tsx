"use client";

import { Button, Menu, MenuItem } from "@mui/material";
import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { useColorScheme } from "@mui/material/styles";
import { useState } from "react";

interface Props {
  expanded?: boolean;
}

export function ThemeToggle({ expanded }: Props) {
  const { mode, setMode } = useColorScheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  if (!mode) return null;

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSetMode = (newMode: "light" | "dark" | "system") => {
    setMode(newMode);
    handleClose();
  };

  const icon =
    mode === "light" ? <SunIcon size={16} /> : mode === "dark" ? <MoonIcon size={16} /> : <MonitorIcon size={16} />;

  return (
    <>
      <Button
        variant="text"
        onClick={handleClick}
        startIcon={icon}
        fullWidth={expanded}
        sx={{ justifyContent: expanded ? "flex-start" : "center" }}
      >
        {expanded && (mode === "light" ? "Light mode" : mode === "dark" ? "Dark mode" : "System")}
      </Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={() => handleSetMode("light")}>
          <SunIcon size={16} className="mr-2" /> Light
        </MenuItem>
        <MenuItem onClick={() => handleSetMode("dark")}>
          <MoonIcon size={16} className="mr-2" /> Dark
        </MenuItem>
        <MenuItem onClick={() => handleSetMode("system")}>
          <MonitorIcon size={16} className="mr-2" /> System
        </MenuItem>
      </Menu>
    </>
  );
}
