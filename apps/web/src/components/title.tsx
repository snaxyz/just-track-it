import { cn } from "@/lib/utils";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export function Title({ children, className }: Props) {
  return <div className={cn("text-xl mb-3", className)}>{children}</div>;
}
