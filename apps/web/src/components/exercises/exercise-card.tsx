import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  IconButton,
  Stack,
  Typography,
  Tooltip,
  CardActionArea,
  Badge,
} from "@mui/material";
import { PencilIcon, TimerIcon, WeightIcon, RepeatIcon, TrendingUpIcon, HistoryIcon } from "lucide-react";
import { EditExerciseModal } from "./edit-exercise-modal";
import { SxProps, Theme } from "@mui/material/styles";
import { useState } from "react";

interface Props {
  sx?: SxProps<Theme>;
  id: string;
  name: string;
  categories: string[];
  description?: string | null;
  hasReps?: boolean;
  hasWeight?: boolean;
  hasSets?: boolean;
  hasDuration?: boolean;
  lastUsed?: string; // ISO date string
  personalBest?: {
    weight?: number;
    reps?: number;
    date: string;
  };
  totalSessions?: number;
  onUpdate: (id: string, name: string, categories: string[]) => void;
  onDelete: (id: string) => void;
  onClick?: () => void;
}

export function ExerciseCard({
  sx,
  id,
  name,
  categories,
  description,
  hasReps,
  hasWeight,
  hasSets,
  hasDuration,
  lastUsed,
  personalBest,
  totalSessions,
  onUpdate,
  onDelete,
  onClick,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = (updatedName: string, updatedCategories: string[]) => {
    onUpdate(id, updatedName, updatedCategories);
    setIsOpen(false);
  };

  const handleDelete = () => {
    onDelete(id);
    setIsOpen(false);
  };

  const CardWrapper: React.ComponentType<any> = onClick ? CardActionArea : Box;

  return (
    <>
      <Card variant="outlined" sx={{ ...sx }}>
        <CardWrapper onClick={onClick}>
          <CardHeader
            title={name}
            action={
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(true);
                }}
                size="small"
              >
                <PencilIcon size={16} />
              </IconButton>
            }
            sx={{
              "& .MuiCardHeader-title": {
                typography: "subtitle1",
                fontWeight: 500,
              },
            }}
          />
          <CardContent>
            <Stack spacing={2}>
              {description && (
                <Typography variant="body2" color="text.secondary">
                  {description}
                </Typography>
              )}

              {/* Exercise Properties */}
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                {hasReps && (
                  <Tooltip title="Tracks repetitions">
                    <Chip icon={<RepeatIcon size={14} />} label="Reps" size="small" variant="filled" />
                  </Tooltip>
                )}
                {hasWeight && (
                  <Tooltip title="Tracks weight">
                    <Chip icon={<WeightIcon size={14} />} label="Weight" size="small" variant="filled" />
                  </Tooltip>
                )}
                {hasDuration && (
                  <Tooltip title="Tracks duration">
                    <Chip icon={<TimerIcon size={14} />} label="Duration" size="small" variant="filled" />
                  </Tooltip>
                )}
              </Box>

              {/* Personal Best */}
              {personalBest && (
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: "block" }}>
                    Personal Best
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <TrendingUpIcon size={14} />
                    <Typography variant="body2">
                      {personalBest.weight && `${personalBest.weight}kg `}
                      {personalBest.reps && `${personalBest.reps} reps `}
                      <Typography component="span" variant="caption" color="text.secondary">
                        on {new Date(personalBest.date).toLocaleDateString()}
                      </Typography>
                    </Typography>
                  </Stack>
                </Box>
              )}

              {/* Last Used */}
              {lastUsed && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <HistoryIcon size={14} />
                  <Typography variant="caption" color="text.secondary">
                    Last used {new Date(lastUsed).toLocaleDateString()}
                  </Typography>
                </Box>
              )}

              {/* Categories */}
              {categories.length > 0 && (
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: "block" }}>
                    Target Areas
                  </Typography>
                  <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                    {categories.map((category) => (
                      <Chip
                        key={category}
                        label={category}
                        size="small"
                        variant="outlined"
                        sx={{ textTransform: "capitalize" }}
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </Stack>
          </CardContent>
        </CardWrapper>
      </Card>
      <EditExerciseModal
        key={id}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        name={name}
        categories={categories}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </>
  );
}
