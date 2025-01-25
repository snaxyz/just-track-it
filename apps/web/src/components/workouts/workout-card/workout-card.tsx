import { Box, Card, CardContent, CardHeader, IconButton, Typography } from "@mui/material";
import { ActivityIcon, HistoryIcon, PencilIcon } from "lucide-react";
import { Button } from "@mui/material";
import { SxProps, Theme } from "@mui/material/styles";
import Link from "next/link";

interface Props {
  sx?: SxProps<Theme>;
  id: string;
  name: string;
  description?: string;
  children?: React.ReactNode;
  onStartWorkout: (id: string) => void;
  onEditClick: (id: string) => void;
}

export function WorkoutCard({ sx, id, name, description, children, onStartWorkout, onEditClick }: Props) {
  return (
    <Card variant="outlined" sx={{ mb: 3, ...sx }}>
      <CardHeader
        title={name}
        action={
          <Box sx={{ display: "flex", gap: 1 }}>
            <Link href={`/history/${id}`}>
              <IconButton size="small">
                <HistoryIcon size={16} />
              </IconButton>
            </Link>
            <IconButton size="small" onClick={() => onEditClick(id)}>
              <PencilIcon size={16} />
            </IconButton>
          </Box>
        }
        sx={{
          "& .MuiCardHeader-title": {
            typography: "subtitle1",
            fontWeight: 500,
          },
        }}
      />
      <CardContent>
        {description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {description}
          </Typography>
        )}
        {children}
        <Button
          fullWidth
          variant="outlined"
          startIcon={<ActivityIcon size={16} />}
          color="primary"
          onClick={() => onStartWorkout(id)}
          sx={{ mt: 2 }}
        >
          Start workout
        </Button>
      </CardContent>
    </Card>
  );
}
