"use client";

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { UserAvatar } from "../user-avatar";

interface Props {
  name: string;
  picture?: string;
}

export function SidebarWorkspaceDropdown({ name, picture }: Props) {
  const dropdownTitle = `${name}'s space`;

  return (
    <Dropdown className="min-w-0 w-fit">
      <DropdownTrigger>
        <Button variant="light" title={dropdownTitle} radius="lg" isIconOnly>
          <UserAvatar
            className="h-[1.5rem] w-[1.5rem] shrink-0"
            // name={name}
            picture={picture ?? ""}
          />
          {/* <span className="overflow-hidden text-ellipsis whitespace-nowrap max-w-[8rem]">
            {dropdownTitle}
          </span> */}
          {/* <Grow />
          <ChevronDown /> */}
        </Button>
      </DropdownTrigger>
      <DropdownMenu className="bg-zinc-200 dark:bg-zinc-800 rounded-lg">
        {/* <DropdownSection showDivider>
          <DropdownItem key="create-new-account">
            Create new account
          </DropdownItem>
        </DropdownSection> */}
        <DropdownItem key="logout" href="/auth/login">
          Logout
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
