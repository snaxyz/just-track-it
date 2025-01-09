import { cn } from "@/lib/utils";
import { Card, CardProps } from "@mui/material";

export function GradientCard({ className, children, ...props }: CardProps) {
  return (
    <Card
      className={cn("bg-gradient-to-br from-indigo-50 to-zinc-50 dark:from-indigo-950 dark:to-stone-950", className)}
      elevation={0}
      sx={{ borderRadius: 2 }}
      {...props}
    >
      {children}
    </Card>
  );
}
