import { Box, Card, CardContent, Typography } from "@mui/material";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface Props {
  Icon: LucideIcon;
  title: string;
  message?: string;
  children: ReactNode;
}

export function EmptyPlaceholderCard({ Icon, title, message, children }: Props) {
  return (
    <Card variant="outlined">
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 200,
          p: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            textAlign: "center",
          }}
        >
          <Box sx={{ p: 2 }}>
            <Icon size={32} />
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 2 }}>
            <Typography variant="h6" component="h3" sx={{ fontWeight: 500 }}>
              {title}
            </Typography>
            {message && <Typography sx={{ color: "text.secondary" }}>{message}</Typography>}
          </Box>
          {children}
        </Box>
      </CardContent>
    </Card>
  );
}
