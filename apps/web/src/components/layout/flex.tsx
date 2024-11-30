import { cn } from "@/lib/utils";

interface Props {
  children?: React.ReactNode;
  className?: string;
}

export function Flex({ children, className }: Props) {
  return <div className={cn("flex", className)}>{children}</div>;
}
