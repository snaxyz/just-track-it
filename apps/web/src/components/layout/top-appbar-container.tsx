import { cn } from "@/lib/utils";

interface Props {
  children?: React.ReactNode;
  className?: string;
}

export function TopAppbarContainer({ children, className }: Props) {
  return (
    <header
      className={cn("fixed top-0 w-full z-100 flex items-center", className)}
    >
      {children}
    </header>
  );
}
