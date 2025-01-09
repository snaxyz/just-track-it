import { IconButton as MuiIconButton } from "@mui/material";
import type { IconButtonProps } from "@mui/material";

interface Props extends Omit<IconButtonProps, "size"> {
  size?: "sm" | "md" | "lg";
}

export function IconButton(props: Props) {
  const { children, size = "md", ...restProps } = props;

  // Map our size values to MUI sizes
  const muiSize = size === "sm" ? "small" : size === "lg" ? "large" : "medium";

  return (
    <MuiIconButton {...restProps} size={muiSize}>
      {children}
    </MuiIconButton>
  );
}
