import { Box, Typography } from "@mui/material";
import { SxProps, Theme } from "@mui/material/styles";

interface Props {
  sx?: SxProps<Theme>;
}

export function Logo({ sx }: Props) {
  return (
    <Typography
      component="span"
      sx={{
        fontFamily: "Kalam",
        fontWeight: 500,
        letterSpacing: "-0.05em",
        ...sx,
      }}
    >
      Just track it
    </Typography>
  );
}
