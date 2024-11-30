import { cn } from "@/lib/utils";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export function MainContainer({ children, className }: Props) {
  return (
    <div className={cn("mx-auto w-full max-w-screen-xl", className)}>
      {children}
    </div>
  );
}
