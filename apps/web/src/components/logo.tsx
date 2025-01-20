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
        fontFamily: "Permanent Marker",
        fontWeight: 400,
        ...sx,
      }}
    >
      Just Track It
    </Typography>
  );
}
