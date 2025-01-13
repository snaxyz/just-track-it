"use client";

import { Box, Avatar, Menu, MenuItem, IconButton } from "@mui/material";
import { LogOutIcon } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

interface Props {
  name: string;
  picture?: string | null;
}

export function AvatarMenu({ name, picture }: Props) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <IconButton
        onClick={handleClick}
        size="small"
        aria-controls={open ? "account-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
      >
        <Avatar
          src={picture ?? undefined}
          alt={name}
          sx={{
            width: 24,
            height: 24,
          }}
        />
      </IconButton>
      <Menu
        id="account-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem component={Link} href="/auth/logout">
          <LogOutIcon size={16} style={{ marginRight: 8 }} />
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
}
