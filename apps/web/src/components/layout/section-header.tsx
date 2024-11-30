import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  children: React.ReactNode;
  startContent?: React.ReactElement<any>;
}

export function SectionHeader({ className, startContent, children }: Props) {
  return (
    <div
      className={cn(
        "mt-1 text-zinc-700 dark:text-zinc-300 text-sm",
        startContent && "flex gap-1 items-center",
        className
      )}
    >
      {startContent}
      {children}
    </div>
  );
}
