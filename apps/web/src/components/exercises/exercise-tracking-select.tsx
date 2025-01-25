"use client";

import { Autocomplete, AutocompleteRenderGetTagProps, Chip, TextField } from "@mui/material";

export type TrackingOption = "weight" | "reps" | "duration" | "sets";

interface TrackingItem {
  id: TrackingOption;
  name: string;
  description: string;
}

const trackingOptions: TrackingItem[] = [
  { id: "reps", name: "Repetitions", description: "Reps per set" },
  { id: "weight", name: "Weight", description: "Weight used" },
  { id: "duration", name: "Duration", description: "Time-based tracking" },
];

interface Props {
  selectedOptions: TrackingOption[];
  onOptionsChange: (options: TrackingOption[]) => void;
  fullWidth?: boolean;
}

function renderTags(value: TrackingItem[], getTagProps: AutocompleteRenderGetTagProps) {
  return value.map((option, index) => {
    const { key, ...props } = getTagProps({ index });
    return <Chip key={key} label={option.name} {...props} title={option.description} />;
  });
}

export function ExerciseTrackingSelect({ selectedOptions, onOptionsChange, fullWidth }: Props) {
  return (
    <Autocomplete
      multiple
      fullWidth={fullWidth}
      options={trackingOptions}
      getOptionLabel={(option) => option.name}
      value={trackingOptions.filter((opt) => selectedOptions.includes(opt.id))}
      onChange={(_, newValue) => {
        onOptionsChange(newValue.map((v) => v.id));
      }}
      renderInput={(params) => <TextField {...params} label="Tracking options" fullWidth={fullWidth} />}
      renderTags={renderTags}
    />
  );
}
