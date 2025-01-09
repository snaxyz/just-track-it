import { kalam } from "@/app/fonts";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
}

export function Logo({ className }: Props) {
  return (
    <div className={cn(kalam.className, "md:text-2xl", className)}>
      Just Track It
    </div>
  );
}
