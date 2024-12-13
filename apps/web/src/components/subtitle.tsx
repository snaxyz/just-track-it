import { cn } from "@/lib/utils";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export function Subtitle({ children, className }: Props) {
  return <div className={cn("text-lg mb-3", className)}>{children}</div>;
}
