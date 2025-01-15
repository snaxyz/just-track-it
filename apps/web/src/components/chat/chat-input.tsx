import { IconButton, TextField } from "@mui/material";
import { SendIcon } from "lucide-react";
import { KeyboardEventHandler } from "react";

interface Props {
  onSubmit: (value: string) => void;
  onValueChange: (value: string) => void;
  value: string;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({ onSubmit, onValueChange, value, disabled, placeholder }: Props) {
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
    <TextField
      autoFocus
      multiline
      minRows={1}
      maxRows={4}
      placeholder={placeholder}
      variant="outlined"
      fullWidth
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      onKeyDown={handleKeyDown}
      slotProps={{
        input: {
          endAdornment: (
            <IconButton size="small" onClick={handleSubmit} sx={{ alignSelf: "flex-end" }}>
              <SendIcon size={18} />
            </IconButton>
          ),
        },
      }}
    />
  );
}
