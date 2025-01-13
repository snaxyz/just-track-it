"use client";

import { Box } from "@mui/material";
import { AvatarMenu } from "./avatar-menu";
import { Grow } from "./grow";
import { MobileAppbarMenu } from "./mobile-appbar-menu";
import Link from "next/link";
import { Logo } from "../logo";
import type { SessionData } from "@auth0/nextjs-auth0/types";
import { SxProps, Theme } from "@mui/material/styles";

interface Props {
  sx?: SxProps<Theme>;
  children?: React.ReactNode;
  user?: SessionData["user"];
}

export function MobileAppbar({ user, children, sx }: Props) {
  return (
    <>
      <Box sx={{ p: 1, ...sx }}>
        <Link href="/">
          <Logo />
        </Link>
      </Box>
      <Grow />
      <MobileAppbarMenu user={user} />
      {user && <AvatarMenu name={user.name ?? ""} picture={user.picture} />}
    </>
  );
}
