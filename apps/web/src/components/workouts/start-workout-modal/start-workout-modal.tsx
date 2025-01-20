"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
  DialogActions,
  Divider,
} from "@mui/material";
import { PlusIcon, DumbbellIcon, SparklesIcon, Loader2Icon } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { WorkoutWithRelations } from "@local/db";
import { getWorkouts } from "@/app/api/workouts/get-workouts";
import { createWorkoutAndSessionAndRedirect } from "@/server/workouts";
import { startWorkoutSessionAndRedirect } from "@/server/workout-sessions/start-workout";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

type View = "main" | "existing" | "ai";

export function StartWorkoutModal({ isOpen, onClose }: Props) {
  const [view, setView] = useState<View>("main");
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: workoutsQuery, isLoading } = useQuery<{ records: WorkoutWithRelations[] }>({
    queryKey: ["workouts"],
    queryFn: getWorkouts,
  });

  const handleStartBlankWorkout = async () => {
    await createWorkoutAndSessionAndRedirect();
    onClose();
  };

  const handleStartExistingWorkout = async (workoutId: string) => {
    await startWorkoutSessionAndRedirect(workoutId);
    onClose();
  };

  const handleGenerateWorkout = async () => {
    setIsGenerating(true);
    try {
      // TODO: Implement AI workout generation
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulated delay
    } finally {
      setIsGenerating(false);
      onClose();
    }
  };

  const renderMainView = () => (
    <>
      <DialogTitle>Start a Workout</DialogTitle>
      <DialogContent>
        <List sx={{ pt: 1 }}>
          <ListItem disablePadding>
            <ListItemButton onClick={handleStartBlankWorkout}>
              <ListItemIcon>
                <PlusIcon size={20} />
              </ListItemIcon>
              <ListItemText
                primary="Blank Workout"
                secondary="Start with an empty workout and add exercises as you go"
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => setView("existing")}>
              <ListItemIcon>
                <DumbbellIcon size={20} />
              </ListItemIcon>
              <ListItemText primary="Use Existing Workout" secondary="Choose from your saved workout templates" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => setView("ai")}>
              <ListItemIcon>
                <SparklesIcon size={20} />
              </ListItemIcon>
              <ListItemText primary="AI Generated Workout" secondary="Let AI create a personalized workout for you" />
            </ListItemButton>
          </ListItem>
        </List>
      </DialogContent>
    </>
  );

  const renderExistingWorkoutsView = () => (
    <>
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>Choose a Workout</Box>
      </DialogTitle>
      <DialogContent>
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <Loader2Icon className="animate-spin" />
          </Box>
        ) : (
          <List sx={{ pt: 1 }}>
            {workoutsQuery?.records.map((workout) => (
              <ListItem key={workout.id} disablePadding>
                <ListItemButton onClick={() => handleStartExistingWorkout(workout.id)}>
                  <ListItemIcon>
                    <DumbbellIcon size={20} />
                  </ListItemIcon>
                  <ListItemText
                    primary={workout.name}
                    secondary={workout.description || `${workout.exercises?.length ?? 0} exercises`}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setView("main")}>Back</Button>
      </DialogActions>
    </>
  );

  const renderAiView = () => (
    <>
      <DialogTitle>Generate AI Workout</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Describe what kind of workout you want and our AI will create a personalized plan for you.
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          placeholder="E.g., I want a full body workout focusing on strength training, suitable for an intermediate level"
          value={aiPrompt}
          onChange={(e) => setAiPrompt(e.target.value)}
          disabled={isGenerating}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setView("main")}>Back</Button>
        <Button
          variant="contained"
          onClick={handleGenerateWorkout}
          disabled={!aiPrompt.trim() || isGenerating}
          startIcon={isGenerating ? <Loader2Icon className="animate-spin" /> : <SparklesIcon size={16} />}
        >
          {isGenerating ? "Generating..." : "Generate Workout"}
        </Button>
      </DialogActions>
    </>
  );

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      TransitionProps={{
        onExited: () => setView("main"),
      }}
    >
      {view === "main" && renderMainView()}
      {view === "existing" && renderExistingWorkoutsView()}
      {view === "ai" && renderAiView()}
    </Dialog>
  );
}
