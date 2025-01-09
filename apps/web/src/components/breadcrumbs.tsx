import { Breadcrumbs as MuiBreadcrumbs, Link as MuiLink } from "@mui/material";
import Link from "next/link";
import { ReactNode } from "react";

interface BreadcrumbItemProps {
  href: string;
  startContent?: ReactNode;
  children: ReactNode;
}

export function BreadcrumbItem({ href, startContent, children }: BreadcrumbItemProps) {
  return (
    <MuiLink component={Link} href={href} className="flex items-center gap-2 no-underline">
      {startContent}
      {children}
    </MuiLink>
  );
}

export function Breadcrumbs({ children }: { children: ReactNode }) {
  return <MuiBreadcrumbs>{children}</MuiBreadcrumbs>;
}
