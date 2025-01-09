"use client";

import { cn } from "@/lib/utils";
import { Avatar } from "@nextui-org/react";

interface Props {
  className?: string;
  name?: string;
  picture?: string;
}

export function UserAvatar({ className, name, picture }: Props) {
  return (
    <Avatar
      className={cn("h-[2rem] w-[2rem]", className)}
      src={picture}
      name={name}
    ></Avatar>
  );
}
