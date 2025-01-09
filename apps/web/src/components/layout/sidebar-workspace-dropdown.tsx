"use client";

import { Box, IconButton, Menu, MenuItem } from "@mui/material";
import { UserAvatar } from "../user-avatar";
import { useState } from "react";

interface Props {
  name: string;
  picture?: string;
}

export function SidebarWorkspaceDropdown({ name, picture }: Props) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const dropdownTitle = `${name}'s space`;

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <IconButton onClick={handleClick} title={dropdownTitle}>
        <UserAvatar className="h-[1.5rem] w-[1.5rem] shrink-0" picture={picture ?? ""} />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        className="bg-zinc-100 dark:bg-stone-900 rounded-lg"
      >
        <MenuItem component="a" href="/auth/logout?returnTo=https://justtrackitapp.com/login" onClick={handleClose}>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
}
