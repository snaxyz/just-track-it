"use client";

import { Avatar } from "@mui/material";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  name?: string;
  picture?: string;
}

export function UserAvatar({ className, name, picture }: Props) {
  return (
    <Avatar className={cn("h-[2rem] w-[2rem]", className)} src={picture} alt={name}>
      {!picture && name ? name.charAt(0) : null}
    </Avatar>
  );
}
