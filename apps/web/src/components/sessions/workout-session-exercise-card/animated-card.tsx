import { Card, CardProps } from "@mui/material";
import { keyframes } from "@mui/material/styles";
import { pink } from "@mui/material/colors";

const createFadeOutline = (color: string) => keyframes`
  0% {
    outline-color: ${color};
    outline-offset: 2px;
    outline-width: 2px;
  }
  70% {
    outline-color: ${color};
    outline-offset: 2px;
    outline-width: 2px;
  }
  100% {
    outline-color: ${color}00;
    outline-offset: 2px;
    outline-width: 2px;
  }
`;

interface AnimatedCardProps extends CardProps {
  showAnimation?: boolean;
}

export function AnimatedCard({ showAnimation, sx, ...props }: AnimatedCardProps) {
  return (
    <Card
      sx={[
        (theme) => ({
          position: "relative",
          transition: "all 0.2s ease-in-out",
          ...(showAnimation && {
            animation: `${createFadeOutline(theme.palette.primary.dark)} 2s ease-in-out`,
            outline: "2px solid transparent",
          }),
        }),
        (theme) =>
          theme.applyStyles("dark", {
            ...(showAnimation && {
              animation: `${createFadeOutline(pink[300])} 2s ease-in-out`,
            }),
          }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...props}
    />
  );
}
