import { Typography } from "@mui/material";
import { cn } from "@/lib/utils";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export function Title({ children, className }: Props) {
  return (
    <Typography variant="h5" className={cn("mb-3", className)}>
      {children}
    </Typography>
  );
}
