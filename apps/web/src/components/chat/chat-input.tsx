import { Button, Textarea, TextAreaProps } from "@nextui-org/react";
import { SendIcon } from "lucide-react";
import { KeyboardEventHandler } from "react";

interface Props
  extends Omit<
    TextAreaProps,
    "endContent" | "classNames" | "autoFocus" | "onSubmit"
  > {
  onSubmit: (value: string) => void;
}

export function ChatInput({
  onSubmit,
  onValueChange,
  value,
  disabled,
  placeholder,
}: Props) {
  const handleSubmit = () => {
    if (!disabled && value && value.trim()) {
      onSubmit(value);
    }
  };

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (!e.shiftKey && e.key.toLowerCase() === "enter" && value) {
      e.preventDefault();
      return handleSubmit();
    }
  };
  return (
    <Textarea
      classNames={{
        input: "self-center",
      }}
      autoFocus
      minRows={1}
      placeholder={placeholder}
      variant="bordered"
      fullWidth
      endContent={
        <Button
          className="p-0 self-end"
          isIconOnly
          variant="light"
          size="sm"
          radius="full"
          onPress={handleSubmit}
        >
          <SendIcon size={18} />
        </Button>
      }
      value={value}
      onValueChange={onValueChange}
      onKeyDown={handleKeyDown}
    />
  );
}
