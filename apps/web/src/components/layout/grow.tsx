import { cn } from "@/lib/utils";

export function Grow({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return <div className={cn("grow", className)}>{children}</div>;
}
