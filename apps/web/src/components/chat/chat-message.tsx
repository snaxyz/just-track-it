import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { cn } from "@/lib/utils";
import { BoxIcon, UserIcon, PlusIcon } from "lucide-react";
import { Card } from "@nextui-org/card";
import { ChatMessageModel } from "@local/db";
import { Button } from "@nextui-org/react";

interface Props {
  className?: string;
  message: Omit<ChatMessageModel, "createdAt" | "updatedAt">;
  onCreateWorkoutClick?: () => void;
}

export default function ChatMessage({
  className,
  message,
  onCreateWorkoutClick,
}: Props) {
  const responder = message.role === "user" ? "You" : "AI";
  const Icon = message.role === "user" ? UserIcon : BoxIcon;

  const components = {
    create_workout_button: () => (
      <Button
        variant="solid"
        startContent={<PlusIcon size={16} />}
        color="primary"
        onPress={onCreateWorkoutClick}
      >
        Create Workout
      </Button>
    ),
  };

  return (
    <Card
      className={cn(
        "mb-2",
        message.role === "ai" && "bg-zinc-300 dark:bg-zinc-800 p-2",
        message.role === "user" && "bg-transparent px-0 py-2",
        className
      )}
      shadow="none"
    >
      <div
        className={cn(
          "flex gap-2 w-full",
          message.role === "user" && "justify-end"
        )}
      >
        <div
          className={cn(
            "rounded-lg",
            message.role === "user" &&
              "px-3 pt-1 pb-2 bg-zinc-400 dark:bg-zinc-700",
            message.role === "ai" && "px-1 bg-zinc-300 dark:bg-zinc-800"
          )}
        >
          <span className="font-light text-xs mb-2">{responder}</span>
          <Markdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={components}
          >
            {message.content}
          </Markdown>
        </div>
      </div>
    </Card>
  );
}
