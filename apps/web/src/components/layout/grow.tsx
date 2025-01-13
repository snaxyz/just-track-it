import { Box } from "@mui/material";
import { SxProps, Theme } from "@mui/material/styles";

interface Props {
  sx?: SxProps<Theme>;
  children?: React.ReactNode;
}

export function Grow({ sx, children }: Props) {
  return <Box sx={{ flexGrow: 1, ...sx }}>{children}</Box>;
}
