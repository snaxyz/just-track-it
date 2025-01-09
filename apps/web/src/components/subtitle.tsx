import { Typography } from "@mui/material";
import { cn } from "@/lib/utils";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export function Subtitle({ children, className }: Props) {
  return (
    <Typography variant="h6" className={cn("mb-3", className)}>
      {children}
    </Typography>
  );
}
