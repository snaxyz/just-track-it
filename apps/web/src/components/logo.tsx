import { kalam } from "@/app/fonts";
import { cn } from "@/lib/utils";

export function Logo() {
  return (
    <div className={cn(kalam.className, "md:text-2xl")}>Just Track It</div>
  );
}
