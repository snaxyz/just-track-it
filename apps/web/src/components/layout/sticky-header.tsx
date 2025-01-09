import { cn } from "@/lib/utils";

interface Props {
  children?: React.ReactNode;
  className?: string;
}

export function StickyHeader({ children, className }: Props) {
  return (
    <header className={cn("sticky top-0 w-full", className)}>{children}</header>
  );
}
