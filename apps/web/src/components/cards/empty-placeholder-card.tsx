import { Button } from "@nextui-org/react";
import { ActivityIcon } from "lucide-react";
import { ReactNode } from "react";

interface Props {
  Icon: React.ComponentType<{ className: string }>;
  title: string;
  message?: string;
  children: ReactNode;
}

export function EmptyPlaceholderCard({
  Icon,
  title,
  message,
  children,
}: Props) {
  return (
    <div className="bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-stone-900 dark:to-stone-950 rounded-lg p-6 flex flex-col justify-center items-center min-h-[200px]">
      <div className="flex flex-col items-center justify-center gap-6 text-center">
        <div className="p-2">
          <Icon className="w-12 h-12 text-default-400" />
        </div>
        <div className="space-y-2 mb-2">
          <h3 className="text-xl font-medium">{title}</h3>
          {message && <p className="text-default-500">{message}</p>}
        </div>
        {children}
      </div>
    </div>
  );
}
