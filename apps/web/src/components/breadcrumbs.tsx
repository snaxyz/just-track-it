import { Breadcrumbs as MuiBreadcrumbs, Link as MuiLink } from "@mui/material";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

interface BreadcrumbItemProps {
  href: string;
  children: ReactNode;
  startContent?: ReactNode;
}

export function BreadcrumbItem({ href, children, startContent }: BreadcrumbItemProps) {
  return (
    <MuiLink
      component={Link}
      href={href}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        textDecoration: "none",
        color: "text.primary",
        "&:hover": {
          color: "text.secondary",
        },
      }}
    >
      {startContent}
      {children}
    </MuiLink>
  );
}

interface BreadcrumbsProps {
  children: ReactNode;
}

export function Breadcrumbs({ children }: BreadcrumbsProps) {
  return (
    <MuiBreadcrumbs
      separator={<ChevronRightIcon size={16} />}
      sx={{
        "& .MuiBreadcrumbs-separator": {
          color: "text.secondary",
        },
      }}
    >
      {children}
    </MuiBreadcrumbs>
  );
}
